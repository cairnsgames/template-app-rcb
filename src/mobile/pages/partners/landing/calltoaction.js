import React from 'react';
import { Button } from 'react-bootstrap';

const CallToAction = ({showSignup}) => (
  <div className="bg-light my-3 py-5 text-center">
    <h2 className="display-6">Join Our Partnership Program Today!</h2>
    <p className="lead">Become a part of a thriving community and take your business to the next level.</p>
    <Button variant="primary" size="lg" className="mt-3" onClick={showSignup}>
      Become a Partner
    </Button>
  </div>
);

export default CallToAction;
