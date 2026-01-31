import React from "react";
import { Card } from "react-bootstrap";

const Partner = ({ item, index }) => {
  const handleActivate = () => {
    const id = item.user_id ?? item.id;
    if (id !== undefined && id !== null) {
      window.location.hash = `#partner/${id}`;
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActivate();
    }
  };

  return (
    <Card
      className="partner-card"
      key={item.user_id + "-" + index}
      onClick={handleActivate}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      style={{ cursor: "pointer" }}
    >
      <Card.Header>
        <h5>
          {item.firstname} {item.lastname}
        </h5>
      </Card.Header>
      <Card.Body>
        {item.avatar && (
          <div className="partner-avatar">
            <img
              src={item.avatar}
              alt={item.firstname + item.lastname || "Partner avatar"}
              style={{
                maxWidth: "100%",
                height: "auto",
                display: "block",
                marginBottom: 8,
              }}
            />
          </div>
        )}
        {Array.isArray(item.offerings) && item.offerings.length > 0 ? (
          <div>
            <strong>Offerings:</strong>{" "}
            {item.offerings
              .map((o) => (o && typeof o === "object" ? o.name : o))
              .filter(Boolean)
              .join(", ")}
          </div>
        ) : null}
      </Card.Body>
      {Array.isArray(item.roles) && item.roles.length > 0 ? (
        <Card.Footer>
          <strong>Roles:</strong>{" "}
          {item.roles
            .map((r) => (r && typeof r === "object" ? r.name : r))
            .filter(Boolean)
            .join(", ")}
        </Card.Footer>
      ) : (
        <Card.Footer>
          <strong>Roles:</strong> None
        </Card.Footer>
      )}

      <p>
        <strong>Distance:</strong>{" "}
        {item.distance ? `${item.distance.toFixed(1)} km` : "Unknown"}
      </p>
    </Card>
  );
};

export default Partner;
