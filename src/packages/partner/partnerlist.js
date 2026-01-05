import React, { useState, useMemo } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { usePartner } from "./context/partnercontext";
import TilesLayout from "../layout/Tiles";
import Tile from "../layout/Tile";
import PartnerFilterModal from "./PartnerFilterModal";
import Filter from "../../components/icons/filter";

const PartnerCard = ({ item, index }) => {
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
      key={(item.user_id ?? item.id) + "-" + index}
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

        {item.description || item.about ? (
          <div className="partner-description">
            {item.description || item.about}
          </div>
        ) : null}

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

      <p style={{ margin: 8 }}>
        <strong>Distance:</strong>{" "}
        {item.distance ? `${item.distance.toFixed(1)} km` : "Unknown"}
      </p>
    </Card>
  );
};

function PartnerList() {
  const { partners = [] } = usePartner() || {};
  const [nameFilter, setNameFilter] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);

  // Known partner role ids (kept in sync with SearchFilterModal.PARTNER_ROLES)
  const PARTNER_ROLE_IDS = [26, 27, 28, 29, 30];

  const toggleRole = (roleId) => {
    const current = Array.isArray(selectedRoles) ? [...selectedRoles] : [];
    const has = current.includes(roleId);

    if (roleId === "ALL_PARTNERS") {
      if (!has) {
        const next = Array.from(new Set(["ALL_PARTNERS", ...current, ...PARTNER_ROLE_IDS]));
        setSelectedRoles(next);
      } else {
        const next = current.filter((r) => r !== "ALL_PARTNERS" && !PARTNER_ROLE_IDS.includes(r));
        setSelectedRoles(next);
      }
      return;
    }

    if (!has) {
      const next = Array.from(new Set([...current, roleId]));
      const allPresent = PARTNER_ROLE_IDS.every((id) => next.includes(id));
      if (allPresent && !next.includes("ALL_PARTNERS")) next.push("ALL_PARTNERS");
      setSelectedRoles(next);
    } else {
      const next = current.filter((r) => r !== roleId && r !== "ALL_PARTNERS");
      setSelectedRoles(next);
    }
  };

  const normalized = (s) => (s || "").toString().toLowerCase();

  const filtered = useMemo(() => {
    const q = normalized(nameFilter).trim();
    const rolesSelected = Array.isArray(selectedRoles) && selectedRoles.length > 0;

    return (partners || [])
      .filter((p) => {
        // Role filtering: if roles selected, require overlap
        if (rolesSelected) {
          if (selectedRoles.includes("ALL_PARTNERS")) {
            // include all partners
          } else {
            const roles = Array.isArray(p.roles) ? p.roles : [];
            const roleIds = roles
              .map((r) => (r && typeof r === "object" ? r.id : Number(r)))
              .filter(Boolean);
            const overlap = selectedRoles.some((rid) => roleIds.includes(Number(rid)));
            if (!overlap) return false;
          }
        }

        // Text search: if no query, allow; otherwise match name OR description
        if (!q) return true;
        const nameText = `${p.firstname || ""} ${p.lastname || ""} ${p.company || ""}`.toLowerCase();
        const descText = (p.description || p.about || "").toString().toLowerCase();
        return nameText.includes(q) || descText.includes(q);
      })
      .sort((a, b) => {
        const distanceA = a.distance ?? Infinity;
        const distanceB = b.distance ?? Infinity;
        return distanceA - distanceB;
      });
  }, [partners, nameFilter, selectedRoles]);

  return (
    <div className="partner-list">
      <Row className="mb-3 align-items-center">
        <Col xs={8} sm={10} md={11} className="mb-2">
          <Form.Control
            type="search"
            placeholder="Filter by name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </Col>
        <Col xs={4} sm={2} md={1} className="text-right">
          <Button
            variant="outline-primary"
            onClick={() => setShowFilterModal(true)}
            title="Filters"
            style={{ float: "right" }}
          >
            <Filter />
          </Button>
        </Col>
      </Row>

      <PartnerFilterModal
        show={showFilterModal}
        onHide={() => setShowFilterModal(false)}
        selectedRoles={selectedRoles}
        toggleRole={toggleRole}
        clearFilters={() => setSelectedRoles([])}
      />

      <TilesLayout>
        {filtered.map((p, i) => (
          <Tile key={(p.user_id ?? p.id) + "-" + i}>
            <PartnerCard item={p} index={i} />
            <div className="text-muted small mb-3">
              This Partner is {p.distance ? `${p.distance.toFixed(1)}km` : "Unknown distance"} from you
            </div>
          </Tile>
        ))}
      </TilesLayout>
    </div>
  );
}

export default PartnerList;
