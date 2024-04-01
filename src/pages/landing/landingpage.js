import React from "react";
import { Button, Container, Image } from "react-bootstrap";
import Pricing from "./pricing";
import Features from "./features";
import Hero from "./hero";
import Album from "./album";
import Footer from "./footer";
import { useRef } from "react";
import Events from "./events";

const LandingPage = ({subTitle}) => {
  const heroRef = useRef();
  const featureRef = useRef();
  const pricingRef = useRef();
  const albumRef = useRef();
  return (
    <Container className="px-2">
      <div ref={heroRef}>
        <Hero />
      </div>
      {subTitle && <h2>SUBTITLE: {subTitle}</h2>}
      <div ref={featureRef}>
        <Features />
      </div>
      <div ref={pricingRef}>
        <Pricing />
      </div>
      <div ref={albumRef}>
        <Events />
      </div>
      <Footer
        heroRef={heroRef}
        featureRef={featureRef}
        pricingRef={pricingRef}
        albumRef={albumRef}
      />
    </Container>
  );
};

export default LandingPage;
