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

  return (
    <PartnerContext.Provider value={{ partners, fetchPartners, setPartners, location, setLocation }}>
      {children}
    </PartnerContext.Provider>
  );
};

export const usePartner = () => {
  const context = useContext(PartnerContext);

    if (!context) {
    throw new Error("usePartner was used outside of its Provider");
  }
  
  const { partners, fetchPartners, setPartners, location, setLocation } = context;

  return { partners, fetchPartners, setPartners, location, setLocation };
};

export default PartnerContext;
