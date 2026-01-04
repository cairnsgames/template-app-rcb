import React from "react";
import { Container } from "react-bootstrap";
import Pricing from "./pricing";
import Features from "./features";
import Hero from "./hero";
import Footer from "./footer";
import { useRef } from "react";
import Events from "./events";
import Testimonials from "./testimonial";
import PartnerProgramHero from "../../mobile/pages/landing/partnerprogram";

const LandingPage = ({subTitle}) => {
  const heroRef = useRef();
  const featureRef = useRef();
  const pricingRef = useRef();
  const albumRef = useRef();
  return (
    <Container fluid className="px-2 pagesLandingPage" style={{ minHeight: "85%", maxHeight: "calc(100vh - 160px)", overflowY: "scroll" }}>
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
      <Testimonials />
      <PartnerProgramHero />
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
