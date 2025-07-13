import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import TicketLines from "./ticketline";
import { Input } from "postcss";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <div className="border p-2 my-3">
      <h3>{t('pricingOptions.title')}</h3>
      <Form.Group controlId="hasTicketTypes">
        <InputGroup>
          <Form.Check
            type="checkbox"
            enabled={hasTicketTypes === "different" ? true : false}
            label={t('pricingOptions.withAdditionalOptions')}
            className="ms-3"
            value="options"
            checked={hasTicketOptions === "yes"}
            onChange={() =>
              setHasTicketOptions(hasTicketOptions === "yes" ? "no" : "yes")
            }
          />
          <Form.Text className="ms-3">
            {t('pricingOptions.additionalOptionsHint')}
          </Form.Text>
        </InputGroup>
      </Form.Group>

      {hasTicketTypes === "fixed" && (
        <Form.Group controlId="price">
          <InputGroup>
            <InputGroup.Text>{t('pricingOptions.price')}</InputGroup.Text>

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
          header={t('pricingOptions.typesOfTickets')}
          lines={tickets}
          setLines={setTickets}
          FormText={<>{t('pricingOptions.addTicketTypeHint')}</>}
        />
      )}
      {hasTicketOptions === "yes" && (
        <TicketLines
          header={t('pricingOptions.ticketOptions')}
          lines={ticketOptions}
          setLines={setTicketOptions}
          FormText={t('pricingOptions.addTicketOptionHint')}
        />
      )}
    </div>
  );
};

export default PricingOptions;
