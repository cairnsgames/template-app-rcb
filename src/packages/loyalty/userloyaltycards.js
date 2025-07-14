import React, { useState } from "react";
import { useUserLoyalty } from "./context/userloyaltyprovider";
import { Tabs, Tab, Card, Collapse, ListGroup, Button } from "react-bootstrap";
import StampsCard from "./stampscard";
import { useTranslation } from "react-i18next";

const UserLoyaltyCards = () => {
  const { t } = useTranslation();

  const { cards, rewards, stamps, selectedCard, setSelectedCard } =
    useUserLoyalty();
  const [open, setOpen] = useState(false);

  const handleCardClick = (cardId) => {
    setSelectedCard(cardId);
  };

  return (
    <Tabs defaultActiveKey="home">
      <Tab eventKey="home" title={t("loyalty.loyaltyCards")}>
        <Card>
          <Card.Header>{t("loyalty.loyaltyCards")}</Card.Header>
          <ListGroup variant="flush">
            {cards.map((card) => (
              <ListGroup.Item
                key={card.id}
                onClick={() => handleCardClick(card.id)}
              >
                {t("loyalty.cardDetails")}: {card.id} -{" "}
                {t("loyalty.stampsCollected")}: {card.stamps_collected}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>

        {selectedCard && (
          <Card>
            <Card.Header>{t("loyalty.cardDetails")}</Card.Header>
            <ListGroup variant="flush">
              {cards
                .filter((card) => card.id === selectedCard)
                .map((card) => (
                  <ListGroup.Item key={card.id}>
                    {t("loyalty.cardDetails")}: {card.id} - {t("loyalty.qrCode")}:{" "}
                    {card.qr_code} -{" "}
                    {t("loyalty.stampsCollected")}: {card.stamps_collected}
                  </ListGroup.Item>
                ))}
            </ListGroup>
            <StampsCard stamps={stamps} />
          </Card>
        )}
      </Tab>
      <Tab eventKey="profile" title={t("loyalty.rewards")}>
        <Card>
          <Card.Header>{t("loyalty.allRewards")}</Card.Header>
          <ListGroup variant="flush">
            {rewards.map((reward) => (
              <ListGroup.Item key={reward.id}>
                {reward.reward_description} - {t("loyalty.earnedOn")}:{" "}
                {reward.date_earned} - {t("loyalty.redeemedOn")}:{" "}
                {reward.date_redeemed}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      </Tab>
    </Tabs>
  );
};

export default UserLoyaltyCards;
