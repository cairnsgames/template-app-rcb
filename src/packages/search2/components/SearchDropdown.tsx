import React from "react";
import type { SearchSelection } from "../search2.types";
import type { HierarchyMatch } from "./filterConfig";

type SearchDropdownProps = {
  matches: HierarchyMatch[];
  onSelect: (item: SearchSelection) => void;
  selections: SearchSelection[];
};

const SearchDropdown: React.FC<SearchDropdownProps> = ({ matches, onSelect, selections }) => {
  const isSelected = (type: SearchSelection["type"], id: number) =>
    selections.some((s) => s.type === type && s.id === id);

  if (matches.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 1000,
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: 4,
        width: "100%",
        maxHeight: 320,
        overflowY: "auto",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      {matches.map(({ role, matchedGroups }) => (
        <div key={`role-${role.id}`} style={{ padding: "4px 0" }}>
          {/* Role row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "4px 12px",
              cursor: "pointer",
              background: isSelected("role", role.id) ? "#e8f4fe" : undefined,
            }}
            onClick={() =>
              onSelect({ type: "role", id: role.id, name: role.name, parentNames: [] })
            }
          >
            <input
              type="checkbox"
              readOnly
              checked={isSelected("role", role.id)}
              style={{ marginRight: 8 }}
            />
            <strong>{role.name}</strong>
          </div>

          {/* Groups under this role */}
          {matchedGroups.map(({ groupId, groupName, matchedOfferings }) => (
            <div key={`group-${groupId}`}>
              {groupId !== -1 && groupName && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "3px 28px",
                    cursor: "pointer",
                    background: isSelected("group", groupId) ? "#e8f4fe" : undefined,
                  }}
                  onClick={() =>
                    onSelect({
                      type: "group",
                      id: groupId,
                      name: groupName,
                      parentNames: [role.name],
                    })
                  }
                >
                  <input
                    type="checkbox"
                    readOnly
                    checked={isSelected("group", groupId)}
                    style={{ marginRight: 8 }}
                  />
                  {groupName}
                </div>
              )}

              {/* Offerings under this group */}
              {matchedOfferings.map((offering) => (
                <div
                  key={`offering-${offering.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "3px 44px",
                    cursor: "pointer",
                    fontSize: "0.9em",
                    background: isSelected("offering", offering.id) ? "#e8f4fe" : undefined,
                  }}
                  onClick={() =>
                    onSelect({
                      type: "offering",
                      id: offering.id,
                      name: offering.name,
                      parentNames:
                        groupId !== -1 && groupName
                          ? [role.name, groupName]
                          : [role.name],
                    })
                  }
                >
                  <input
                    type="checkbox"
                    readOnly
                    checked={isSelected("offering", offering.id)}
                    style={{ marginRight: 8 }}
                  />
                  {offering.name}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SearchDropdown;
