import React, { useEffect, useRef, useState } from "react";
import { Badge, Button, Card, Spinner } from "react-bootstrap";
import { useDebounce } from "../../../hooks/usedebounce";
import { useSearch2 } from "../context/search2context";
import type { SearchSelection } from "../search2.types";
import { filterConfig } from "./filterConfig";
import SearchDropdown from "./SearchDropdown";
import Partner from "./Partner";
import TilesLayout from "../../layout/Tiles";
import Tile from "../../layout/Tile";

const SearchTab: React.FC = () => {
  const {
    config,
    configLoading,
    configError,
    selections,
    addSelection,
    removeSelection,
    searchResults,
    searchLoading,
    searchError,
    executeSearch,
    hasSearched,
  } = useSearch2();

  const [inputValue, setInputValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const debouncedQuery = useDebounce(inputValue, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const matches = filterConfig(config, debouncedQuery);
  const showDropdown = dropdownOpen && debouncedQuery.trim().length > 0 && matches.length > 0;

  const handleSelect = (item: SearchSelection) => {
    addSelection(item);
  };

  if (configLoading) {
    return (
      <div className="d-flex justify-content-center p-4">
        <Spinner animation="border" />
      </div>
    );
  }

  if (configError) {
    return (
      <div className="text-danger p-3">
        Failed to load search configuration: {configError}
      </div>
    );
  }

  return (
    <div>
      {/* Search input */}
      <div ref={wrapperRef} style={{ position: "relative" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Type to search (e.g. salsa, teacher...)"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setDropdownOpen(true);
          }}
          onFocus={() => setDropdownOpen(true)}
          autoComplete="off"
        />
        {showDropdown && (
          <SearchDropdown
            matches={matches}
            onSelect={handleSelect}
            selections={selections}
          />
        )}
      </div>

      {/* Selection badges */}
      {selections.length > 0 && (
        <div className="mt-2 d-flex flex-wrap" style={{ gap: 6 }}>
          {selections.map((s) => (
            <Badge
              key={`${s.type}-${s.id}`}
              bg="primary"
              style={{ fontSize: "0.85em", padding: "6px 10px", cursor: "default" }}
            >
              {s.parentNames && s.parentNames.length > 0
                ? `${s.parentNames.join(" > ")} > ${s.name}`
                : s.name}
              &nbsp;
              <span
                style={{ cursor: "pointer", fontWeight: "bold" }}
                onClick={() => removeSelection(s.type, s.id)}
                role="button"
                aria-label={`Remove ${s.name}`}
              >
                ×
              </span>
            </Badge>
          ))}
        </div>
      )}

      {/* Search button */}
      <div className="mt-3">
        <Button
          variant="primary"
          disabled={selections.length === 0 || searchLoading}
          onClick={executeSearch}
        >
          {searchLoading ? (
            <>
              <Spinner animation="border" size="sm" className="me-1" /> Searching...
            </>
          ) : (
            "Search"
          )}
        </Button>
      </div>

      {/* Search error */}
      {searchError && (
        <div className="text-danger mt-2">Search failed: {searchError}</div>
      )}

      {/* Results */}
      {hasSearched && (
        <div className="mt-4">
          {searchResults.length === 0 ? (
            <Card className="p-3 text-center">
              <h5>No results found</h5>
              <p className="mb-0">Try adjusting your search selection.</p>
            </Card>
          ) : (
            <TilesLayout>
              {searchResults.map((user, index) => (
                <Tile key={`${user.id}-${index}`}>
                  <Partner item={user} index={index} />
                </Tile>
              ))}
            </TilesLayout>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchTab;
