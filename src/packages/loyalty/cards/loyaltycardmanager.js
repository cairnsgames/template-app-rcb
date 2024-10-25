import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import LoyaltyCardContent from "./loyaltycardcontent";
import "./loyaltycardmanager.scss";
import { CardChecklist, ChevronLeft, ChevronRight } from "react-bootstrap-icons";

const LoyaltyCardManager = ({ items, rewards }) => {
  const [index, setIndex] = useState(0);

  const count = items?.length ?? 0;

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  if (!items || items.length === 0) {
    return (
      <div className="no-loyalty-cards-content text-center mt-5">
        <CardChecklist className="text-primary icon" size={50} />
        <h3 className="mt-3">You don't have any</h3>
        <h1>Loyalty Cards</h1>
        <h2>Yet!</h2>
        <p className="mt-2">
          Please visit one of our partner locations to get your loyalty card.
        </p>
      </div>
    );
  }

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
              <LoyaltyCardContent item={item} index={index} of={count} reward={reward} />
            </Carousel.Caption>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
};

export default LoyaltyCardManager;
