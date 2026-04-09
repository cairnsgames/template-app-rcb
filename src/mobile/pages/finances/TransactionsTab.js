import React, { useContext } from "react";
import { ListGroup, Table, Spinner } from "react-bootstrap";
import { TxContext } from "./txContext";

export default function TransactionsTab() {
  const { transactions, loadingTransactions } = useContext(TxContext);

  if (loadingTransactions)
    return (
      <div className="text-center py-3">
        <Spinner animation="border" />
      </div>
    );

  if (!transactions || transactions.length === 0) return <div>No transactions yet.</div>;

  const fmt = (v) => Number(v || 0).toFixed(2);

  return (
    <>
      <div className="d-none d-md-block">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Reference</th>
              <th>Description</th>
              <th>Price</th>
              <th>Amount</th>
              <th>Tax</th>
              <th>Platform Fee</th>
              <th>Net</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id || t.reference}>
                <td>{t.id}</td>
                <td>{t.type}</td>
                <td>{t.reference}</td>
                <td>{t.transaction_description}</td>
                <td>R{fmt(t.transactionAmount)}</td>
                <td>R{fmt(t.grossAmount)}</td>
                <td>R{fmt(t.taxAmount)}</td>
                <td>R{fmt(t.platformFee)}</td>
                <td>R{fmt(t.netAmount)}</td>
                <td>{t.date}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="d-block d-md-none">
        <ListGroup>
          {transactions.map((t, i) => (
            <ListGroup.Item key={i}>
              <div>Price: R{fmt(t.transactionAmount)}</div>
              <div>Amount: R{fmt(t.grossAmount)}</div>
              <div>Tax: R{fmt(t.taxAmount)}</div>
              <div>Platform Fee: R{fmt(t.platformFee)}</div>
              <div>Net: R{fmt(t.netAmount)}</div>
              <div>Date: {t.date}</div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </>
  );
}
