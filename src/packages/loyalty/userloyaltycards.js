import React, { useState } from "react";
import { useUserLoyalty } from "./userloyaltyprovider";
import { Tabs, Tab, Card, Collapse, ListGroup, Button } from "react-bootstrap";
import StampsCard from "./stampscard";

const UserLoyaltyCards = () => {
  const { cards, rewards, stamps, selectedCard, setSelectedCard } =
    useUserLoyalty();
  const [open, setOpen] = useState(false);

  const handleCardClick = (cardId) => {
    setSelectedCard(cardId);
  };

  return (
    <Tabs defaultActiveKey="home">
      <Tab eventKey="home" title="Home">
        <Card>
          <Card.Header>Loyalty Cards</Card.Header>
          <ListGroup variant="flush">
            {cards.map((card) => (
              <ListGroup.Item
                key={card.id}
                onClick={() => handleCardClick(card.id)}
              >
                Card ID: {card.id} - Stamps Collected: {card.stamps_collected}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>

        {selectedCard && (
          <Card>
            <Card.Header>Card Details</Card.Header>
            <ListGroup variant="flush">
              {cards
                .filter((card) => card.id === selectedCard)
                .map((card) => (
                  <ListGroup.Item key={card.id}>
                    Card ID: {card.id} - QR Code: {card.qr_code} - Stamps
                    Collected: {card.stamps_collected}
                  </ListGroup.Item>
                ))}
            </ListGroup>
            <StampsCard stamps={stamps} />
          </Card>
        )}
      </Tab>
      <Tab eventKey="profile" title="Rewards">
        <Card>
          <Card.Header>All Rewards</Card.Header>
          <ListGroup variant="flush">
            {rewards.map((reward) => (
              <ListGroup.Item key={reward.id}>
                {reward.reward_description} - Earned on: {reward.date_earned} -
                Redeemed on: {reward.date_redeemed}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      </Tab>
    </Tabs>
  );
};

export default UserLoyaltyCards;
