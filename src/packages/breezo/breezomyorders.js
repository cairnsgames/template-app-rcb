import React, { useState, useEffect } from "react";
import { Table, Form, Row, Col, Button } from "react-bootstrap";
import { ArrowUp, ArrowDown, ArrowDownUp } from "react-bootstrap-icons";
import { useOrders } from "./context/useorders";

const BreezoMyOrders = () => {
  const { orders, fetchOrders } = useOrders();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderTypeFilter, setOrderTypeFilter] = useState("all");
  const [sinceFilter, setSinceFilter] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const hasLoyaltyInvoices = orders.some(
    (order) => order.order_details === "Loyalty Invoice"
  );

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ column }) => {
    if (sortColumn !== column) return <ArrowDownUp className="ms-1 text-muted" size={12} />;
    return sortOrder === "asc"
      ? <ArrowUp className="ms-1" size={12} />
      : <ArrowDown className="ms-1" size={12} />;
  };

  useEffect(() => {
    let updatedOrders = [...orders];

    if (statusFilter !== "all") {
      updatedOrders = updatedOrders.filter(
        (order) => order.status === statusFilter
      );
    }

    if (orderTypeFilter === "loyalty") {
      updatedOrders = updatedOrders.filter(
        (order) => order.order_details === "Loyalty Invoice"
      );
    } else if (orderTypeFilter === "cart") {
      updatedOrders = updatedOrders.filter(
        (order) => order.order_details === "Cart"
      );
    }

    if (sinceFilter) {
      const sinceDate = new Date(sinceFilter);
      updatedOrders = updatedOrders.filter(
        (order) => new Date(order.created) >= sinceDate
      );
    }

    if (sortColumn) {
      updatedOrders.sort((a, b) => {
        let valA = a[sortColumn];
        let valB = b[sortColumn];
        if (sortColumn === "created") {
          valA = new Date(valA);
          valB = new Date(valB);
        } else if (sortColumn === "total_price") {
          valA = Number(valA);
          valB = Number(valB);
        } else {
          valA = String(valA ?? "").toLowerCase();
          valB = String(valB ?? "").toLowerCase();
        }
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredOrders(updatedOrders);
  }, [orders, statusFilter, orderTypeFilter, sinceFilter, sortColumn, sortOrder]);

  const handleOrderClick = (order) => {
    if (order.status === "pending") {
      window.location.hash = `#payorder/${order.id}`;
    } else {
      window.location.hash = `#orders/${order.id}`;
    }
  };

  return (
    <div className="packagesBreezoMyOrders">
      <h2>Accounts</h2>
      <Row className="g-2 align-items-end mb-3">
        <Col xs={12} sm="auto">
          <Form.Group controlId="statusFilter">
            <Form.Label className="mb-1" style={{ fontSize: 12 }}>Status</Form.Label>
            <Form.Control
              as="select"
              size="sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </Form.Control>
          </Form.Group>
        </Col>
        {hasLoyaltyInvoices && (
          <Col xs={12} sm="auto">
            <Form.Group controlId="orderTypeFilter">
              <Form.Label className="mb-1" style={{ fontSize: 12 }}>Order Type</Form.Label>
              <Form.Control
                as="select"
                size="sm"
                value={orderTypeFilter}
                onChange={(e) => setOrderTypeFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="loyalty">Loyalty Invoices</option>
                <option value="cart">Purchases</option>
              </Form.Control>
            </Form.Group>
          </Col>
        )}
        <Col xs={12} sm="auto">
          <Form.Group controlId="sinceFilter">
            <Form.Label className="mb-1" style={{ fontSize: 12 }}>Since</Form.Label>
            <div className="d-flex gap-1">
              <Form.Control
                type="date"
                size="sm"
                value={sinceFilter}
                onChange={(e) => setSinceFilter(e.target.value)}
              />
              {sinceFilter && (
                <Button variant="outline-secondary" size="sm" onClick={() => setSinceFilter("")}>Clear</Button>
              )}
            </div>
          </Form.Group>
        </Col>
      </Row>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>Order # <SortIcon column="id" /></th>
            <th onClick={() => handleSort("created")} style={{ cursor: "pointer" }}>Date <SortIcon column="created" /></th>
            <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>Status <SortIcon column="status" /></th>
            <th onClick={() => handleSort("total_price")} style={{ cursor: "pointer" }}>Price <SortIcon column="total_price" /></th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders && filteredOrders.length > 0 && (
            <>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => handleOrderClick(order)}
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
