import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Hero from "./hero";
import PartnerBenefits from "./benefits";
import Footer from "./footer";
import Features from "./features";
import PartnerSignupModal from "../partnersignup";
import CallToAction from "./calltoaction";
import PartnerIcons from "./partnericons";
import DancePartnersVideo from "../../../../components/DancePartnersVideo";

const LandingPage = ({ roles = [] }) => {
  const { t } = useTranslation();
  const [modalShow, setModalShow] = useState(false);

  const openSignup = () => {
    setModalShow(true);
  };

  const closeSignup = () => {
    setModalShow(false);
  };

  const joinPartnerProgram = (partnerData) => {
    // Handle the join partner logic here
    closeSignup();
  };

  return (
    <Container
      fluid
      className="px-2"
      style={{ overflowY: "auto", overflowX: "hidden" }}
    >
      <Hero openSignup={openSignup} roles={roles} t={t} />
      <DancePartnersVideo />
      {roles.length > 0 && <PartnerIcons t={t} />}
      <Features t={t} />
      <PartnerBenefits t={t} />
      {roles.length === 0 && <CallToAction showSignup={openSignup} t={t} />}
      <Footer showSignup={openSignup} t={t} />
      <PartnerSignupModal
        show={modalShow}
        handleClose={closeSignup}
        joinPartnerProgram={joinPartnerProgram}
        t={t}
      />
    </Container>
  );
};

export default LandingPage;
