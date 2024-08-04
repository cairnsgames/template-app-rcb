import React from 'react';
import CarouselManager from '../components/react-bootstrap-mobile/carousel/carouselmanager';

const items = [
  { name: 'Item 1', logo: "images/rest1.png" },
  { name: 'Item 2', logo: "images/rest2.png" },
  { name: 'Item 3', logo: "images/rest3.png" },
  { name: 'Item 4', logo: "images/rest4.png" },
];

const LoyaltyCarousel = () => {
  return (
    <div style={{height: "100%"}}>
      <CarouselManager items={items} variant="primary" />
    </div>
  );
};

export default LoyaltyCarousel;