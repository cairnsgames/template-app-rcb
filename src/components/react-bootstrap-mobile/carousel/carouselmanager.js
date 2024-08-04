import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import Image from "react-bootstrap/Image";
import CarouselItemContent from "./carouselitemcontent";
import "./carouselmanager.scss";

const CarouselManager = ({ items }) => {
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
    >
      {items.map((item, index) => {
        return (
          <Carousel.Item key={item.name}>
            <Image src="./images/empty.png" />
            <Carousel.Caption>
              <CarouselItemContent {...item} />
            </Carousel.Caption>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
};

export default CarouselManager;
