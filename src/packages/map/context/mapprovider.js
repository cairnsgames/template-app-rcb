import { useCallback } from "react";
import { useState, createContext, useEffect, useMemo } from "react";
import useGeoLocation from "../../../hooks/usegeolocation";
import { combineUrlAndPath } from "../../../functions/combineurlandpath";

export const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [center, setCenter] = useState([-26.20227, 28.04363]);
  const [zoom, setZoom] = useState(14);
  const { latlng } = useGeoLocation();
  const [rawMarkers, setRawMarkers] = useState([
    {
      lat: -26.207,
      lng: 28.04363,
      category: "class",
      id: 76,
      title: "Dance Basics",
      color: "blue",
      image: "https://example.com/images/dance_basics.jpg",
      reference: "#class/76",
      date_start: "2024-11-25T10:00:00Z",
      date_end: "2024-11-25T11:00:00Z",
      keywords: "salsa, beginners",
    },
    {
      lat: -26.2,
      lng: 28.04363,
      category: "event",
      id: 32,
      title: "Evening Gala",
      color: "orange",
      image: "https://example.com/images/evening_gala.jpg",
      reference: "#event/32",
      date_start: "2024-11-30T18:00:00Z",
      date_end: "2024-11-30T23:00:00Z",
      keywords: "salsa, party",
    },
    {
      lat: -26.19227,
      lng: 28.05,
      category: "person",
      id: 15,
      title: "Jane Doe",
      color: "red",
      image: "https://example.com/images/jane_doe.jpg",
      reference: "#person/15",
      sub_category: "teacher",
    },
    {
      lat: -26.18227,
      lng: 28.05,
      category: "person",
      id: 16,
      title: "John Smith",
      color: "red",
      image: "https://example.com/images/john_smith.jpg",
      reference: "#person/16",
      sub_category: "dj",
    },
    {
      lat: -25.81625913702715,
      lng: 27.462750728129443,
      category: "location",
      id: 8,
      title: "Magalies Nature Reserve",
      color: "green",
      image: "https://example.com/images/magalies_nature_reserve.jpg",
      reference: "#location/8",
    },
    {
      lat: -26.0981,
      lng: 27.9842,
      category: "class",
      id: 77,
      title: "Advanced Salsa",
      color: "purple",
      image: "https://example.com/images/advanced_salsa.jpg",
      reference: "#class/77",
      date_start: "2024-11-26T14:00:00Z",
      date_end: "2024-11-26T15:00:00Z",
      keywords: "salsa, advanced",
    },
    {
      lat: -26.1234,
      lng: 28.0132,
      category: "event",
      id: 33,
      title: "Outdoor Concert",
      color: "yellow",
      image: "https://example.com/images/outdoor_concert.jpg",
      reference: "#event/33",
      date_start: "2024-12-05T16:00:00Z",
      date_end: "2024-12-05T21:00:00Z",
    },
    {
      lat: -26.1352,
      lng: 28.0003,
      category: "location",
      id: 9,
      title: "Randburg Sports Complex",
      color: "cyan",
      image: "https://example.com/images/randburg_sports_complex.jpg",
      reference: "#location/9",
    },
    {
      lat: -26.1755,
      lng: 28.0178,
      category: "person",
      id: 17,
      title: "Emily Green",
      color: "pink",
      image: "https://example.com/images/emily_green.jpg",
      reference: "#person/17",
      sub_category: "supplier",
    },
    {
      lat: -26.2115,
      lng: 28.0471,
      category: "class",
      id: 78,
      title: "Hip Hop Workshop",
      color: "blue",
      image: "https://example.com/images/hip_hop_workshop.jpg",
      reference: "#class/78",
      date_start: "2024-11-27T12:00:00Z",
      date_end: "2024-11-27T13:00:00Z",
    },
    {
      lat: -26.2041,
      lng: 28.0453,
      category: "event",
      id: 34,
      title: "Cultural Festival",
      color: "orange",
      image: "https://example.com/images/cultural_festival.jpg",
      reference: "#event/34",
      date_start: "2024-12-10T09:00:00Z",
      date_end: "2024-12-10T17:00:00Z",
    },
    {
      lat: -26.2334,
      lng: 28.0032,
      category: "location",
      id: 10,
      title: "Johannesburg Botanical Gardens",
      color: "green",
      image: "https://example.com/images/johannesburg_botanical_gardens.jpg",
      reference: "#location/10",
    },
  ]);

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
