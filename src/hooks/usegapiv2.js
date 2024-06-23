import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'http://localhost/cairnsgames/php/apitesting/api.php/';

const useGAPIV2 = (
  configName,
  {
    shouldLoad = true,
    itemKey = 'id',
    updateEndpoint = `${API_BASE_URL}${configName}`,
    insertEndpoint = `${API_BASE_URL}${configName}`,
    deleteEndpoint = `${API_BASE_URL}${configName}`,
  } = {}
) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [childrenData, setChildrenData] = useState({});

  const fetchData = useCallback(async () => {
    if (!shouldLoad) {
      setData([]);
      return;
    }
    setIsLoading(true);
    
    console.log("FETCH DATA", configName);
    try {
      const response = await fetch(`${API_BASE_URL}${configName}`);
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error(err)
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [configName, shouldLoad]);

  useEffect(() => {
    console.log("FETCH INITIAL DATA", configName);
    fetchData();
  }, [fetchData]);

  const getItem = async (id) => {
    const existingItem = data.find((item) => item[itemKey] === id);
    if (existingItem) {
      return existingItem;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}${configName}/${id}`);
      return await response.json();
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (item) => {
    console.log("UPDATE ITEM", item);
    setIsLoading(true);
    try {
      const response = await fetch(`${updateEndpoint}/${item[itemKey]}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const updatedItem = await response.json();
      setData((prevData) =>
        prevData.map((d) => (d[itemKey] === updatedItem[itemKey] ? updatedItem : d))
      );
      return updatedItem;
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const insertItem = async (item) => {
    setIsLoading(true);
    try {
      const response = await fetch(insertEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const newItem = await response.json();
      setData((prevData) => [...prevData, newItem]);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id) => {
    setIsLoading(true);
    try {
      await fetch(`${deleteEndpoint}/${id}`, {
        method: 'DELETE',
      });
      setData((prevData) => prevData.filter((d) => d[itemKey] !== id));
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getChildren = async (id, subkeyName) => {
    const cacheKey = `${id}-${subkeyName}`;
    if (childrenData[cacheKey]) {
      return childrenData[cacheKey];
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}${configName}/${id}/${subkeyName}`);
      const result = await response.json();
      setChildrenData((prevData) => ({ ...prevData, [cacheKey]: result }));
      return result;
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = (id, subkeyName) => {
    if (id && subkeyName) {
      const cacheKey = `${id}-${subkeyName}`;
      setChildrenData((prevData) => ({ ...prevData, [cacheKey]: null }));
      getChildren(id, subkeyName);
    } else {
      fetchData();
    }
  };

  return {
    data,
    error,
    isLoading,
    item: getItem,
    update: updateItem,
    insert: insertItem,
    delete: deleteItem,
    children: getChildren,
    refresh,
  };
};

export default useGAPIV2;
