import React from "react";
import { Button, Container, Image } from "react-bootstrap";
import useUser from "@cairnsgames/auth/context/useuser";

const Hero = (props) => {
  const { isLoggedIn } = useUser();
  return (
    <div className="pb-5 my-5 text-center">
      <Image className="mb-4" src="./favicon.png" alt="" width="72" />
      <h1 className="display-5 fw-bold">Landing Page</h1>
      <div className="w-75 mx-auto">
        <div className="lead mb-4">
          Quickly design and customize responsive mobile-first sites with
          Bootstrap, the world’s most popular front-end open source toolkit,
          featuring Sass variables and mixins, responsive grid system, extensive
          prebuilt components, and powerful JavaScript plugins.
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
              Register
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
