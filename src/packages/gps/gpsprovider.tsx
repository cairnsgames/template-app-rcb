import React, { createContext, useState } from "react";
import { logUntypedResponse } from "../../functions/loguntypedresponse";
import { GpsAddressParts, GPSContextValue, LocationCache } from "./gps.types";

export const GPSContext = createContext<GPSContextValue | undefined>(undefined);

type GPSProviderProps = {
  children: React.ReactNode;
};

export const GPSProvider = ({ children }: GPSProviderProps) => {
  const [locationDetails, setLocationDetails] = useState<LocationCache>({});
  const [loading, setLoading] = useState(false);

  const getLocationDetails = async (lat: number, lng: number): Promise<GpsAddressParts | null> => {
    try {
      setLoading(true);

      if (locationDetails[`${lat},${lng}`]) {
        setLoading(false);
        return locationDetails[`${lat},${lng}`];
      }

      const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
      const response = await fetch(apiUrl);
      const raw = logUntypedResponse<{ address: Record<string, string> }>(
        "gpsprovider.getLocationDetails",
        await response.json()
      );

      const addressParts: GpsAddressParts = {
        road: raw.address.road || "",
        suburb: raw.address.suburb || "",
        city: raw.address.city || "",
        county: raw.address.county || "",
        state: raw.address.state || "",
        postcode: raw.address.postcode || "",
        country: raw.address.country || "",
        countryCode: raw.address.country_code || "",
      };

      setLocationDetails((prev) => ({ ...prev, [`${lat},${lng}`]: addressParts }));
      setLoading(false);
      return addressParts;
    } catch (error) {
      console.error("Error fetching location details:", error);
      setLoading(false);
      return null;
    }
  };

  return (
    <GPSContext.Provider value={{ locationDetails, loading, getLocationDetails }}>
      {children}
    </GPSContext.Provider>
  );
};
