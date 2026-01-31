import React from "react";
import { useNews } from "../../news/context/newscontext";
import useEvents from "../../kloko/context/useevents";
import { usePartner } from "../../partner/context/partnercontext";
import { useUser } from "../../auth/context/useuser";

const SearchContext = React.createContext(null);

export const useSearch = () => React.useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const { newsItems, location, setLocation: setNewsLocation } = useNews();
  const { setLocation: setEventLocation, classes, events } = useEvents();
  const { partners, setLocation: setPartnerLocation } = usePartner();
  const { defaultLocation } = useUser();

  const [selectedTypes, setSelectedTypes] = React.useState(new Set());
  const [selectedRoles, setSelectedRoles] = React.useState([]);
  // Known partner role ids (kept in sync with SearchFilterModal.PARTNER_ROLES)
  const PARTNER_ROLE_IDS = [26, 27, 28, 29, 30];

  const toggleRole = (roleId) => {
    const current = Array.isArray(selectedRoles) ? [...selectedRoles] : [];
    const has = current.includes(roleId);

    if (roleId === "ALL_PARTNERS") {
      if (!has) {
        const next = Array.from(new Set(["ALL_PARTNERS", ...current, ...PARTNER_ROLE_IDS]));
        setSelectedRoles(next);
      } else {
        const next = current.filter((r) => r !== "ALL_PARTNERS" && !PARTNER_ROLE_IDS.includes(r));
        setSelectedRoles(next);
      }
      return;
    }

    if (!has) {
      const next = Array.from(new Set([...current, roleId]));
      const allPresent = PARTNER_ROLE_IDS.every((id) => next.includes(id));
      if (allPresent && !next.includes("ALL_PARTNERS")) next.push("ALL_PARTNERS");
      setSelectedRoles(next);
    } else {
      const next = current.filter((r) => r !== roleId && r !== "ALL_PARTNERS");
      setSelectedRoles(next);
    }
  };

  const toggleType = (type) => {
    const next = new Set(selectedTypes);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    setSelectedTypes(next);
  };

  // Local state for initial search form (temps live here too)
  const [showResults, setShowResults] = React.useState(false);
  const [tempTypes, setTempTypes] = React.useState(new Set());
  const [tempLocation, setTempLocation] = React.useState(null);
  const [tempPartnerRoles, setTempPartnerRoles] = React.useState(new Set());
  const [tempFromDate, setTempFromDate] = React.useState("");
  const [tempToDate, setTempToDate] = React.useState("");

  const [dateFrom, setDateFrom] = React.useState(null);
  const [dateTo, setDateTo] = React.useState(null);

  const toggleTempType = (type) => {
    const next = new Set(tempTypes);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    setTempTypes(next);
  };

  const toggleTempPartnerRole = (roleId) => {
    const next = new Set(tempPartnerRoles);
    if (next.has(roleId)) next.delete(roleId);
    else next.add(roleId);
    setTempPartnerRoles(next);
  };

  const dateSelectorVisible = tempTypes && (tempTypes.has("event") || tempTypes.has("class"));

  // Filter out old events
  const filteredEvents = (events || []).filter((event) => {
    const now = new Date();
    const start = new Date(event.start_time);
    const end = new Date(event.end_time);
    if (end < now && start < now) return false;
    if (dateFrom && end < dateFrom) return false;
    if (dateTo && start > dateTo) return false;
    return true;
  });

  const filteredClasses = (classes || []).filter((ev) => {
    const now = new Date();
    const start = new Date(ev.start_time);
    const end = new Date(ev.end_time);
    if (end < now && start < now) return false;
    if (dateFrom && end < dateFrom) return false;
    if (dateTo && start > dateTo) return false;
    return true;
  });

  const mergedItems = React.useMemo(() => [
    ...(newsItems || []).map((item) => ({ ...item, itemType: "news" })),
    ...filteredEvents.map((event) => ({ ...event, itemType: "event" })),
    ...filteredClasses.map((event) => ({ ...event, itemType: "class" })),
    ...partners.map((partner) => ({ ...partner, itemType: "partner" })),
  ], [newsItems, filteredEvents, filteredClasses, partners]);

  const typeFilterActive = selectedTypes && selectedTypes.size > 0;
  const roleFilterActive = selectedRoles && selectedRoles.length > 0;

  const filteredMerged = React.useMemo(() => {
    return mergedItems.filter((item) => {
      if (!typeFilterActive && !roleFilterActive) return true;

      if (item.itemType === "partner") {
        if (roleFilterActive) {
          if (selectedRoles.includes && selectedRoles.includes("ALL_PARTNERS")) {
            return true;
          }
          const roles = Array.isArray(item.roles) ? item.roles : [];
          const roleIds = roles
            .map((r) => (r && typeof r === "object" ? r.id : Number(r)))
            .filter(Boolean);
          const overlap = selectedRoles.some((rid) => roleIds.includes(rid));
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
            const et = (item.event_type || "").toString().toLowerCase();
            const isClass = et === "class";
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

  const applyLocation = (location) => {
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

  const value = {
    // persistent filters
    selectedTypes,
    selectedRoles,
    toggleType,
    toggleRole,
    setSelectedTypes,
    setSelectedRoles,
    // temp UI state
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
    // results
    mergedItems,
    filteredMerged,
    sortedItems,
    // controls
    applyLocation,
    submitInitialSearch,
    showResults,
    setShowResults,
    // date filters
    dateFrom,
    dateTo,
    setDateFrom,
    setDateTo,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export default SearchProvider;
