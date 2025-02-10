import React from "react";
import { Card, Button } from "react-bootstrap";

const PartnerCard = () => {
  return (
    <div className="tile-wrapper mb-4">
      <Card
        className="mb-3"
        style={{ backgroundColor: "purple", color: "white" }}
      >
        <Card.Header>
          <div className="text-center">
            <h3>Partner Program</h3>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="fw-bold text-center" style={{ fontSize: "small" }}>
            We support all vendors associated directly and indirectly with the
            dance community value chain. We offer a Loyalty Program, ticketing
            and scheduling support, community news and more...
          </div>
        </Card.Body>
        <Card.Footer className="text-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => (window.location.href = "#partner")}
          >
            Join now
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default PartnerCard;
