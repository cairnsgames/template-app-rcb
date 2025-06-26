import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import TicketLines from "./ticketline";
import { Input } from "postcss";

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
        {/* <Form.Label>Ticket Type</Form.Label>
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
            label="Different Ticket Types"
            name="hasTicketTypes"
            className="ms-3"
            value="different"
            checked={hasTicketTypes === "different"}
            onChange={() => setHasTicketTypes("different")}
          />
          <Form.Text className="ms-3">Press the add ticket type button [+] to add a new ticket. Examples of ticket types could be Full Day Pass, or Half Day Pass.</Form.Text>

        </InputGroup> */}
        <InputGroup>
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
          <Form.Text className="ms-3">
            If you have different options such as Dinner to be Included, or Buying a branded T-Shirt
            </Form.Text>
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
          FormText={<>Press the add ticket type button [+] to add a new ticket. Examples of ticket types could be Full Day Pass, or Half Day Pass.<br/>If you only have one ticket type, just add it as a single row.</>}
        />
      )}
      {hasTicketOptions === "yes" && (
        <TicketLines
          header="Ticket Options"
          lines={ticketOptions}
          setLines={setTicketOptions}
          FormText="Press the add ticket option button [+] to add a new option. Examples of options could be Dinner to be Included, or Buying a branded T-Shirt."
        />
      )}
    </div>
  );
};

export default PricingOptions;
