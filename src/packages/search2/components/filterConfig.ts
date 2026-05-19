import type { SearchConfig, SearchOffering, SearchRole, SearchSelection } from "../search2.types";

export type HierarchyMatch = {
  role: SearchRole;
  matchedGroups: {
    groupId: number;
    groupName: string;
    matchedOfferings: SearchOffering[];
    groupMatches: boolean;
  }[];
  roleMatches: boolean;
};

const matchesText = (name: string, query: string): boolean =>
  name.toLowerCase().includes(query.toLowerCase());

export const filterConfig = (config: SearchConfig, query: string): HierarchyMatch[] => {
  if (!query.trim()) return [];

  return config
    .map((role) => {
      const roleMatches = matchesText(role.name, query);

      const roleDirectOfferings =
        role.offerings?.filter((o) => matchesText(o.name, query)) ?? [];

      const matchedGroups =
        role.groups
          ?.map((group) => {
            const groupMatches = matchesText(group.name, query);
            const matchedOfferings =
              group.offerings?.filter((o) => matchesText(o.name, query)) ?? [];
            return { groupId: group.id, groupName: group.name, matchedOfferings, groupMatches };
          })
          .filter((g) => g.groupMatches || g.matchedOfferings.length > 0) ?? [];

      if (roleDirectOfferings.length > 0) {
        matchedGroups.push({
          groupId: -1,
          groupName: "",
          matchedOfferings: roleDirectOfferings,
          groupMatches: false,
        });
      }

      const hasAnyMatch = roleMatches || matchedGroups.length > 0;
      return { role, matchedGroups, roleMatches, hasAnyMatch };
    })
    .filter((r) => r.hasAnyMatch);
};
