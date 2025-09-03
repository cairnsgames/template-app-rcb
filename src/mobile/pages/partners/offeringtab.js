import { Spinner } from "react-bootstrap";
import { useOfferings } from "./offeringscontext";
import { Form, Row, Col } from "react-bootstrap";

const OfferingItem = ({ item, active, onChange }) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(item, e.target.checked);
    }
  };

  return (
    <Form.Check
      type="checkbox"
      label={item.name}
      onChange={handleChange}
      id={`offering-item-${item.id}`}
      checked={!!active}
    />
  );
};

const OfferingTab = ({ role }) => {
  const { offeringsForRole, activeOffering, toggleOffering } = useOfferings();
  const offerings = offeringsForRole(role.id);

  console.log(`Offerings for ${role.name}:`, offerings);

  if (!offerings || offerings.length === 0) {
    return <Spinner animation="border" />;
  }

  const offeringToggle = (itemId) => {
    toggleOffering(itemId);
  };

  // Only 1 collection so only show internals
  if (offerings.length === 1) {
    return (
      <div>
        {offerings[0].items.map((item) => (
          <OfferingItem key={item.id} item={item} active={activeOffering(item.id)} onChange={() => offeringToggle(item.id)} />
        ))}
      </div>
    );
  }

  // Group offerings with ids 3,4,7 together
  const groupedIds = [3, 4, 7];
  const groupedOfferings = offerings.filter(o => groupedIds.includes(o.group_id));
  const otherOfferings = offerings.filter(o => !groupedIds.includes(o.group_id));


  return (
    <div>
      <Row>
        {otherOfferings.map((offering) => (
          <Col key={offering.id}>
            <div>
              <h3>{offering.group_name}</h3>
              {offering.items.map((item) => (
                <OfferingItem key={item.id} item={item} active={activeOffering(item.id)} onChange={() => offeringToggle(item.id)} />
              ))}
            </div>
          </Col>
        ))}
        
        {groupedOfferings.length > 0 && (
          <Col>
            {groupedOfferings.map((offering) => (
              <div key={offering.id} className="mb-5">
                <h3>{offering.group_name}</h3>
                {offering.items.map((item) => (
                  <OfferingItem key={item.id} item={item} active={activeOffering(item.id)} onChange={() => offeringToggle(item.id)} />
                ))}
              </div>
            ))}
          </Col>
        )}
      </Row>
    </div>
  );
};

export default OfferingTab;
