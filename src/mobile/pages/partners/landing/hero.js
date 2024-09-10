import React from "react";
import { Button, Image } from "react-bootstrap";
import useUser from "../../../../packages/auth/context/useuser";

const Hero = ({openSignup}) => {
  const { isLoggedIn } = useUser();

  return (
    <div className="my-5 text-center">
      <Image className="mb-4" src="./favicon.png" alt="" width="72" />
      <h1 className="display-5 fw-bold">Partner with Us</h1>
      <div className="w-75 mx-auto">
        <p className="lead mb-4">
          Leverage our platform to manage your business, events, and orders. Join a community of dancers, teachers, DJs, venues, event coordinators, and suppliers.
        </p>
        {isLoggedIn && (
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
    <Button variant="primary" size="lg" className="mt-3" onClick={openSignup}>
      Become a Partner
    </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
