import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import LoyaltyCardContent from "./loyaltycardcontent";
import "./loyaltycardmanager.scss";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

const LoyaltyCardManager = ({ items, rewards }) => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel
      className="loyalty-cards"
      activeIndex={index}
      onSelect={handleSelect}
      interval={null}
      indicators={false}
      touch={true}
      slide={true}
      nextIcon={<span style={{color:"var(--bs-primary)",fontSize:"32px"}}><ChevronRight /></span>}
      prevIcon={<span style={{color:"var(--bs-primary)",fontSize:"32px"}}><ChevronLeft /></span>}
    >
      {items.map((item, index) => {
        const reward = rewards.filter((r) => r.system_id === item.system_id).length;
        return (
          <Carousel.Item key={item.name} style={{height:"500px"}}>
            <Carousel.Caption>
              <LoyaltyCardContent item={item} reward={reward} />
            </Carousel.Caption>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
};

export default LoyaltyCardManager;
