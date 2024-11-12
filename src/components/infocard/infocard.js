import React from "react";
import { Card } from "react-bootstrap";

const InfoCard = ({ title, text, message, className, children }) => { // Accept className and children props
  const header = React.Children.toArray(children).find(child => child.type === InfoCard.Header) || title;
  const bodyText = React.Children.toArray(children).find(child => child.type === InfoCard.Body) || text;
  const messageContent = React.Children.toArray(children).find(child => child.type === InfoCard.Message) || message;

  return (
    <Card className={`text-center shadow-lg border-0 m-auto mt-5 mx-3 ${className ?? ""}`} style={{ maxWidth: '500px' }}>
      <Card.Header as="h1" className="mb-3">{header}</Card.Header>
      <Card.Body>
        <Card.Text className="lead">
          {bodyText}
        </Card.Text>
        <Card.Text>
          {messageContent}
        </Card.Text>
      </Card.Body>
      {React.Children.toArray(children).find(child => child.type === InfoCard.Footer)}
    </Card>
  );
};

InfoCard.Header = ({ children }) => <>{children}</>;
InfoCard.Body = ({ children }) => <>{children}</>;
InfoCard.Message = ({ children }) => <>{children}</>;
InfoCard.Footer = ({ children }) => <Card.Footer>{children}</Card.Footer>;

export default InfoCard;
