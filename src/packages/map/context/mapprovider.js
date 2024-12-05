import { useCallback } from "react";
import { useState, createContext, useEffect, useMemo } from "react";
import useGeoLocation from "../../../hooks/usegeolocation";
import { combineUrlAndPath } from "../../../functions/combineurlandpath";

export const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [center, setCenter] = useState([-26.20227, 28.04363]);
  const [zoom, setZoom] = useState(14);
  const { latlng } = useGeoLocation();
  const [rawMarkers, setRawMarkers] = useState([]);

  const [searchArea, setSearchArea] = useState([
    [null, null],
    [null, null],
  ]);

  const [filters, setFilters] = useState({
    oldEvents: false,
    dateRange: {
      start: new Date().toISOString().split("T")[0],
      end: new Date(new Date().setDate(new Date().getDate() + 7))
        .toISOString()
        .split("T")[0],
    },
    categories: {
      class: false,
      event: false,
      teacher: false,
      dj: false,
      supplier: false,
      venue: false,
    },
    keywords: "",
  });

  const clearFilters = () => {
    setFilters({
      oldEvents: false,
      dateRange: {
        start: new Date().toISOString().split("T")[0],
        end: new Date(new Date().setDate(new Date().getDate() + 7))
          .toISOString()
          .split("T")[0],
      },
      categories: {
        class: false,
        event: false,
        teacher: false,
        dj: false,
        supplier: false,
        venue: false,
      },
      keywords: "",
    });
  };

  const fetchMarkers = async () => {
    if (
      searchArea[0][0] !== null &&
      searchArea[0][1] !== null &&
      searchArea[1][0] !== null &&
      searchArea[1][1] !== null
    ) {
      try {
        const response = await fetch(
          combineUrlAndPath(
            process.env.REACT_APP_KLOKO_API,
            // 'http://localhost/cairnsgames/php/kloko',
            `/getmappins.php?lat_nw=${searchArea[0][0]}&lng_nw=${searchArea[0][1]}&lat_se=${searchArea[1][0]}&lng_se=${searchArea[1][1]}`
          )
        );
        const data = await response.json();

        // Set color based on category
        const updatedMarkers = data.map((marker) => {
          marker.subcategory = JSON.parse(marker.subcategory || "");
          switch (marker.category.toLowerCase()) {
            case "event":
              const eventtype = marker.subcategory.length > 0 ? marker.subcategory[0].toLowerCase() : "event";
              marker.color = "orange";
              switch (eventtype) {
                case "class":
                  marker.color = "lightblue";
                  break;
                case "party":
                  marker.color = "lightcoral";
                  break;
              }
            case "partner":
              const roleNames = marker.subcategory || [];
              const role =
                roleNames.length > 0 ? roleNames[0].toLowerCase() : "";
              switch (role) {
                case "venue":
                  marker.color = "blue";
                  break;
                case "supplier":
                  marker.color = "green";
                  break;
                case "teacher":
                  marker.color = "red";
                  break;
                case "dj":
                  marker.color = "yellow";
                  break;
                case "event coordinator":
                  marker.color = "purple";
                  break;
              }
              break;
          }
          return marker;
        });

        setRawMarkers(updatedMarkers);
      } catch (error) {
        console.error("Error fetching markers:", error);
      }
    }
  };

  const searchMapArea = (lat, lng, lat2, lng2) => {
    setSearchArea([
      [lat, lng],
      [lat2, lng2],
    ]);
  };

  useEffect(() => {
    fetchMarkers();
  }, [searchArea]);

  const getFilteredMarkers = (rawMarkers, filters) => {
    // Default to today and one week ahead if no date range is set
    const today = new Date();
    const defaultStartDate = today.toISOString().split("T")[0];
    const defaultEndDate = new Date(today.setDate(today.getDate() + 7))
      .toISOString()
      .split("T")[0];

    const startDateFilter = filters.dateRange?.start || defaultStartDate;
    const endDateFilter = filters.dateRange?.end || defaultEndDate;

    return rawMarkers.filter((marker) => {
      const { startDate, endDate, category, event_type, keywords } = marker;

      // Filter out historical items
      if (new Date(endDate) < new Date()) {
        return false;
      }

      // Check if the marker falls within the date range
      if (
        new Date(startDate) > new Date(endDateFilter) ||
        new Date(endDate) < new Date(startDateFilter)
      ) {
        return false;
      }

      // Check categories, include all if no categories are selected
      const categoryKeys = Object.keys(filters.categories);
      const anyCategorySelected = categoryKeys.some(
        (cat) => filters.categories[cat]
      );
      if (anyCategorySelected) {
        const lcategory = category.toLowerCase();
        const lsubcategory = event_type?.toLowerCase();
        const matchesCategory =
          filters.categories[lcategory] || filters.categories[lsubcategory];

        if (!matchesCategory) {
          return false;
        }
      }

      // Check keywords, include all if no keywords are provided
      if (filters.keywords) {
        const markerKeywords = keywords
          ? keywords.toLowerCase().split(", ")
          : [];
        const filterKeywords = filters.keywords.toLowerCase().split(", ");
        if (
          !filterKeywords.some((keyword) => markerKeywords.includes(keyword))
        ) {
          return false;
        }
      }

      return true;
    });
  };

  const centerMap = useCallback(
    (lat, lng) => {
      setCenter([lat, lng]);
    },
    [latlng]
  );

  const centerMapOnCurrentLocation = useCallback(() => {
    if (latlng) {
      setCenter([latlng.latitude, latlng.longitude]);
    }
  }, [latlng]);

  const setLocation = useCallback((lat, lng) => {
    setCenter([lat, lng]);
  }, []);

  const addMarker = (lat, lng, title) => {
    setMarkers([...markers, { lat, lng, title }]);
  };

  const markers = getFilteredMarkers(rawMarkers, filters);

  const values = useMemo(
    () => ({
      center,
      setCenter,
      zoom,
      setZoom,
      centerMapOnCurrentLocation,
      setLocation,
      markers,
      addMarker,
      centerMap,
      filters,
      setFilters,
      clearFilters,
      searchMapArea,
    }),
    [
      center,
      setCenter,
      zoom,
      centerMapOnCurrentLocation,
      setLocation,
      markers,
      addMarker,
      centerMap,
      filters,
      setFilters,
      clearFilters,
    ]
  );

  return <MapContext.Provider value={values}>{children}</MapContext.Provider>;
};

export default MapProvider;
