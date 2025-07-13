import React from "react";
import { Card, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const PartnerCard = () => {
  const { t } = useTranslation();

  return (
    <div className="tile-wrapper mb-4">
      <Card
        className="mb-3"
        style={{ backgroundColor: "purple", color: "white" }}
      >
        <Card.Header>
          <div className="text-center">
            <h3>{t("partnerCard.title")}</h3>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="fw-bold text-center" style={{ fontSize: "small" }}>
            {t("partnerCard.description")}
          </div>
        </Card.Body>
        <Card.Footer className="text-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => (window.location.href = "#partner")}
          >
            {t("partnerCard.button")}
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default PartnerCard;
