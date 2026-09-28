import React, { createContext, useContext, useState, useCallback } from "react";
import { logUntypedResponse } from "../../../functions/loguntypedresponse";
import type {
  Search2ContextType,
  SearchConfig,
  SearchPayload,
  SearchResultUser,
  SearchSelection,
} from "../search2.types";

const Search2Context = createContext<Search2ContextType | undefined>(undefined);

const MIN_FREE_TEXT_LENGTH = 3;

const buildPayloadFromSelections = (selections: SearchSelection[]): SearchPayload => ({
  roles: selections.filter((s) => s.type === "role").map((s) => s.id),
  groups: selections.filter((s) => s.type === "group").map((s) => s.id),
  offerings: selections.filter((s) => s.type === "offering").map((s) => s.id),
});

const buildPayloadFromQueryMatches = (
  config: SearchConfig,
  query: string
): SearchPayload => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return { roles: [], groups: [], offerings: [] };
  }

  return config.reduce<SearchPayload>(
    (acc, role) => {
      if (role.name.toLowerCase().includes(normalizedQuery)) {
        acc.roles.push(role.id);
      }

      role.offerings?.forEach((offering) => {
        if (offering.name.toLowerCase().includes(normalizedQuery)) {
          acc.offerings.push(offering.id);
        }
      });

      role.groups?.forEach((group) => {
        if (group.name.toLowerCase().includes(normalizedQuery)) {
          acc.groups.push(group.id);
        }

        group.offerings?.forEach((offering) => {
          if (offering.name.toLowerCase().includes(normalizedQuery)) {
            acc.offerings.push(offering.id);
          }
        });
      });

      return acc;
    },
    { roles: [], groups: [], offerings: [] }
  );
};

const mergeUnique = (first: number[], second: number[]): number[] =>
  Array.from(new Set([...first, ...second]));

const hasTaxonomyMatch = ({ roles, groups, offerings }: SearchPayload): boolean =>
  roles.length > 0 || groups.length > 0 || offerings.length > 0;

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

  const loadConfig = useCallback(async () => {
    setConfigLoading(true);
    setConfigError(null);
    try {
      const res = await fetch("https://cairnsgames.co.za/php/search/config.php", {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = logUntypedResponse<SearchConfig>(
        "search2.config -> https://cairnsgames.co.za/php/search/config.php",
        await res.json()
      );
      setConfig(data);
    } catch (err) {
      setConfigError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setConfigLoading(false);
    }
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

  const executeSearch = useCallback(async (query?: string) => {
    const trimmedQuery = query?.trim() ?? "";
    const selectionPayload = buildPayloadFromSelections(selections);
    const queryPayload =
      trimmedQuery.length >= MIN_FREE_TEXT_LENGTH
        ? buildPayloadFromQueryMatches(config, trimmedQuery)
        : { roles: [], groups: [], offerings: [] };

    const payload: SearchPayload = {
      roles: mergeUnique(selectionPayload.roles, queryPayload.roles),
      groups: mergeUnique(selectionPayload.groups, queryPayload.groups),
      offerings: mergeUnique(selectionPayload.offerings, queryPayload.offerings),
    };

    if (trimmedQuery.length >= MIN_FREE_TEXT_LENGTH && !hasTaxonomyMatch(queryPayload)) {
      payload.name = trimmedQuery;
    }

    setSearchLoading(true);
    setSearchError(null);
    setHasSearched(false);

    try {
      const res = await fetch("https://cairnsgames.co.za/php/search/search.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = logUntypedResponse<{ users: SearchResultUser[] }>(
        "search2.search -> https://cairnsgames.co.za/php/search/search.php",
        await res.json()
      );
      setSearchResults(data.users ?? []);
      setHasSearched(true);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Unknown error");
      setHasSearched(true);
    } finally {
      setSearchLoading(false);
    }
  }, [config, selections]);

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
