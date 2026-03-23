import React, { useContext } from "react";
import { Card, Form, Spinner } from "react-bootstrap";
import { TxContext } from "./txContext";

export default function DetailsTab() {
  const {
    vatOwed,
    vatNumber,
    setVatNumber,
    isVatRegistered,
    setIsVatRegistered,
    bankDetails,
    setBankDetails,
    loadingBalances,
  } = useContext(TxContext);

  function updateBank(field, value) {
    setBankDetails({ ...bankDetails, [field]: value });
  }

  if (loadingBalances)
    return (
      <div className="text-center py-3">
        <Spinner animation="border" />
      </div>
    );

  return (
    <div>
      <h4>Account Details</h4>
      <div className="mb-3">VAT owed: <strong>£{vatOwed}</strong></div>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>VAT registration</Form.Label>
          <Form.Check
            type="checkbox"
            label="I am not VAT registered"
            id="notVat"
            checked={!isVatRegistered}
            onChange={(e) => setIsVatRegistered(!e.target.checked)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            placeholder="VAT number"
            value={vatNumber}
            onChange={(e) => setVatNumber(e.target.value)}
            disabled={!isVatRegistered}
          />
        </Form.Group>

        <Card className="mb-3">
          <Card.Body>
            <Card.Title>Banking details</Card.Title>
            <Form.Group className="mb-2">
              <Form.Control
                placeholder="Account name"
                value={bankDetails.accountName}
                onChange={(e) => updateBank("accountName", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control
                placeholder="Account number"
                value={bankDetails.accountNumber}
                onChange={(e) => updateBank("accountNumber", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control
                placeholder="Bank name"
                value={bankDetails.bankName}
                onChange={(e) => updateBank("bankName", e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                placeholder="Sort code"
                value={bankDetails.sortCode}
                onChange={(e) => updateBank("sortCode", e.target.value)}
              />
            </Form.Group>
          </Card.Body>
        </Card>
      </Form>
    </div>
  );
}
