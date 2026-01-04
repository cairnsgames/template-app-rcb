import React, { useState, useEffect } from "react";
import { Table, Button, Form, InputGroup } from "react-bootstrap";
import { useOrders } from "./context/useorders";

const BreezoMyOrders = () => {
  const { orders, fetchOrders } = useOrders();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    let updatedOrders = [...orders];

    if (statusFilter !== "all") {
      updatedOrders = updatedOrders.filter(
        (order) => order.status === statusFilter
      );
    }

    if (sortOrder === "asc") {
      updatedOrders.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      updatedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    setFilteredOrders(updatedOrders);
  }, [orders, statusFilter, sortOrder]);

  const handleOrderClick = (id) => {
    window.location.hash = `#orders/${id}`;
  };

  return (
    <div>
      <h2>Accounts</h2>
      <InputGroup>
        <InputGroup.Text>Filter by Status</InputGroup.Text>
        <Form.Control
          as="select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </Form.Control>
      </InputGroup>
      <InputGroup>
        <InputGroup.Text>Sort by Date</InputGroup.Text>
        <Form.Control
          as="select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </Form.Control>
      </InputGroup>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Date</th>
            <th>Status</th>
            <th>Price</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders && filteredOrders.length > 0 && (
            <>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => handleOrderClick(order.id)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{order.id}</td>
                  <td>{new Date(order.created).toLocaleDateString()}</td>
                  <td style={{textTransform:"capitalize"}}>{order.status}</td>
                  <td>R {Number(order.total_price).toFixed(2)}</td>
                  <td>{order.order_details}</td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default BreezoMyOrders;
