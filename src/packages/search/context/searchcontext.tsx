import React, { createContext, useContext } from "react";
import { isUntypedResponseLoggingEnabled } from "../../../functions/loguntypedresponse";
import { useNews } from "../../news/context/newscontext";
import useEvents from "../../kloko/context/useevents";
import { usePartner } from "../../partner/context/partnercontext";
import { useUser } from "../../auth/context/useuser";
import type {
  EventsProviderValue,
  NewsProviderValue,
  PartnerProviderValue,
  SearchContextType,
  SearchEventResultItem,
  SearchLocation,
  SearchPartnerResultItem,
  SearchResultItem,
  SearchRoleSelection,
  SearchTypeFilter,
  UserProviderValue,
} from "../search.types";

const SearchContext = createContext<SearchContextType | null>(null);

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { newsItems, setLocation: setNewsLocation } = useNews() as NewsProviderValue;
  const { setLocation: setEventLocation, classes, events } = useEvents() as EventsProviderValue;
  const { partners, setLocation: setPartnerLocation } = usePartner() as PartnerProviderValue;
  const { defaultLocation } = useUser() as UserProviderValue;

  React.useEffect(() => {
    if (!isUntypedResponseLoggingEnabled()) {
      return;
    }

    console.warn(
      "[untyped-response] search.newsItems: no TypeScript type is declared yet; source should be NEWS API api.php/localnews via NewsProvider"
    );
    console.warn(
      "[untyped-response] search.events/classes: no TypeScript type is declared yet; source should be KLOKO API api.php/events via KlokoMyEventProvider"
    );
    console.warn(
      "[untyped-response] search.partners: no TypeScript type is declared yet; source should be PARTNER API api.php/localpartners via PartnerProvider"
    );
  }, []);

  const [selectedTypes, setSelectedTypes] = React.useState<Set<SearchTypeFilter>>(new Set());
  const [selectedRoles, setSelectedRoles] = React.useState<SearchRoleSelection[]>([]);
  const partnerRoleIds = [26, 27, 28, 29, 30];

  const toggleRole = (roleId: SearchRoleSelection) => {
    const current = Array.isArray(selectedRoles) ? [...selectedRoles] : [];
    const has = current.includes(roleId);

    if (roleId === "ALL_PARTNERS") {
      if (!has) {
        const next = Array.from(new Set<SearchRoleSelection>(["ALL_PARTNERS", ...current, ...partnerRoleIds]));
        setSelectedRoles(next);
      } else {
        const next = current.filter(
          (role) => role !== "ALL_PARTNERS" && !(typeof role === "number" && partnerRoleIds.includes(role))
        );
        setSelectedRoles(next);
      }
      return;
    }

    if (!has) {
      const next = Array.from(new Set<SearchRoleSelection>([...current, roleId]));
      const allPresent = partnerRoleIds.every((id) => next.includes(id));
      if (allPresent && !next.includes("ALL_PARTNERS")) next.push("ALL_PARTNERS");
      setSelectedRoles(next);
      return;
    }

    const next = current.filter((role) => role !== roleId && role !== "ALL_PARTNERS");
    setSelectedRoles(next);
  };

  const toggleType = (type: SearchTypeFilter) => {
    const next = new Set(selectedTypes);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    setSelectedTypes(next);
  };

  const [showResults, setShowResults] = React.useState(false);
  const [tempTypes, setTempTypes] = React.useState<Set<SearchTypeFilter>>(new Set());
  const [tempLocation, setTempLocation] = React.useState<SearchLocation | null>(null);
  const [tempPartnerRoles, setTempPartnerRoles] = React.useState<Set<number>>(new Set());
  const [tempFromDate, setTempFromDate] = React.useState("");
  const [tempToDate, setTempToDate] = React.useState("");

  const [dateFrom, setDateFrom] = React.useState<Date | null>(null);
  const [dateTo, setDateTo] = React.useState<Date | null>(null);

  const toggleTempType = (type: SearchTypeFilter) => {
    const next = new Set(tempTypes);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    setTempTypes(next);
  };

  const toggleTempPartnerRole = (roleId: number) => {
    const next = new Set(tempPartnerRoles);
    if (next.has(roleId)) next.delete(roleId);
    else next.add(roleId);
    setTempPartnerRoles(next);
  };

  const dateSelectorVisible = tempTypes && (tempTypes.has("event") || tempTypes.has("class"));

  const filteredEvents = (events || []).filter((event) => {
    const now = new Date();
    const start = new Date(event.start_time ?? now);
    const end = new Date(event.end_time ?? now);
    if (end < now && start < now) return false;
    if (dateFrom && end < dateFrom) return false;
    if (dateTo && start > dateTo) return false;
    return true;
  });

  const filteredClasses = (classes || []).filter((event) => {
    const now = new Date();
    const start = new Date(event.start_time ?? now);
    const end = new Date(event.end_time ?? now);
    if (end < now && start < now) return false;
    if (dateFrom && end < dateFrom) return false;
    if (dateTo && start > dateTo) return false;
    return true;
  });

  const mergedItems = React.useMemo<SearchResultItem[]>(
    () => [
      ...(newsItems || []).map((item) => ({ ...item, itemType: "news" as const })),
      ...(filteredEvents.map((event) => ({ ...event, itemType: "event" as const })) as SearchEventResultItem[]),
      ...(filteredClasses.map((event) => ({ ...event, itemType: "class" as const })) as SearchEventResultItem[]),
      ...((partners || []).map((partner) => ({ ...partner, itemType: "partner" as const })) as SearchPartnerResultItem[]),
    ],
    [newsItems, filteredEvents, filteredClasses, partners]
  );

  const typeFilterActive = selectedTypes && selectedTypes.size > 0;
  const roleFilterActive = selectedRoles && selectedRoles.length > 0;

  const filteredMerged = React.useMemo(() => {
    return mergedItems.filter((item) => {
      if (!typeFilterActive && !roleFilterActive) return true;

      if (item.itemType === "partner") {
        if (roleFilterActive) {
          if (selectedRoles.includes("ALL_PARTNERS")) {
            return true;
          }
          const roles = Array.isArray(item.roles) ? item.roles : [];
          const roleIds = roles
            .map((role) => (role && typeof role === "object" ? role.id : Number(role)))
            .filter(Boolean);
          const overlap = selectedRoles.some((roleId) => roleIds.includes(typeof roleId === "number" ? roleId : -1));
          return overlap;
        }
        if (typeFilterActive && !roleFilterActive) return false;
        return false;
      }

      if (item.itemType === "news" || item.itemType === "event" || item.itemType === "class") {
        if (typeFilterActive) {
          if (item.itemType === "news") return selectedTypes.has("news");
          if (item.itemType === "class") return selectedTypes.has("class");
          if (item.itemType === "event") {
            const eventType = (item.event_type || "").toString().toLowerCase();
            const isClass = eventType === "class";
            if (isClass) return selectedTypes.has("class");
            return selectedTypes.has("event");
          }
          return false;
        }
        if (roleFilterActive && !typeFilterActive) return false;
        return true;
      }

      return true;
    });
  }, [mergedItems, selectedTypes, selectedRoles, typeFilterActive, roleFilterActive]);

  const sortedItems = React.useMemo(() => {
    return filteredMerged
      .slice()
      .sort((a, b) => {
        const distanceA = a.distance ?? Infinity;
        const distanceB = b.distance ?? Infinity;
        return distanceA - distanceB;
      });
  }, [filteredMerged]);

  const applyLocation = (location: SearchLocation | null) => {
    setNewsLocation(location);
    setEventLocation(location);
    setPartnerLocation(location);
  };

  const submitInitialSearch = () => {
    if ((!tempTypes || tempTypes.size === 0) && (!tempPartnerRoles || tempPartnerRoles.size === 0)) return;
    setSelectedTypes(new Set(tempTypes));
    if (tempLocation) applyLocation(tempLocation);
    else if (defaultLocation) applyLocation(defaultLocation);
    if (tempPartnerRoles && tempPartnerRoles.size > 0) {
      setSelectedRoles(Array.from(tempPartnerRoles));
    }
    if (tempFromDate) setDateFrom(new Date(tempFromDate));
    else setDateFrom(null);
    if (tempToDate) setDateTo(new Date(tempToDate));
    else setDateTo(null);
    setShowResults(true);
  };

  const value: SearchContextType = {
    selectedTypes,
    selectedRoles,
    toggleType,
    toggleRole,
    setSelectedTypes,
    setSelectedRoles,
    tempTypes,
    tempLocation,
    tempPartnerRoles,
    tempFromDate,
    tempToDate,
    setTempLocation,
    setTempFromDate,
    setTempToDate,
    toggleTempType,
    toggleTempPartnerRole,
    dateSelectorVisible,
    mergedItems,
    filteredMerged,
    sortedItems,
    applyLocation,
    submitInitialSearch,
    showResults,
    setShowResults,
    dateFrom,
    dateTo,
    setDateFrom,
    setDateTo,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export default SearchProvider;
