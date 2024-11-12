import React, { createContext, useState, useEffect, useContext } from 'react';
import { useUser } from '../../auth/context/useuser';
import { useTenant } from '../../tenant/context/usetenant';
import { combineUrlAndPath } from '../../../functions/combineurlandpath';
const UserLoyaltyContext = createContext();

export const useUserLoyalty = () => useContext(UserLoyaltyContext);

export const UserLoyaltyProvider = ({ children }) => {
  const { user, token } = useUser();
  const { tenant } = useTenant();
  const [cards, setCards] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [stamps, setStamps] = useState([]);

  const count = cards?.length ?? 0;

  const headers = {
    'Content-Type': 'application/json',
    APP_ID: tenant,
    token: token,
  };

  useEffect(() => {
  }, [cards]);

  useEffect(() => {
    if (user) {
      fetch(combineUrlAndPath(process.env.REACT_APP_LOYALTY_API, `api.php/user/${user.id}/cards`), { headers })
        .then(response => response.json())
        .then(data => setCards(data))
        .catch(error => console.error('Error fetching cards:', error));
      
      fetch(combineUrlAndPath(process.env.REACT_APP_LOYALTY_API, `api.php/user/${user.id}/rewards`), { headers })
        .then(response => response.json())
        .then(data => setRewards(data.filter(reward => !reward.date_redeemed)))
        .catch(error => console.error('Error fetching rewards:', error));
    }
  }, [user]);

  useEffect(() => {
    if (selectedCard) {      
      fetch(combineUrlAndPath(process.env.REACT_APP_LOYALTY_API, `/card/${selectedCard}/stamps`), { headers })
        .then(response => response.json())
        .then(data => setStamps(data))
        .catch(error => console.error('Error fetching related stamps:', error));
    }
  }, [selectedCard]);

  useEffect(() => {
    console.log("!!!! rewards loaded". rewards)
  }, [rewards]);

  return (
    <UserLoyaltyContext.Provider value={{ cards, count, rewards, stamps, selectedCard, setSelectedCard }}>
      {children}
    </UserLoyaltyContext.Provider>
  );
};
