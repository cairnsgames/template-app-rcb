import React, { useContext, useState } from "react";
import { Card, Form, InputGroup, Button, ListGroup, Collapse, Spinner } from "react-bootstrap";
import { TxContext } from "./txContext";

export default function PayoutsTab() {
  const { balance, payouts, requestPayout, loadingPayouts, requestingPayout } = useContext(TxContext);
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  if (loadingPayouts)
    return (
      <div className="text-center py-3">
        <Spinner animation="border" />
      </div>
    );

  return (
    <div>
      <h4>Payouts</h4>

      <Form>
        <Form.Group className="mb-3">
          <InputGroup>
            <Form.Control
              placeholder="Amount"
              value={amount}
              onChange={(e) => {
                setError("");
                setAmount(e.target.value);
              }}
            />
            <Button
              variant="primary"
              disabled={requestingPayout}
              onClick={async () => {
                const amt = Number(amount) || 0;
                if (amt <= 0) {
                  setError("Enter a valid amount");
                  return;
                }
                if (amt > Number(balance)) {
                  setError("Amount cannot be greater than balance");
                  return;
                }
                try {
                  await requestPayout("user", amt);
                  setAmount("");
                } catch (err) {
                  setError(err.message || "Request failed");
                }
              }}
            >
              {requestingPayout ? "Requesting..." : "Request"}
            </Button>
          </InputGroup>
          {error && <div className="text-danger mt-2">{error}</div>}
        </Form.Group>
      </Form>

      <div>
        <Button
          variant="link"
          onClick={() => setOpen(!open)}
          aria-controls="previous-payouts"
          aria-expanded={open}
        >
          {open ? "Hide" : "Show"} previous payouts
        </Button>
        <Collapse in={open}>
          <div id="previous-payouts">
            <Card className="mt-2 p-2">
              {payouts.length === 0 ? (
                <div>No previous payouts.</div>
              ) : (
                <ListGroup>
                  {payouts.map((p, i) => (
                    <ListGroup.Item key={i}>
                      <div>Amount: £{p.amount}</div>
                      <div>Date: {p.date}</div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card>
          </div>
        </Collapse>
      </div>
    </div>
  );
}
