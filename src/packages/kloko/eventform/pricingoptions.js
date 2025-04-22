import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import TicketLines from "./ticketline";

const PricingOptions = ({
  hasTicketTypes,
  setHasTicketTypes,
  hasTicketOptions,
  setHasTicketOptions,
  currency,
  setCurrency,
  price,
  setPrice,
  tickets,
  setTickets,
  ticketOptions,
  setTicketOptions
}) => {
  return (
    <div className="border p-2 my-3">
      <h3>Pricing and Tickets</h3>
      <Form.Group controlId="hasTicketTypes">
        <Form.Label>Ticket Type</Form.Label>
        <InputGroup>
          <Form.Check
            type="radio"
            label="Fixed Price"
            name="hasTicketTypes"
            className="ms-3"
            value="fixed"
            checked={hasTicketTypes === "fixed"}
            onChange={() => setHasTicketTypes("fixed")}
          />
          <Form.Check
            type="radio"
            label="Different Tickets"
            name="hasTicketTypes"
            className="ms-3"
            value="different"
            checked={hasTicketTypes === "different"}
            onChange={() => setHasTicketTypes("different")}
          />

          <Form.Check
            type="checkbox"
            enabled={hasTicketTypes === "different" ? true : false}
            label="With additional options"
            className="ms-3"
            value="options"
            checked={hasTicketOptions === "yes"}
            onChange={() =>
              setHasTicketOptions(hasTicketOptions === "yes" ? "no" : "yes")
            }
          />
        </InputGroup>
      </Form.Group>

      {hasTicketTypes === "fixed" && (
        <Form.Group controlId="price">
          <InputGroup>
            <InputGroup.Text>Price</InputGroup.Text>

            <Form.Select
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value);
              }}
            >
              <option value="ZAR">ZAR</option>
              <option value="USD">USD</option>
            </Form.Select>
            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </InputGroup>
        </Form.Group>
      )}

      {hasTicketTypes === "different" && (
        <TicketLines
          header="Types of Tickets"
          lines={tickets}
          setLines={setTickets}
        />
      )}
      {hasTicketOptions === "yes" && (
        <TicketLines
          header="Ticket Options"
          lines={ticketOptions}
          setLines={setTicketOptions}
        />
      )}
    </div>
  );
};

export default PricingOptions;
