import React, { createContext, useContext, useEffect, useState } from "react";
import useTenant from "../../tenant/context/usetenant";
import useUser from "../../auth/context/useuser";
import { combineUrlAndPath } from "../../../functions/combineurlandpath";
import { useNews } from "../../news/context/newscontext";

const PartnerContext = createContext(null);

export const PartnerProvider = ({ children }) => {
  const { tenant } = useTenant();
  const { token } = useUser();
  const [partners, setPartners] = useState([]);
  const [location, setLocation] = useState({});
  // partner-related collections (populated by future endpoints)
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [activePartnerId, setActivePartnerId] = useState(null);
  const [activePartner, setActivePartner] = useState(null);

  useEffect(() => {
    console.log("ZZZZ PartnerProvider fetching partners with location:", location);
    const lat = location?.lat ?? location?.latitude ?? -26.096;
    const lng = location?.lng ?? location?.lon ?? location?.longitude ?? 28.009;
    const distance = location?.distance ?? 50000;
    fetchPartners(lat, lng, distance);
  }, [location, tenant, token]);

  const fetchPartners = async (lat = -26.096, lng = 28.009, distance = 50000) => {
    if (!process.env.REACT_APP_PARTNER_API) return null;
    const url = combineUrlAndPath(process.env.REACT_APP_PARTNER_API, "api.php/localpartners");

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          app_id: tenant,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lat, lng, distance }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Partner API error ${res.status} ${text}`);
      }

      const json = await res.json();
      const list = Array.isArray(json) ? json : json.data || [];
      setPartners(list);
      return list;
    } catch (err) {
      console.error("fetchPartners failed:", err);
      setPartners([]);
      return null;
    }
  };

  // Keep activePartner in sync with activePartnerId and partners list
  useEffect(() => {
    if (activePartnerId === undefined || activePartnerId === null) {
      setActivePartner(null);
      return;
    }

    const idStr = String(activePartnerId);
    const found = (partners || []).find((p) => {
      // match against user_id or id fields
      const pid = p?.user_id ?? p?.id;
      if (pid === undefined || pid === null) return false;
      return String(pid) === idStr;
    });

    setActivePartner(found || null);
  }, [activePartnerId, partners]);

  // When an active partner id is set, fetch that partner's events (and classes)
  useEffect(() => {
    const fetchPartnerEvents = async (partnerId) => {
      if (!process.env.REACT_APP_KLOKO_API) return;
      const url = combineUrlAndPath(process.env.REACT_APP_KLOKO_API, `api.php/user/${partnerId}/events`);

      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            app_id: tenant,
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Partner events API error ${res.status} ${txt}`);
        }

        const json = await res.json();
        const list = Array.isArray(json) ? json : json.data || [];

        // split into events and classes based on event_type
        const eventsList = [];
        const classesList = [];
        (list || []).forEach((item) => {
          const type = (item && item.event_type) ? String(item.event_type).toLowerCase() : "event";
          if (type === "class" || type === "classes") {
            classesList.push(item);
          } else {
            eventsList.push(item);
          }
        });

        setEvents(eventsList);
        setClasses(classesList);
        return list;
      } catch (err) {
        console.error("fetchPartnerEvents failed:", err);
        setEvents([]);
        setClasses([]);
        return null;
      }
    };

    const fetchPartnerNews = async (partnerId) => {
      if (!process.env.REACT_APP_NEWS_API) return;
      const url = combineUrlAndPath(process.env.REACT_APP_NEWS_API, `api.php/user/${partnerId}/news`);

      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            app_id: tenant,
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Partner news API error ${res.status} ${txt}`);
        }

        const json = await res.json();
        const list = Array.isArray(json) ? json : json.data || [];
        setNews(list);
        return list;
      } catch (err) {
        console.error("fetchPartnerNews failed:", err);
        setNews([]);
        return null;
      }
    };

    if (activePartnerId === undefined || activePartnerId === null) {
      setEvents([]);
      setClasses([]);
      return;
    }

    // fetch events/classes and partner-specific news in parallel
    fetchPartnerEvents(activePartnerId);
    fetchPartnerNews(activePartnerId);
  }, [activePartnerId, tenant, token]);

  return (
    <PartnerContext.Provider
      value={{
        partners,
        fetchPartners,
        setPartners,
        location,
        setLocation,
        classes,
        setClasses,
        events,
        setEvents,
        news,
        setNews,
        activePartnerId,
        setActivePartnerId,
        activePartner,
      }}
    >
      {children}
    </PartnerContext.Provider>
  );
};

export const usePartner = () => {
  const context = useContext(PartnerContext);

    if (!context) {
    throw new Error("usePartner was used outside of its Provider");
  }
  
  const {
    partners,
    fetchPartners,
    setPartners,
    location,
    setLocation,
    classes,
    setClasses,
    events,
    setEvents,
    news,
    setNews,
    activePartnerId,
    setActivePartnerId,
    activePartner,
  } = context;

  return {
    partners,
    fetchPartners,
    setPartners,
    location,
    setLocation,
    classes,
    setClasses,
    events,
    setEvents,
    news,
    setNews,
    activePartnerId,
    setActivePartnerId,
    activePartner,
  };
};

export default PartnerContext;
