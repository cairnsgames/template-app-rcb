import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '../auth/context/useuser';
import useTenant from '../tenant/context/usetenant';

const NewsContext = createContext();

export const useNews = () => useContext(NewsContext);

export const NewsProvider = ({ children }) => {
  const [newsItems, setNewsItems] = useState([]);
  const [myNewsItems, setMyNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { tenant } = useTenant();
  const { user, token } = useUser();

  const headers = {
    'Content-Type': 'application/json',
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
        const response = await fetch(`${process.env.REACT_APP_NEWS_API}/api.php/news`, { headers });
        if (!response.ok) {
          throw new Error('Failed to fetch news');
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
    
    if (!user) {
      setError('User not authenticated');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_NEWS_API}/api.php/user/${user.id}/news`, { headers });
      if (!response.ok) {
        throw new Error('Failed to fetch my news items');
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
      const response = await fetch(`${process.env.REACT_APP_NEWS_API}/api.php/news`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newsItem),
      });

      if (!response.ok) {
        throw new Error('Failed to create news item');
      }

      const newItem = await response.json();
      // setNewsItems((prevItems) => [...prevItems, newItem]);
      fetchMyNewsItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateNewsItem = async (id, updatedNewsItem) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_NEWS_API}/api.php/news/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedNewsItem),
      });

      if (!response.ok) {
        throw new Error('Failed to update news item');
      }

      const updatedItem = await response.json();
      
      fetchMyNewsItems();
      // setNewsItems((prevItems) =>
      //   prevItems.map((item) => (item.id === id ? updatedItem : item))
      // );
    } catch (err) {
      setError(err.message);
    }
  };

  const getNewsById = (id) => {
    return newsItems.find((item) => item.id === Number(id));
  }

  return (
    <NewsContext.Provider value={{ newsItems, myNewsItems, loading, error, createNewsItem, updateNewsItem, fetchMyNewsItems, getNewsById }}>
      {children}
    </NewsContext.Provider>
  );
};
