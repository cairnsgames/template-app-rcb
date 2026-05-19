import React from "react";
import { Card } from "react-bootstrap";
import type { SearchResultUser } from "../search2.types";

type PartnerProps = {
  item: SearchResultUser;
  index: number;
};

const Partner: React.FC<PartnerProps> = ({ item, index }) => {
  const handleActivate = () => {
    const id = item.id;
    if (id !== undefined && id !== null) {
      window.location.hash = `#partner/${id}`;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActivate();
    }
  };

  const offeringsArray: string[] = Array.isArray(item.offerings)
    ? item.offerings
        .map((o) => (o && typeof o === "object" ? (o as { name: string }).name : String(o)))
        .filter(Boolean)
    : [];

  const rolesDisplay =
    typeof item.roles === "string"
      ? item.roles
      : Array.isArray(item.roles)
      ? item.roles
          .map((r) => (r && typeof r === "object" ? (r as { name: string }).name : String(r)))
          .filter(Boolean)
          .join(", ")
      : "None";

  const displayName =
    item.firstname || item.lastname
      ? `${item.firstname} ${item.lastname}`.trim()
      : item.name || item.username || "Unknown";

  return (
    <Card
      className="partner-card"
      key={item.id + "-" + index}
      onClick={handleActivate}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      style={{ cursor: "pointer" }}
    >
      <Card.Header>
        <h5>{displayName}</h5>
      </Card.Header>
      <Card.Body>
        {item.avatar && (
          <div className="partner-avatar">
            <img
              src={item.avatar}
              alt={`${displayName} avatar`}
              style={{
                maxWidth: "100%",
                height: "auto",
                display: "block",
                marginBottom: 8,
              }}
            />
          </div>
        )}
        {offeringsArray.length > 0 && (
          <div>
            <strong>Offerings:</strong> {offeringsArray.join(", ")}
          </div>
        )}
      </Card.Body>
      <Card.Footer>
        <strong>Roles:</strong> {rolesDisplay || "None"}
      </Card.Footer>
      {item.distance !== undefined && item.distance !== null && (
        <p style={{ padding: "0 1rem 0.5rem" }}>
          <strong>Distance:</strong> {item.distance.toFixed(1)} km
        </p>
      )}
    </Card>
  );
};

export default Partner;
