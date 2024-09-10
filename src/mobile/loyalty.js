import React, { useEffect } from "react";
import CarouselManager from "../components/react-bootstrap-mobile/carousel/carouselmanager";
import {
  UserLoyaltyProvider,
  useUserLoyalty,
} from "../packages/loyalty/userloyaltyprovider";

const items = [
  { name: "Item 1", logo: "images/rest1.png" },
  { name: "Item 2", logo: "images/rest2.png" },
  { name: "Item 3", logo: "images/rest3.png" },
  { name: "Item 4", logo: "images/rest4.png" },
];

const LoyaltyCarousel = () => {
  const { cards } = useUserLoyalty();
  useEffect(() => {
    console.log("=== Show Cards", cards);
  }, [cards]);
  return <CarouselManager items={cards} variant="primary" />;
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
