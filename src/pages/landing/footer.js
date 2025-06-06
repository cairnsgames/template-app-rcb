import React from "react";
import { Image } from "react-bootstrap";
import useScrollTo from "../../hooks/usescrollto";
import Button from "react-bootstrap/Button";

const Footer = (props) => {
  const { heroRef, featureRef, pricingRef, albumRef } = props;
  const { scrollTo } = useScrollTo();
  return (
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
        <p className="col-md-4 mb-0 text-body-secondary">© 2025 CairnsGames</p>
        <a
          href="/"
          className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
        >
          <Image height="48px" src="favicon.png" />
        </a>
        <div className="nav col-md-4 justify-content-end">
            <Button
                size="sm"
              variant="light"
              className="px-2 text-body-secondary"
              onClick={() => scrollTo(heroRef)}
            >
              Home
            </Button>
            <Button
                size="sm"
              variant="light"
              className="px-2 text-body-secondary"
              onClick={() => scrollTo(featureRef)}
            >
              Features
            </Button>
            <Button
                size="sm"
              variant="light"
              className="px-2 text-body-secondary"
              onClick={() => scrollTo(pricingRef)}
            >
              Pricing
            </Button>
            <Button
                size="sm"
              variant="light"
              className="px-2 text-body-secondary"
              onClick={() =>scrollTo(albumRef)}
            >
              Events
            </Button>
            <Button
                size="sm"
              variant="light"
              className="px-2 text-body-secondary"
            >
              About
            </Button>
        </div>
      </footer>
  );
};

export default Footer;
