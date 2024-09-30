import React, { useEffect } from "react";
import LoyaltyCardManager from "../packages/loyalty/cards/loyaltycardmanager";
import {
  UserLoyaltyProvider,
  useUserLoyalty,
} from "../packages/loyalty/userloyaltyprovider";

const LoyaltyCarousel = () => {
  const { cards, rewards } = useUserLoyalty();
  useEffect(() => {
  }, [cards]);
  return <LoyaltyCardManager items={cards} rewards={rewards} variant="primary" />;
};

const UserLoyalty = () => {
  return (
    <div style={{ height: "100%" }}>
      <UserLoyaltyProvider>
        <LoyaltyCarousel />
      </UserLoyaltyProvider>
    </div>
  );
};

export default UserLoyalty;
