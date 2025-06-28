import React, { useEffect } from "react";
import { useOrders } from "./context/useorders";
import { Table } from "react-bootstrap";
import PageFull from "../../parts/pagelayouts/pagefull";

const BreezoMyOrderDetails = (props) => {
  const { setActiveOrderId, activeOrder, orderItems, loading } = useOrders();
  const { id } = props;

  useEffect(() => {
    setActiveOrderId(id);
  }, [id, setActiveOrderId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!activeOrder) {
    return <div>Order cannot be found.</div>;
  }

  return (
    <PageFull>
      <h2>Order Details</h2>
      <p><strong>Order ID:</strong> {activeOrder.id}</p>
      <p><strong>Status:</strong> {activeOrder.status}</p>
      <h3>Order Items</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Line Total</th>
          </tr>
        </thead>
        <tbody>
          {orderItems && orderItems.length > 0 ? (
            orderItems.map((item) => (
              <tr key={item.id}>
                <td>{item.item_description}</td>
                <td>R{item.price}</td>
                <td>{item.quantity}</td>
                <td>R{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No items found for this order.</td>
            </tr>
          )}
        </tbody>
      <tfoot>
        <tr>
          <td colSpan="3" style={{ textAlign: "right" }}><strong>Total:</strong></td>
          <td>R{orderItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</td>
        </tr>
      </tfoot>
      </Table>
    </PageFull  >
  );
};

export default BreezoMyOrderDetails;
