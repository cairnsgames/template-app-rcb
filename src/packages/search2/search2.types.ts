export type SearchOffering = {
  type: "offering";
  id: number;
  name: string;
};

export type SearchGroup = {
  type: "group";
  id: number;
  name: string;
  offerings: SearchOffering[];
};

export type SearchRole = {
  type: "role";
  id: number;
  name: string;
  groups: SearchGroup[];
  offerings: SearchOffering[];
};

export type SearchConfig = SearchRole[];

export type SearchSelection = {
  type: "role" | "group" | "offering";
  id: number;
  name: string;
  parentNames?: string[]; // breadcrumb labels for display
};

export type SearchResultUser = {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  name: string;
  avatar: string | null;
  roles: string | { id: number; name: string }[];
  offerings: { id: number; name: string }[] | string[];
  distance?: number;
};

export type SearchResult = {
  users: SearchResultUser[];
};

export type SearchPayload = {
  roles: number[];
  groups: number[];
  offerings: number[];
};

export type Search2ContextType = {
  config: SearchConfig;
  configLoading: boolean;
  configError: string | null;
  loadConfig: () => void;
  selections: SearchSelection[];
  addSelection: (item: SearchSelection) => void;
  removeSelection: (type: SearchSelection["type"], id: number) => void;
  clearSelections: () => void;
  searchResults: SearchResultUser[];
  searchLoading: boolean;
  searchError: string | null;
  executeSearch: () => void;
  hasSearched: boolean;
};
