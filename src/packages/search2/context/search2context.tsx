import React, { createContext, useContext, useState, useCallback } from "react";
import type {
  Search2ContextType,
  SearchConfig,
  SearchResultUser,
  SearchSelection,
} from "../search2.types";

const Search2Context = createContext<Search2ContextType | undefined>(undefined);

export const Search2Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<SearchConfig>([]);
  const [configLoading, setConfigLoading] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  const [selections, setSelections] = useState<SearchSelection[]>([]);

  const [searchResults, setSearchResults] = useState<SearchResultUser[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const loadConfig = useCallback(() => {
    setConfigLoading(true);
    setConfigError(null);
    fetch("https://cairnsgames.co.za/php/search/config.php", {
      headers: { Accept: "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: SearchConfig) => {
        setConfig(data);
        setConfigLoading(false);
      })
      .catch((err: Error) => {
        setConfigError(err.message);
        setConfigLoading(false);
      });
  }, []);

  const addSelection = useCallback((item: SearchSelection) => {
    setSelections((prev) => {
      const alreadyExists = prev.some(
        (s) => s.type === item.type && s.id === item.id
      );
      if (alreadyExists) return prev;
      return [...prev, item];
    });
  }, []);

  const removeSelection = useCallback(
    (type: SearchSelection["type"], id: number) => {
      setSelections((prev) => prev.filter((s) => !(s.type === type && s.id === id)));
    },
    []
  );

  const clearSelections = useCallback(() => setSelections([]), []);

  const executeSearch = useCallback(() => {
    const roles = selections
      .filter((s) => s.type === "role")
      .map((s) => s.id);
    const groups = selections
      .filter((s) => s.type === "group")
      .map((s) => s.id);
    const offerings = selections
      .filter((s) => s.type === "offering")
      .map((s) => s.id);

    setSearchLoading(true);
    setSearchError(null);
    setHasSearched(false);

    fetch("https://cairnsgames.co.za/php/search/search.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ roles, groups, offerings }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: { users: SearchResultUser[] }) => {
        setSearchResults(data.users ?? []);
        setSearchLoading(false);
        setHasSearched(true);
      })
      .catch((err: Error) => {
        setSearchError(err.message);
        setSearchLoading(false);
        setHasSearched(true);
      });
  }, [selections]);

  return (
    <Search2Context.Provider
      value={{
        config,
        configLoading,
        configError,
        loadConfig,
        selections,
        addSelection,
        removeSelection,
        clearSelections,
        searchResults,
        searchLoading,
        searchError,
        executeSearch,
        hasSearched,
      }}
    >
      {children}
    </Search2Context.Provider>
  );
};

export const useSearch2 = (): Search2ContextType => {
  const ctx = useContext(Search2Context);
  if (!ctx) throw new Error("useSearch2 must be used within a Search2Provider");
  return ctx;
};
