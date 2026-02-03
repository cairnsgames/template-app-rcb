import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { mockClasses } from "../mockData";
import { addDays, addMonths, addWeeks, isBefore, startOfDay } from "date-fns";
import { useTenant } from "../../tenant/context/usetenant";
import { useUser } from "../../auth/context/useuser";
import { combineUrlAndPath } from "../../../functions/combineurlandpath";

const ClassContext = createContext(undefined);

// Custom debounce function
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);

  const debouncedFunction = (...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFunction;
};

export const ClassProvider = ({ children, currentRole }) => {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState(""); // Add search state
  const [role, setRole] = useState(currentRole);
  const { tenant } = useTenant();
  const { token } = useUser();

  if (!process.env.REACT_APP_KLOKO_API) {
    throw new Error(
      "ClassProvider: REACT_APP_KLOKO_API environment variable is required",
    );
  }

  const fetchClasses = async (searchValue) => {
    const body = { search: searchValue };
    try {
      const url = combineUrlAndPath(
        process.env.REACT_APP_KLOKO_API,
        role === "teacher" ? "api.php/myclasses" : "api.php/classes",
      );
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          app_id: tenant,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body), // Include search in the body
      });
      if (!response.ok) {
        throw new Error("Failed to fetch classes");
      }
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const debouncedFetchClasses = useDebounce(fetchClasses, 300); // Use custom debounce

  useEffect(() => {
    debouncedFetchClasses(search); // Call debounced fetch on search change
    return () => {}; // Cleanup handled in useDebounce
  }, [search, tenant, token, role]);

  useEffect(() => {}, [classes]);

  const generateRepeatedClasses = (newClass) => {
    if (!newClass.repeatPattern) return [newClass];

    const repeatedClasses = [newClass];
    const startDate = new Date(newClass.start_time);
    const endDate = new Date(newClass.end_time);
    const untilDate = new Date(newClass.repeatPattern.until);
    let currentDate = startDate;

    while (isBefore(startOfDay(currentDate), startOfDay(untilDate))) {
      let nextDate;
      switch (newClass.repeatPattern.type) {
        case "daily":
          nextDate = addDays(currentDate, 1);
          break;
        case "weekly":
          nextDate = addWeeks(currentDate, 1);
          break;
        case "monthly":
          nextDate = addMonths(currentDate, 1);
          break;
      }

      const timeDiff = endDate.getTime() - startDate.getTime();
      const nextEndDate = new Date(nextDate.getTime() + timeDiff);

      repeatedClasses.push({
        ...newClass,
        start_time: nextDate,
        end_time: nextEndDate,
      });

      currentDate = nextDate;
    }

    return repeatedClasses;
  };

  const addClass = async (newClass) => {
    const repeatedClasses = generateRepeatedClasses(newClass);

    try {
      const responses = await Promise.all(
        repeatedClasses.map((cls) =>
          fetch(
            combineUrlAndPath(process.env.REACT_APP_KLOKO_API, "api.php/event"),
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                app_id: tenant,
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(cls),
            },
          ),
        ),
      );

      const successfulClasses = [];
      for (const [index, response] of responses.entries()) {
        if (response.ok) {
          const data = await response.json();
          successfulClasses.push({ ...repeatedClasses[index], ...data });
        } else {
          console.error(
            `Failed to post class with id ${repeatedClasses[index].id}`,
          );
        }
      }

      const newClasses = [...classes, ...successfulClasses];
      setClasses(newClasses);
    } catch (error) {
      console.error("Error adding classes:", error);
    }
  };

  const updateClass = (id, updatedClass) => {
    fetch(combineUrlAndPath(
        process.env.REACT_APP_KLOKO_API,`api.php/event/${id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        app_id: tenant,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedClass),
    });
    setClasses((prev) =>
      prev.map((cls) => (cls.id === id ? { ...cls, ...updatedClass } : cls)),
    );
  };

  const deleteClass = (id) => {
    setClasses((prev) => prev.filter((cls) => cls.id !== id));
  };

  return (
    <ClassContext.Provider
      value={{
        classes,
        addClass,
        updateClass,
        deleteClass,
        search,
        setSearch,
        role,
        setRole,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};

export const useClasses = () => {
  const context = useContext(ClassContext);
  if (context === undefined) {
    throw new Error("useClasses must be used within a ClassProvider");
  }
  return context;
};
