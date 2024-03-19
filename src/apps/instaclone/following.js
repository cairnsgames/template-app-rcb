import React from "react";
import { Container } from "react-bootstrap";
import { Person } from "react-bootstrap-icons";
import Avatar from "../../components/avatar";

const Following = ({ title, size, className, style }) => {
  const defaultSize = size || 64;
  const defaultHeight = defaultSize + 16;
  return (
    <div
      className="nopadding mb-3"
      style={{ height: defaultHeight + "px", ...style }}
    >
      <span>{title}</span>
      <Container
        className="nopadding scrolling-header mb-2"
      >
        <Avatar
          googleId="118096717852922241760"
          size={defaultSize}
          round={true}
          className="me-3"
        />
        <Avatar
          googleId="118096717852922241770"
          size={defaultSize}
          round={true}
          className="me-3"
        />
        <Avatar
          githubHandle="cairnswm"
          size={defaultSize}
          round={true}
          className="me-3"
        />

        <Avatar
          src="http://www.gravatar.com/avatar/a16a38cdfe8b2cbd38e8a56ab93238d3"
          size={defaultSize}
          round={true}
          className="me-3"
        />
        <Avatar
          src="https://lh3.googleusercontent.com/a/AGNmyxb2vAAhjrzczRacVeWFI5TCrbFmc4HpnAD-Zrp9Ow=s96-c"
          size={defaultSize}
          round={true}
          className="me-3"
        />
        <Person
          size={defaultSize}
          style={{ height: "64px" }}
          className="me-3"
        />
        <Person
          size={defaultSize}
          style={{ height: "64px" }}
          className="me-3"
        />
        <Person
          size={defaultSize}
          style={{ height: "64px" }}
          className="me-3"
        />
        <Person
          size={defaultSize}
          style={{ height: "64px" }}
          className="me-3"
        />
        <Person
          size={defaultSize}
          style={{ height: "64px" }}
          className="me-3"
        />
        <Person
          size={defaultSize}
          style={{ height: "64px" }}
          className="me-3"
        />
        <Person
          size={defaultSize}
          style={{ height: "64px" }}
          className="me-3"
        />
        <Person
          size={defaultSize}
          style={{ height: "64px" }}
          className="me-3"
        />
      </Container>
    </div>
  );
};

export default Following;
