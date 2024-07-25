import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import './imageslider.scss';

const ImageSlider = ({ cards }) => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <div className="carousel-container">
      <Carousel activeIndex={index} onSelect={handleSelect} interval={null} indicators={false}>
        {cards.map((card, idx) => (
          <Carousel.Item key={idx}>
            <div className="card-container">
              <div className="card">
                <img src={card.image} className="card-img-top" alt={card.name} />
                <div className="card-body">
                  <h5 className="card-title">{card.name}</h5>
                  <p className="card-text">{card.testimonial}</p>
                </div>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
      <div className="d-flex justify-content-center mt-4">
        <button className="carousel-control-prev" onClick={() => handleSelect(index === 0 ? cards.length - 1 : index - 1)}>
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" onClick={() => handleSelect((index + 1) % cards.length)}>
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default ImageSlider;
