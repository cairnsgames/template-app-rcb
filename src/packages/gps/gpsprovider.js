import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context for GPS location details
export const GPSContext = createContext();

// GPS provider component
export const GPSProvider = ({ children }) => {
  const [locationDetails, setLocationDetails] = useState({});
  const [loading, setLoading] = useState(false);

  // Function to fetch location details
  const getLocationDetails = async (lat, lng) => {
    try {
      setLoading(true);

      // Check if already cached
      if (locationDetails[`${lat},${lng}`]) {
        setLoading(false);
        return locationDetails[`${lat},${lng}`];
      }

      // Fetch details from API
      const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Parse the response into address parts object
      const addressParts = {
        road: data.address.road || '',
        suburb: data.address.suburb || '',
        city: data.address.city || '',
        county: data.address.county || '',
        state: data.address.state || '',
        postcode: data.address.postcode || '',
        country: data.address.country || '',
        countryCode: data.address.country_code || ''
      };

      // Update state with new location details
      setLocationDetails(prevDetails => ({
        ...prevDetails,
        [`${lat},${lng}`]: addressParts
      }));

      setLoading(false);
      return addressParts;
    } catch (error) {
      console.error('Error fetching location details:', error);
      setLoading(false);
      return null; // Return null or handle error as needed
    }
  };

  return (
    <GPSContext.Provider value={{ locationDetails, loading, getLocationDetails }}>
      {children}
    </GPSContext.Provider>
  );
};
