import React, { createContext, useState, useEffect, useContext } from 'react';
import { useUser } from '../auth/context/useuser';
import { useTenant } from '../tenant/context/usetenant';
const UserLoyaltyContext = createContext();

export const useUserLoyalty = () => useContext(UserLoyaltyContext);
export const API_BASE_URL = "http://localhost/cairnsgames/php/loyalty/api.php";

export const UserLoyaltyProvider = ({ children }) => {
  const { user, token } = useUser();
  const { tenant } = useTenant();
  const [cards, setCards] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [stamps, setStamps] = useState([]);

  const headers = {
    'Content-Type': 'application/json',
    APP_ID: tenant,
    token: token,
  };

  useEffect(() => {
    if (user) {
      fetch(`${API_BASE_URL}/user/${user.id}/cards`, { headers })
        .then(response => response.json())
        .then(data => setCards(data))
        .catch(error => console.error('Error fetching cards:', error));
      
      fetch(`${API_BASE_URL}/user/${user.id}/rewards`, { headers })
        .then(response => response.json())
        .then(data => setRewards(data))
        .catch(error => console.error('Error fetching rewards:', error));
    }
  }, [user]);

  useEffect(() => {
    if (selectedCard) {      
      fetch(`${API_BASE_URL}/card/${selectedCard}/stamps`, { headers })
        .then(response => response.json())
        .then(data => setStamps(data))
        .catch(error => console.error('Error fetching related stamps:', error));
    }
  }, [selectedCard]);

  return (
    <UserLoyaltyContext.Provider value={{ cards, rewards, stamps, selectedCard, setSelectedCard }}>
      {children}
    </UserLoyaltyContext.Provider>
  );
};
