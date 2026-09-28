import type { Dispatch, SetStateAction } from "react";

export type SearchLayout = "default" | "card" | "thumb";

export type SearchTypeFilter = "news" | "event" | "class";

export type SearchRoleSelection = number | "ALL_PARTNERS";

export type SearchLocation = {
  lat?: number;
  lng?: number;
  lon?: number;
  latitude?: number;
  longitude?: number;
  distance?: number;
};

export type SearchFeedItem = {
  id: number | string;
  distance?: number | null;
  globalNews?: boolean;
  [key: string]: unknown;
};

export type SearchEventItem = {
  id: number | string;
  distance?: number | null;
  event_type?: string;
  start_time?: string;
  end_time?: string;
  [key: string]: unknown;
};

export type SearchPartnerItem = {
  id?: number | string;
  user_id?: number | string;
  firstname?: string;
  lastname?: string;
  avatar?: string | null;
  distance?: number | null;
  offerings?: Array<{ name?: string } | string | null>;
  roles?: Array<{ id?: number; name?: string } | string | number | null>;
  [key: string]: unknown;
};

export type SearchNewsResultItem = SearchFeedItem & {
  itemType: "news";
};

export type SearchEventResultItem = SearchEventItem & {
  itemType: "event" | "class";
};

export type SearchPartnerResultItem = SearchPartnerItem & {
  itemType: "partner";
};

export type SearchResultItem =
  | SearchNewsResultItem
  | SearchEventResultItem
  | SearchPartnerResultItem;

export type NewsProviderValue = {
  newsItems: SearchFeedItem[];
  location: SearchLocation | null;
  setLocation: (location: SearchLocation | null) => void;
};

export type EventsProviderValue = {
  classes: SearchEventItem[];
  events: SearchEventItem[];
  setLocation: (location: SearchLocation | null) => void;
};

export type PartnerProviderValue = {
  partners: SearchPartnerItem[];
  setLocation: (location: SearchLocation | null) => void;
};

export type UserProviderValue = {
  defaultLocation: SearchLocation | null;
};

export type SearchContextType = {
  selectedTypes: Set<SearchTypeFilter>;
  selectedRoles: SearchRoleSelection[];
  toggleType: (type: SearchTypeFilter) => void;
  toggleRole: (roleId: SearchRoleSelection) => void;
  setSelectedTypes: Dispatch<SetStateAction<Set<SearchTypeFilter>>>;
  setSelectedRoles: Dispatch<SetStateAction<SearchRoleSelection[]>>;
  tempTypes: Set<SearchTypeFilter>;
  tempLocation: SearchLocation | null;
  tempPartnerRoles: Set<number>;
  tempFromDate: string;
  tempToDate: string;
  setTempLocation: Dispatch<SetStateAction<SearchLocation | null>>;
  setTempFromDate: Dispatch<SetStateAction<string>>;
  setTempToDate: Dispatch<SetStateAction<string>>;
  toggleTempType: (type: SearchTypeFilter) => void;
  toggleTempPartnerRole: (roleId: number) => void;
  dateSelectorVisible: boolean;
  mergedItems: SearchResultItem[];
  filteredMerged: SearchResultItem[];
  sortedItems: SearchResultItem[];
  applyLocation: (location: SearchLocation | null) => void;
  submitInitialSearch: () => void;
  showResults: boolean;
  setShowResults: Dispatch<SetStateAction<boolean>>;
  dateFrom: Date | null;
  dateTo: Date | null;
  setDateFrom: Dispatch<SetStateAction<Date | null>>;
  setDateTo: Dispatch<SetStateAction<Date | null>>;
};

export type SearchFilterModalProps = {
  show: boolean;
  onHide: () => void;
  selectedTypes: Set<SearchTypeFilter>;
  toggleType: (type: SearchTypeFilter) => void;
  selectedRoles: SearchRoleSelection[];
  toggleRole: (roleId: SearchRoleSelection) => void;
  clearFilters: () => void;
};

export type SearchDisplayProps = {
  item: SearchFeedItem;
  onClick: (id: number | string) => void;
  layout: SearchLayout;
};

export type SearchItemsProps = {
  count: number;
  layout: SearchLayout;
  onClick: (id: number | string) => void;
};

export type SearchPartnerProps = {
  item: SearchPartnerItem;
  index: number;
};

export type SearchPageProps = {
  layout?: SearchLayout;
  items?: number;
};
