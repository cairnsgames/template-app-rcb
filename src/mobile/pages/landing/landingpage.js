import React, { useRef } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Features from "./features";
import Hero from "./hero";
import Footer from "./footer";
import Testimonials from "./testimonial";
import PartnerProgramHero from "./partnerprogram";

const LandingPage = ({ subTitle }) => {
  const heroRef = useRef();
  const featureRef = useRef();
  const pricingRef = useRef();
  const albumRef = useRef();

  return (
    <Container fluid className="px-2" style={{ minHeight: "85%", maxHeight: "calc(100vh - 160px)", overflowY: "auto", overflowX: "hidden" }}>
      <div ref={heroRef}>
        <Hero />
      </div>
      {subTitle && <h2 className="text-center mt-4">{subTitle}</h2>}
      <div ref={featureRef}>
        <Features />
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
