import { useState, useEffect, useCallback } from "react";

const templateString = (str, params) => {
  if (!params) return str;

  const newstr = str.replace(/{(\w+)}/g, (_, key) => {
    return params.hasOwnProperty(key) ? params[key] : key;
  });
  return newstr;
};

const useGAPIV2 = (baseurl, configName, config = {}) => {
  const {
    shouldLoad = true,
    itemKey = "id",
    updateEndpoint = `${baseurl}${configName}`,
    insertEndpoint = `${baseurl}${configName}`,
    deleteEndpoint = `${baseurl}${configName}`,
    headers = {},
    params = {},
  } = config;
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [childrenData, setChildrenData] = useState({});

  const fetchData = useCallback(async () => {
    // if (!shouldLoad) {
    //   setData([]);
    //   return;
    // }
    setIsLoading(true);

    try {
      const url = templateString(`${baseurl}${configName}`, params);
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json", ...headers },
      });
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [configName, shouldLoad]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getItem = async (id) => {
    const existingItem = data.find((item) => item[itemKey] === id);
    if (existingItem) {
      return existingItem;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        combineUrlAndPath(API_BASE_URL, `${configName}/${id}`)
      );
      return await response.json();
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (item) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        combineUrlAndPath(updateEndpoint, `${item[itemKey]}`),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...headers },
          body: JSON.stringify(item),
        }
      );
      const updatedItems = await response.json();
      const updatedData = data.map((d) => {
        const foundItem = updatedItems.find(
          (item) => item[itemKey] === d[itemKey]
        );
        return foundItem ? foundItem : d;
      });
      setData(updatedData);
      return updatedItems;
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
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
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
      await fetch(combineUrlAndPath(deleteEndpoint, `${id}`), {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...headers },
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
      const response = await fetch(
        combineUrlAndPath(API_BASE_URL, `${configName}/${id}/${subkeyName}`)
      );
      const result = await response.json();
      setChildrenData((prevData) => ({ ...prevData, [cacheKey]: result }));
      return result;
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = useCallback((id, subkeyName) => {
    if (id && subkeyName) {
      const cacheKey = `${id}-${subkeyName}`;
      setChildrenData((prevData) => ({ ...prevData, [cacheKey]: null }));
      getChildren(id, subkeyName);
    } else {
      fetchData();
    }
  }, []);

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
