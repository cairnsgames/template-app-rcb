import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";
import Hero from "./hero";
import PartnerBenefits from "./benefits";
import Footer from "./footer";
import Features from "./features";
import PartnerSignupModal from "../partnersignup";
import CallToAction from "./calltoaction";

const LandingPage = () => {
  const [modalShow, setModalShow] = useState(false);

  const openSignup = () => {
    setModalShow(true);
  };

  const closeSignup = () => {
    setModalShow(false);
  };

  const joinPartnerProgram = (partnerData) => {
    console.log("Partner Data:", partnerData);
    // Handle the join partner logic here
    closeSignup();
  };

  return (
    <Container fluid className="px-2" style={{overflowY: "auto", overflowX: "hidden"}}>
      <Hero openSignup={openSignup} />
      <Features />
      <PartnerBenefits />
      <CallToAction showSignup={openSignup} />
      <Footer showSignup={openSignup} />
      <PartnerSignupModal
        show={modalShow}
        handleClose={closeSignup}
        joinPartnerProgram={joinPartnerProgram}
      />
    </Container>
  );
};

export default LandingPage;
