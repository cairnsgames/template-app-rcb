import React from "react";
import { Button, Container, Image } from "react-bootstrap";
import useUser from "@cairnsgames/auth/context/useuser";

const Hero = (props) => {
  const { isLoggedIn } = useUser();
  return (
    <div className="pb-5 my-5 text-center">
      <Image className="mb-4" src="./favicon.png" alt="" width="72" />
      <h1 className="display-5 fw-bold">Kloko</h1>
      <div className="w-75 mx-auto">
        <div className="lead mb-4">
        Maximize your productivity with our calendar tool! Easily set regular or recurring activities, like classes or meetings, as recurring events. Select multiple dates at once to save time and keep your schedule consistent.
        </div>
        {!isLoggedIn && (
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <Button
              href="#login"
              variant="primary"
              size="lg"
              className="px-4 gap-3"
            >
              Login
            </Button>
            <Button
              href="#register"
              variant="outline-secondary"
              size="lg"
              className="px-4"
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
