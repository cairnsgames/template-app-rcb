import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "../../auth/context/useuser";
import useTenant from "../../tenant/context/usetenant";
import { combineUrlAndPath } from "../../../functions/combineurlandpath";
import { useToast } from "../../toasts/usetoast";

const NewsContext = createContext();

export const useNews = () => useContext(NewsContext);

export const NewsProvider = ({ children }) => {
  const [newsItems, setNewsItems] = useState([]);
  const [myNewsItems, setMyNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ newItemsOnly: true }); // Filters object

  const { addToast } = useToast();

  const { tenant } = useTenant();
  const { user, token } = useUser();

  const headers = {
    "Content-Type": "application/json",
    APP_ID: tenant,
    token: token,
  };

  if (!process.env.REACT_APP_NEWS_API) {
    throw new Error(
      "NewsProvider: REACT_APP_NEWS_API environment variable is required"
    );
  }

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          combineUrlAndPath(process.env.REACT_APP_NEWS_API, `api.php/news`),
          { headers }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        const data = await response.json();
        setNewsItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const fetchMyNewsItems = async () => {
    console.log("*** News *** Fetching my news items");
    if (!user) {
      setError("User not authenticated");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_NEWS_API,
          `api.php/user/${user.id}/news`
        ),
        { headers }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch my news items");
      }
      const data = await response.json();
      setMyNewsItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createNewsItem = async (newsItem) => {
    try {
      fetch(combineUrlAndPath(process.env.REACT_APP_NEWS_API, `api.php/news`), {
        method: "POST",
        headers,
        body: JSON.stringify(newsItem),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("*** News *** News item created", data);
          addToast("News", "News item created", "Success");
          fetchMyNewsItems();
        });
    } catch (err) {
      setError(err.message);
    }
  };

  const updateNewsItem = async (id, updatedNewsItem) => {
    try {
      const response = await fetch(
        combineUrlAndPath(process.env.REACT_APP_NEWS_API, `api.php/news/${id}`),
        {
          method: "PUT",
          headers,
          body: JSON.stringify(updatedNewsItem),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update news item");
      }

      const updatedItem = await response.json();
      
      addToast("News", "News item updated", "Success");

      fetchMyNewsItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteNewsItem = async (id) => {
    try {
      const response = await fetch(
        combineUrlAndPath(process.env.REACT_APP_NEWS_API, `api.php/news/${id}`),
        {
          method: "DELETE",
          headers,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete news item");
      }

      addToast("News", "News item deleted", "Success");
      fetchMyNewsItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const getNewsById = (id) => {
    return newsItems.find((item) => item.id === Number(id));
  };

  const filterNewsItems = () => {
    const today = new Date().toISOString().split('T')[0] + " 00:00:00"; // Get today's date in the required format
    return filters.newItemsOnly ? myNewsItems.filter(item => item.expires >= today) : myNewsItems; // Filter based on filters object
  };

  const news = filterNewsItems(); // Call the filter function

  const setFilterField = (field, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [field]: value })); // Update specific filter field
  };

  const clearFilters = () => {
    setFilters({ newItemsOnly: true }); // Reset filters to default state
  };

  return (
    <NewsContext.Provider
      value={{
        newsItems,
        myNewsItems,
        loading,
        error,
        createNewsItem,
        updateNewsItem,
        deleteNewsItem,
        fetchMyNewsItems,
        getNewsById,
        news, // Expose the filtered news variable
        filters, // Expose the filters object
        setFilters, // Expose the setter for filters
        setFilterField, // Expose the function to set a specific filter field
        clearFilters, // Expose the function to clear filters
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};
