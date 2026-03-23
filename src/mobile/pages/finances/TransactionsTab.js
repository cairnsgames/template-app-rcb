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
              <th>Amount</th>
              <th>Tax</th>
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
                <td>{t.description}</td>
                <td>£{t.amount}</td>
                <td>£{t.tax || 0}</td>
                <td>£{t.net}</td>
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
              <div>Amount: £{t.amount}</div>
              <div>Tax: £{t.tax}</div>
              <div>Net: £{t.net}</div>
              <div>Date: {t.date}</div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </>
  );
}
