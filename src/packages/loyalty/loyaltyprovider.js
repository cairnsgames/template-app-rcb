import React, { createContext, useState, useEffect } from "react";
import { useUser } from "../auth/context/useuser";
import useTenant from "../tenant/context/usetenant";

// api
export const API_BASE_URL = "http://localhost/cairnsgames/php/loyalty/api.php";

// LoyaltyContext.js
export const LoyaltyContext = createContext();

export const LoyaltyProvider = ({ children }) => {
  const [systems, setSystems] = useState([]);
  const [selectedSystemId, setSelectedSystemId] = useState(null);
  const [cards, setCards] = useState([]);
  const [rewards, setRewards] = useState([]);
  const { tenant } = useTenant();

  const { user, token } = useUser();
  const headers = {
    "Content-Type": "application/json",
    APP_ID: tenant,
    token: token,
  };

  const getUserSystems = (userId) => {
    return fetch(`${API_BASE_URL}/user/${userId}/systems`, { headers }).then(
      (response) => response.json()
    );
  };

  const getSystemCards = (systemId) => {
    return fetch(`${API_BASE_URL}/system/${systemId}/cards`, { headers }).then(
      (response) => response.json()
    );
  };

  const getSystemRewards = (systemId) => {
    return fetch(`${API_BASE_URL}/system/${systemId}/reward`, { headers }).then(
      (response) => response.json()
    );
  };

  const createCard = (userId, systemId) => {
    return fetch(`${API_BASE_URL}/card`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        user_id: userId,
        system_id: systemId,
        qr_code: "",
        stamps_collected: 0,
      }),
    }).then((response) => response.json());
  };

  const addStamp = (cardId) => {
    return fetch(`${API_BASE_URL}/stamp`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        card_id: cardId,
        date_created: new Date().toISOString(),
      }),
    }).then((response) => response.json());
  };

  useEffect(() => {
    console.log("SYSTEMS", systems);
  }, [systems]);

  useEffect(() => {
    if (user) {
      getUserSystems(user.id).then(setSystems);
    }
  }, [user]);

  useEffect(() => {
    if (selectedSystemId) {
      getSystemCards(selectedSystemId).then(setCards);
      getSystemRewards(selectedSystemId).then(setRewards);
    }
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
        systems,
        selectedSystemId,
        selectSystem,
        cards,
        rewards,
        createNewCard,
        addNewStamp,
      }}
    >
      {children}
    </LoyaltyContext.Provider>
  );
};

export default LoyaltyProvider;
