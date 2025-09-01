import React, { createContext, useContext, useEffect, useState } from 'react';

const OfferingsContext = createContext();

export const OfferingsProvider = ({ children }) => {
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://cairnsgames.co.za/php/offerings/api.php/group')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        console.log("Fetched offerings:", data);
        setOfferings(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const offeringsForRole = (roleId) => {
    console.log(`Getting offerings for role ID: ${roleId}`);
    return offerings.filter((offering) => offering.forrole === roleId);
  };

  return (
    <OfferingsContext.Provider value={{ offerings, loading, error, offeringsForRole }}>
      {children}
    </OfferingsContext.Provider>
  );
};

export const useOfferings = () => useContext(OfferingsContext);
