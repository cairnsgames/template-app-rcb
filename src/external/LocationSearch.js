import { eventTupleToStore } from "@fullcalendar/core/internal";
import React, { useState, useEffect, useRef, useCallback } from "react";

const DEBOUNCE_DELAY = 500;

function SearchIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={className} viewBox="0 0 16 16">
      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
    </svg>
  );
}

function MapPinIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={className} viewBox="0 0 16 16">
      <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
      <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
    </svg>
  );
}

function NavigationIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={className} viewBox="0 0 16 16">
      <path d="m7.665 6.982-.8 1.386a.25.25 0 0 1-.451-.039l-1.06-2.882a.25.25 0 0 1 .192-.333l3.026-.523a.25.25 0 0 1 .26.371l-.667 1.154.621.373A2.5 2.5 0 0 1 10 8.632V11H9V8.632a1.5 1.5 0 0 0-.728-1.286z" />
      <path fillRule="evenodd" d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.48 1.48 0 0 1 0-2.098zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134Z" />
    </svg>
  );
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const LocationSearch =({
  value,
  onSelected,
  lat,
  lng,
  className,
  style,
  debounceDelay = DEBOUNCE_DELAY,
} = {}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const hasTypedRef = useRef(false);
  const debounceTimer = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (value && typeof value === "object") {
      const addr = value.address || {};
      const searchText = addr.suburb || addr.hamlet || addr.village || addr.town || addr.city || "";
      if (searchText) {
        setQuery(searchText);
        setSelectedLocation(value);
      }
    }
  }, [value]);

  useEffect(() => {
    let cancelled = false;
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (cancelled) return;
          setUserLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
        },
        (err) => {
          if (cancelled) return;
          // fallback to provided lat/lng
          if (typeof lat === "number" && typeof lng === "number") {
            setUserLocation({ lat, lon: lng });
          }
        }
      );
    } else if (typeof lat === "number" && typeof lng === "number") {
      setUserLocation({ lat, lon: lng });
    }
    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const processResults = useCallback(
    (data, searchLower) => {
      const processed = [];
      const allowedTypes = ["city", "town", "suburb", "village", "hamlet", "administrative"];
      const normalizeParent = (val) => {
        if (!val) return undefined;
        const lower = val.toLowerCase();
        if (lower.includes("ward") || lower.includes("municipality") || lower.includes("metropolitan")) return undefined;
        return val;
      };

      for (const item of data) {
        const { address } = item;
        if (!address || !address.country) continue;
        if (item.class === "highway" || item.class === "road") continue;
        if (!allowedTypes.includes(item.type)) continue;

        const suburb = address.suburb;
        const city = address.city || address.town || address.village;
        const town = address.town;
        const village = address.village;
        const hamlet = address.hamlet;

        const matchesQuery = (field) => field && field.toLowerCase().includes(searchLower);
        if (!(matchesQuery(suburb) || matchesQuery(city) || matchesQuery(town) || matchesQuery(village) || matchesQuery(hamlet))) continue;

        let displayText = "";
        if (item.type === "suburb") {
          const parent = normalizeParent(city) || normalizeParent(town) || normalizeParent(address.county) || normalizeParent(address.state);
          displayText = [suburb || city, parent || city, address.country].filter(Boolean).join(", ");
        } else if (item.type === "town") {
          displayText = [town || city || village, address.country].filter(Boolean).join(", ");
        } else if (item.type === "village" || item.type === "hamlet") {
          const parentCity = normalizeParent(city) || normalizeParent(town) || normalizeParent(address.county);
          displayText = [village || hamlet || city, parentCity, address.country].filter(Boolean).join(", ");
        } else if (item.type === "city") {
          displayText = [city || suburb || village, address.country].filter(Boolean).join(", ");
        } else {
          displayText = [city || suburb || village || hamlet, address.country].filter(Boolean).join(", ");
        }

        const rawType = String(item.type);
        const resolvedType = ["city", "town", "suburb", "village", "hamlet"].includes(rawType) ? rawType : "city";

        processed.push({ id: item.place_id, displayText, type: resolvedType, raw: item });
      }

      if (userLocation) {
        processed.sort((a, b) => {
          const distA = calculateDistance(userLocation.lat, userLocation.lon, parseFloat(a.raw.lat), parseFloat(a.raw.lon));
          const distB = calculateDistance(userLocation.lat, userLocation.lon, parseFloat(b.raw.lat), parseFloat(b.raw.lon));
          return distA - distB;
        });
      }
      return processed;
    },
    [userLocation]
  );

  const fetchLocations = useCallback(
    async (searchQuery) => {
      try {
        const params = {
          q: searchQuery,
          format: "json",
          addressdetails: "1",
          featureType: "settlement",
          limit: "75",
        };
        if (userLocation) {
          params.lat = String(userLocation.lat);
          params.lon = String(userLocation.lon);
        }
        const url = "https://nominatim.openstreetmap.org/search?" + new URLSearchParams(params).toString();
        setIsLoading(true);
        const resp = await fetch(url, { headers: { Accept: "application/json" } });
        if (!resp.ok) throw new Error("Failed to fetch locations");
        const data = await resp.json();
        const filtered = processResults(data, String(searchQuery).toLowerCase().trim());
        setResults(filtered);
        setShowResults(true);
      } catch (err) {
        console.error("Error fetching locations:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [userLocation, processResults]
  );

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (!searching || query.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    debounceTimer.current = setTimeout(() => fetchLocations(query), debounceDelay);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query, fetchLocations, debounceDelay, searching]);

  const handleSelect = (event, result) => {
    event.preventDefault();
    event.stopPropagation();
    setShowResults(false);
    setSelectedLocation(result.raw);
    if (onSelected) onSelected(result.raw);
  };

  return (
    <div className={className ? `w-100 ${className}` : "w-100"} ref={containerRef} style={style}>
      <div className="position-relative">
        <div className="position-relative">
          <div
            style={{
              position: "absolute",
              inset: "0 auto 0 0",
              paddingLeft: 16,
              display: "flex",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            <SearchIcon className="text-muted" />
          </div>

          <input
            type="text"
            value={query}
            onKeyDown={() => setSearching(true)}
            onChange={(e) => {
              hasTypedRef.current = true;
              setQuery(e.target.value);
              setSelectedLocation(null);
            }}
            onFocus={() => results.length > 0 && hasTypedRef.current && setShowResults(true)}
            placeholder="Search for cities, suburbs, towns, villages, or hamlets..."
            className="form-control form-control-lg ps-5 pe-4"
          />

          {isLoading && (
            <div
              style={{
                position: "absolute",
                inset: "0 0 0 auto",
                paddingRight: 16,
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </div>

        {selectedLocation && <div className="mt-2 text-muted small">{selectedLocation.display_name}</div>}

        {showResults && results.length > 0 && (
          <div className="position-absolute w-100 mt-2 bg-white border rounded-xl shadow overflow-auto" style={{ maxHeight: "24rem", zIndex: 1050 }}>
            {userLocation && (
              <div className="px-3 py-2 bg-light border-bottom d-flex align-items-center text-sm text-primary">
                <NavigationIcon className="me-2" />
                <span className="fw-medium">Sorted by distance from you</span>
              </div>
            )}
            {results.map((result) => {
              const distance = userLocation
                ? calculateDistance(userLocation.lat, userLocation.lon, parseFloat(result.raw.lat), parseFloat(result.raw.lon))
                : null;
              return (
                <button
                  key={result.id}
                  onClick={(event) => handleSelect(event, result)}
                  className="list-group-item list-group-item-action d-flex align-items-start"
                >
                  <div className="me-3 mt-1 text-muted">
                    <MapPinIcon />
                  </div>
                  <div className="flex-fill">
                    <div className="fw-medium text-dark">{result.displayText}</div>
                    <div className="mt-1 d-flex align-items-center gap-2 flex-wrap small text-muted">
                      <span className={`badge rounded-pill text-bg-light`}>{result.type.charAt(0).toUpperCase() + result.type.slice(1)}</span>
                      {distance !== null && <span>{distance < 1 ? `${Math.round(distance * 1e3)}m away` : `${Math.round(distance)}km away`}</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {showResults && results.length === 0 && !isLoading && query.trim().length >= 2 && (
          <div className="position-absolute w-100 mt-2 bg-white border rounded-xl shadow p-4 text-center" style={{ zIndex: 1050 }}>
            <div className="text-muted mb-2">
              <SearchIcon className="fs-1" />
            </div>
            <p className="fw-medium">No locations found</p>
            <p className="text-muted small mt-1">Try searching for a different location</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationSearch;
