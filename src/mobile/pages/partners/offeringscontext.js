import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '../../../packages/auth/context/useuser';
import { useTenant } from '../../../packages/tenant/context/usetenant';

const OfferingsContext = createContext();


export const OfferingsProvider = ({ children }) => {
  const [offerings, setOfferings] = useState([]);
  const [userOfferings, setUserOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userOfferingsLoading, setUserOfferingsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userOfferingsError, setUserOfferingsError] = useState(null);
  const { user, token } = useUser();
  const { tenant } = useTenant();

  // Fetch all offerings (group)
  useEffect(() => {
    fetch('http://cairnsgames.co.za/php/offerings/api.php/group', {
      headers: {
        'app_id': tenant,
        'authorization': `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setOfferings(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  // Fetch user offerings
  useEffect(() => {
    if (!user?.id || !token || !tenant) return;
    setUserOfferingsLoading(true);
    setUserOfferingsError(null);
    fetch(`http://cairnsgames.co.za/php/offerings/api.php/user/${user.id}/offerings`, {
      headers: {
        'app_id': tenant,
        'authorization': `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch user offerings');
        return res.json();
      })
      .then((data) => {
        setUserOfferings(data);
        setUserOfferingsLoading(false);
      })
      .catch((err) => {
        setUserOfferingsError(err);
        setUserOfferingsLoading(false);
      });
  }, [user?.id, token, tenant]);

  // Returns true if offering_id is active for user
  const activeOffering = (offering_id) => {
    if (offering_id === 72) {
      console.log("UserOfferings", userOfferings);
    }
    return userOfferings.some((o) => o.offering_id === offering_id && o.active === 1);
  };

  // Toggle offering for user
  const toggleOffering = async (offering_id) => {
    if (!user?.id || !token || !tenant) return;
    try {
      const res = await fetch('http://cairnsgames.co.za/php/offerings/api.php/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'app_id': tenant,
          'authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ offering_id }),
      });
      if (!res.ok) throw new Error('Failed to toggle offering');
      const data = await res.json();
      if (data.success) {
        if (data.action === 'deleted') {
          setUserOfferings((prev) => prev.filter((o) => o.offering_id !== offering_id));
        } else if (data.action === 'inserted' && data.record) {
          setUserOfferings((prev) => [...prev, data.record]);
        }
      }
      return data;
    } catch (err) {
      setUserOfferingsError(err);
      throw err;
    }
  };

  const offeringsForRole = (roleId) => {
    return offerings.filter((offering) => offering.forrole === roleId);
  };


  return (
    <OfferingsContext.Provider
      value={{
        offerings,
        loading,
        error,
        offeringsForRole,
        userOfferings,
        userOfferingsLoading,
        userOfferingsError,
        activeOffering,
        toggleOffering,
      }}
    >
      {children}
    </OfferingsContext.Provider>
  );
};

export const useOfferings = () => useContext(OfferingsContext);
