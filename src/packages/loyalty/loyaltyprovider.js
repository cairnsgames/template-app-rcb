import React, { createContext, useState, useEffect } from "react";
import { useUser } from "../auth/context/useuser";
import useTenant from "../tenant/context/usetenant";
import { useToast } from "../../packages/toasts/usetoast";
import { combineUrlAndPath } from "../../functions/combineurlandpath";

// LoyaltyContext.js
export const LoyaltyContext = createContext();

export const LoyaltyProvider = ({ children }) => {
  const [systems, setSystems] = useState([]);
  const [system, setSystem] = useState();
  const [selectedSystemId, setSelectedSystemId] = useState(null);
  const [cards, setCards] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false); // New loading state
  const { tenant } = useTenant();

  const [customerId, setCustomerId] = useState();
  const [customer, setCustomer] = useState();
  const [customerStamps, setCustomerStamps] = useState();
  const [customerRewards, setCustomerRewards] = useState();

  const { user, token } = useUser();
  const { addToast } = useToast();

  const headers = {
    "Content-Type": "application/json",
    APP_ID: tenant,
    token: token,
  };

  const fetchCustomer = () => {
    setLoading(true); // Set loading true when starting the fetch
    fetch(combineUrlAndPath(process.env.REACT_APP_LOYALTY_API, `api.php/user/${customerId}`), { headers })
      .then((response) => response.json())
      .then((data) => {
        setCustomer(data[0]);
      })
      .catch((error) => console.error("Error fetching customer:", error))
      .finally(() => setLoading(false)); // Set loading false after the fetch completes
  };

  const fetchCustomerStamps = () => {
    setLoading(true);
    fetch(combineUrlAndPath(process.env.REACT_APP_LOYALTY_API, `api.php/user/${customerId}/cards`), { headers })
      .then((response) => response.json())
      .then((data) => {
        setCustomerStamps(data.filter((card) => card.system_id === selectedSystemId));
      })
      .catch((error) => console.error("Error fetching customer stamps:", error))
      .finally(() => setLoading(false));
  };

  const fetchCustomerRewards = () => {
    setLoading(true);
    fetch(combineUrlAndPath(process.env.REACT_APP_LOYALTY_API, `api.php/user/${customerId}/rewards`), { headers })
      .then((response) => response.json())
      .then((data) => {
        setCustomerRewards(
          data.filter((reward) => reward.system_id === selectedSystemId && reward.date_redeemed === null)
        );
      })
      .catch((error) => console.error("Error fetching customer rewards:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!customerId) {
      setCustomerRewards(undefined);
      setCustomerStamps(undefined);
      setCustomer(undefined);
      return;
    }
    fetchCustomer();
    fetchCustomerStamps();
    fetchCustomerRewards();
  }, [customerId]);

  useEffect(() => {
    setSystem(systems.find((system) => system.id === selectedSystemId));
  }, [selectedSystemId]);

  const getUserSystems = (userId = user.id) => {
    setLoading(true); // Start loading before fetching systems
    return fetch(combineUrlAndPath(process.env.REACT_APP_LOYALTY_API, `api.php/user/${userId}/systems`), { headers })
      .then((response) => response.json())
      .then((data) => {
        setSystems(data);
        setSelectedSystemId(data[0]?.id);
        setSystem(data[0]);
      })
      .finally(() => setLoading(false)); // End loading after the fetch completes
  };

  const getSystemCards = (systemId) => {
    setLoading(true);
    return fetch(combineUrlAndPath(process.env.REACT_APP_LOYALTY_API, `api.php/system/${systemId}/cards`), { headers })
      .then((response) => response.json())
      .finally(() => setLoading(false));
  };

  const getSystemRewards = (systemId) => {
    setLoading(true);
    return fetch(combineUrlAndPath(process.env.REACT_APP_LOYALTY_API, `api.php/system/${systemId}/reward`), { headers })
      .then((response) => response.json())
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getSystemData();
  }, [selectedSystemId]);

  const getSystemData = () => {
    if (selectedSystemId) {
      getSystemCards(selectedSystemId).then(setCards);
      getSystemRewards(selectedSystemId).then(setRewards);
    }
  };

  const selectSystem = (systemId) => {
    if (systems.some((system) => system.id === systemId)) {
      setSelectedSystemId(systemId);
    }
  };

  return (
    <LoyaltyContext.Provider
      value={{
        system,
        systems,
        selectedSystemId,
        selectSystem,
        cards,
        rewards,
        customerId,
        customer,
        setCustomerId,
        customerStamps,
        customerRewards,
        loading, // Expose loading state
      }}
    >
      {children}
    </LoyaltyContext.Provider>
  );
};

export default LoyaltyProvider;
