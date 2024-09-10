import React from "react";
import ImageSlider from "../../../components/imageslider/imageslider";

const Testimonials = () => {
  return (
    <ImageSlider cards={[
        { name: 'Card 1', image: '/images/1.png', testimonial: 'very nice!' },
        { name: 'Card 2', image: '/images/2.png', testimonial: 'very nice!' },
        { name: 'Card 3', image: '/images/3.png', testimonial: 'very nice!' },
        { name: 'Card 4', image: '/images/4.png', testimonial: 'very nice!' },
        { name: 'Card 5', image: '/images/5.png', testimonial: 'very nice!' },
        { name: 'Card 6', image: '/images/6.png', testimonial: 'very nice!' },
      ]}/>
  );
};

export default Testimonials;
