import React from "react";
import { Button, Image } from "react-bootstrap";
import { useUser } from "../../../packages/auth/context/useuser";

const Hero = () => {
  const { isLoggedIn } = useUser();

  return (
    <div className="my-5 text-center">
      <Image className="mb-4" src="./favicon.png" alt="Kloko" width="72" />
      <h1 className="display-5 fw-bold">Juzt.Dance</h1>
      <p className="lead mb-4">
        Maximize your dance experience with our platform! Discover events, book classes, and earn rewards with our partners. Get the latest news and shop for merchandise—all in one place.
      </p>
      <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
        {!isLoggedIn && (
          <>
            <Button href="#login" variant="primary" size="lg" className="px-4 gap-3">
              Login
            </Button>
            <Button href="#register" variant="outline-secondary" size="lg" className="px-4">
              Sign up
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Hero;
