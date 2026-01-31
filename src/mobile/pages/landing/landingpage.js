import React, { useRef, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Features from "./features";
import Hero from "./hero";
import Footer from "./footer";
import Testimonials from "./testimonial";
import PartnerProgramHero from "./partnerprogram";
import JuztDanceVideo from "../../../components/JuztDanceVideo";
import { combineUrlAndPath } from "../../../functions/combineurlandpath";


const LandingPage = ({ subTitle }) => {
  const heroRef = useRef();
  const featureRef = useRef();
  const pricingRef = useRef();
  const albumRef = useRef();

    useEffect(() => {
      console.log("Landing page loaded");
        const params = (() => {
      if (typeof window === "undefined") return {};
      return Object.fromEntries(new URLSearchParams(window.location.search));
    })();
      if (params.page !== "refer" || !params.refer) return;
  
      const referVal = params.refer;
      const referNum = Number(referVal);
      const payload = {
        refer: Number.isNaN(referNum) ? referVal : referNum,
      };
      if ("t" in params) payload.t = params.t;
  
      const referBase =
        process.env.REACT_APP_REFERAL_API ||
        "http://cairnsgames.co.za/php/referals/";
      const referUrl = combineUrlAndPath(referBase, "refer.php");
  
      console.log("Landing Page: Sending referral data", payload);
  
      fetch(referUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((err) => {
        console.error("Referral post failed", err);
      });
    }, []); 

  return (
    <Container
      fluid
      className="px-2"
      style={{
        minHeight: "85%",
        maxHeight: "calc(100vh - 160px)",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div ref={heroRef}>
        <Hero />
      </div>

      <JuztDanceVideo />

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
