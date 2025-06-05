import React, { createContext, useState, useEffect } from "react";
import { useUser } from "../../auth/context/useuser";
import useTenant from "../../tenant/context/usetenant";
import { useToast } from "../../../packages/toasts/usetoast";
import { combineUrlAndPath } from "../../../functions/combineurlandpath";
import useGeoLocation from "../../../hooks/usegeolocation";

// LoyaltyContext.js
export const LoyaltyContext = createContext();

export const LoyaltyProvider = ({ children }) => {
  const [systems, setSystems] = useState([]);
  const [system, setSystem] = useState();
  const [selectedSystemId, setSelectedSystemId] = useState(null);
  const [cards, setCards] = useState([]);
  const [rewards, setRewards] = useState([]);
  const { tenant } = useTenant();

  const [customerId, setCustomerId] = useState();
  const [customer, setCustomer] = useState();
  const [customerStamps, setCustomerStamps] = useState();
  const [customerRewards, setCustomerRewards] = useState();

  // const { latlng } = useGeoLocation();

  const [loading, setLoading] = useState(false); // New loading state
  const { user, token, getIdFromFullId } = useUser();
  const { addToast } = useToast();

  const headers = {
    "Content-Type": "application/json",
    APP_ID: tenant,
    token: token,
  };

  const fetchCustomer = () => {
    setLoading(true);
    const userId = getIdFromFullId(customerId);
    console.log("Fetching customer with ID:", customerId, userId);
    fetch(
      combineUrlAndPath(
        process.env.REACT_APP_LOYALTY_API,
        `api.php/user/${userId}`
      ),
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Customer data fetched:", data);
        setCustomer(data[0]);
      })
      .catch((error) => console.error("Error fetching customer:", error))
      .finally(() => setLoading(false));
  };

  const fetchCustomerStamps = () => {
    setLoading(true);
    fetch(
      combineUrlAndPath(
        process.env.REACT_APP_LOYALTY_API,
        `api.php/user/${customerId}/cards`
      ),
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setCustomerStamps(
          data.filter((card) => card.system_id === selectedSystemId)
        );
      })
      .catch((error) => console.error("Error fetching customer stamps:", error))
      .finally(() => setLoading(false));
  };

  const fetchCustomerRewards = () => {
    setLoading(true);
    fetch(
      combineUrlAndPath(
        process.env.REACT_APP_LOYALTY_API,
        `api.php/user/${customerId}/rewards`
      ),
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setCustomerRewards(
          data.filter(
            (reward) =>
              reward.system_id === selectedSystemId &&
              reward.date_redeemed === null
          )
        );
      })
      .catch((error) =>
        console.error("Error fetching customer rewards:", error)
      )
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
    setLoading(true);
    return fetch(
      combineUrlAndPath(
        process.env.REACT_APP_LOYALTY_API,
        `api.php/user/${userId}/systems`
      ),
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setSystems(data);
        setSelectedSystemId(data[0]?.id);
        setSystem(data[0]);
      })
      .finally(() => setLoading(false));
  };

  const getSystemCards = (systemId) => {
    setLoading(true);
    return fetch(
      combineUrlAndPath(
        process.env.REACT_APP_LOYALTY_API,
        `api.php/system/${systemId}/cards`
      ),
      { headers }
    )
      .then((response) => response.json())
      .finally(() => setLoading(false));
  };

  const getSystemRewards = (systemId) => {
    setLoading(true);
    return fetch(
      combineUrlAndPath(
        process.env.REACT_APP_LOYALTY_API,
        `api.php/system/${systemId}/reward`
      ),
      { headers }
    )
      .then((response) => response.json())
      .finally(() => setLoading(false));
  };

  const createSystem = (
    name,
    description,
    image,
    stampsRequired,
    rewardDescription
  ) => {
    const today = new Date().toISOString();

    setLoading(true);
    return fetch(
      combineUrlAndPath(process.env.REACT_APP_LOYALTY_API, `/api.php/system`),
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          venue_id: user.id,
          name: name,
          description: description,
          image: image,
          stamps_required: stampsRequired,
          reward_description: rewardDescription,
          start_date: today,
          end_date: null,
        }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        getUserSystems();
        addToast("Loyalty", "System created", "success");
        return response.json();
      })
      .catch((error) => {
        console.error("Failed to create system:", error);
        throw error;
      })
      .finally(() => setLoading(false));
  };

  const createCard = (userId, systemId) => {
    setLoading(true);
    return fetch(
      combineUrlAndPath(process.env.REACT_APP_LOYALTY_API, `api.php/card`),
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          user_id: userId,
          system_id: systemId,
          qr_code: "",
          stamps_collected: 0,
        }),
      }
    )
      .then((response) => response.json())
      .finally(() => setLoading(false));
  };

  const addUserStamp = (systemId, id) => {
    setLoading(true);
    // console.log("==== Position", latlng.latitude, latlng.longitude);
    console.log("Adding stamp without GeoPosition")
    const body = {
      // lat: latlng.latitude,
      // lng: latlng.longitude,
    }
    return fetch(
      combineUrlAndPath(
        process.env.REACT_APP_LOYALTY_API,
        `addstamp.php?id=${systemId}&user=${id}`
      ),
      {
        method: "POST",
        headers,
        body: JSON.stringify(body)
      }
    )
      .then((response) => response.json())
      .then((data) => {
        getSystemData();
      })
      .finally(() => setLoading(false));
  };

  const redeemUserReward = (systemId, id) => {
    setLoading(true);
    return fetch(
      combineUrlAndPath(
        process.env.REACT_APP_LOYALTY_API,
        `/redeemreward.php?id=${systemId}&user=${id}`
      ),
      {
        method: "POST",
        headers,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (customerId) {
          fetchCustomerRewards();
        }
        getSystemData();
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setSystem(systems[0]);
    setSelectedSystemId(systems[0]?.id);
  }, [systems]);

  useEffect(() => {}, [system]);

  useEffect(() => {
    if (user) {
      getUserSystems(user.id);
    }
  }, [user]);

  const getSystemData = () => {
    if (selectedSystemId) {
      getSystemCards(selectedSystemId).then(setCards);
      getSystemRewards(selectedSystemId).then(setRewards);
    }
  };

  useEffect(() => {
    getSystemData();
  }, [selectedSystemId]);

  const selectSystem = (systemId) => {
    if (systems.some((system) => system.id === systemId)) {
      setSelectedSystemId(systemId);
    }
  };

  const createNewCard = (userId, systemId) => {
    return createCard(userId, systemId).then((newCard) => {
      setCards([...cards, newCard]);
      return newCard;
    });
  };

  const addNewStamp = (cardId) => {
    return addStamp(cardId).then((newStamp) => {
      setCards(
        cards.map((card) =>
          card.id === cardId
            ? { ...card, stamps_collected: card.stamps_collected + 1 }
            : card
        )
      );
      return newStamp;
    });
  };

  return (
    <LoyaltyContext.Provider
      value={{
        system,
        systems,
        createSystem,
        selectedSystemId,
        selectSystem,
        cards,
        rewards,
        createNewCard,
        addNewStamp,
        addUserStamp,
        redeemUserReward,
        customerId,
        customer,
        setCustomerId,
        customerStamps,
        customerRewards,
        loading, // Expose the loading state
      }}
    >
      {children}
    </LoyaltyContext.Provider>
  );
};

export default LoyaltyProvider;
