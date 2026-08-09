import { useState, useEffect, useCallback } from "react";
import { combineUrlAndPath } from "../functions/combineurlandpath";
import { logUntypedResponse } from "../functions/loguntypedresponse";

type GAPIItem = Record<string, unknown>;

type UseGAPIV2Config = {
  shouldLoad?: boolean;
  itemKey?: string;
  updateEndpoint?: string;
  insertEndpoint?: string;
  deleteEndpoint?: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
};

const templateString = (str: string, params?: Record<string, string>): string => {
  if (!params) return str;

  const newstr = str.replace(/{(\w+)}/g, (_, key) => {
    return params.hasOwnProperty(key) ? params[key] : key;
  });
  return newstr;
};

const useGAPIV2 = (baseurl: string, configName: string, config: UseGAPIV2Config = {}) => {
  const {
    shouldLoad = true,
    itemKey = "id",
    updateEndpoint = `${baseurl}${configName}`,
    insertEndpoint = `${baseurl}${configName}`,
    deleteEndpoint = `${baseurl}${configName}`,
    headers = {},
    params = {},
  } = config;
  const [data, setData] = useState<GAPIItem[]>([]);
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [childrenData, setChildrenData] = useState<Record<string, unknown>>({});

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
      const result = logUntypedResponse<GAPIItem[]>("usegapiv2.fetchData", await response.json());
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

  const getItem = async (id: string | number) => {
    const existingItem = data.find((item) => item[itemKey] === id);
    if (existingItem) {
      return existingItem;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        combineUrlAndPath(baseurl, `${configName}/${id}`)
      );
      return logUntypedResponse<GAPIItem>("usegapiv2.getItem", await response.json());
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (item: GAPIItem) => {
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
      const updatedItems = logUntypedResponse<GAPIItem[]>("usegapiv2.updateItem", await response.json());
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

  const insertItem = async (item: GAPIItem) => {
    setIsLoading(true);
    try {
      const response = await fetch(insertEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(item),
      });
      const newItem = logUntypedResponse<GAPIItem>("usegapiv2.insertItem", await response.json());
      setData((prevData) => [...prevData, newItem]);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id: string | number) => {
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

  const getChildren = async (id: string | number, subkeyName: string) => {
    const cacheKey = `${id}-${subkeyName}`;
    if (childrenData[cacheKey]) {
      return childrenData[cacheKey];
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        combineUrlAndPath(baseurl, `${configName}/${id}/${subkeyName}`)
      );
      const result = logUntypedResponse<unknown>("usegapiv2.getChildren", await response.json());
      setChildrenData((prevData) => ({ ...prevData, [cacheKey]: result }));
      return result;
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = useCallback((id?: string | number, subkeyName?: string) => {
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
