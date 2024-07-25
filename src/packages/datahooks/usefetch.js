import { useState, useEffect, useCallback } from "react";
import useUser from "../auth/context/useuser";
import useTenant from "../tenant/context/usetenant";

const useFetch = (url, options) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { token } = useUser();
  const { tenant } = useTenant();

  const fetchData = async () => {
    setLoading(true);

    const controller = new AbortController();
    const signal = controller.signal;
    if (!options) {
      options = { headers: [] };
    }
    if (!options.headers) {
      options.headers = [];
    }
    if (!options?.headers?.token) {
      options.headers.token = token;
    }
    if (!options?.headers?.APP_ID) {
      options.headers.APP_ID = tenant;
    }
    fetch(url, {
      signal,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setData(data);
        } else {
          setData([data]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
    return controller;
  };
  useEffect(() => {
    if (url) {
      const controller = fetchData();

      return () => {
        if (controller && controller.abort) {
          controller.abort();
        }
      };
    } else {
      setData([]);
    }
  }, [url]);

  // mutates in memory record, does not save to database
  const mutate = useCallback((field, value, newrecord) => {
    let newData = data.map((row) => {
      if (row[field] === value) {
        return newrecord;
      }
      return row;
    });
    if (data.find((row) => row[field] === value) === undefined) {
      newData.push(newrecord);
    }
    setData(newData);
  },[data]);

  const remove = useCallback((field, value) => {
    let newData = data.filter((row) => {
      return row[field] !== value;
    });
    setData(newData);
  },[data]);

  return {
    data,
    mutate,
    remove,
    isLoading: loading,
    isError: error,
    refetch: fetchData,
  };
};

export default useFetch;
