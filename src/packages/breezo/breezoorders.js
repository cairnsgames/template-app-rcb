import React, { useState, useEffect } from "react";
import { Button, Modal, ListGroup, Badge } from "react-bootstrap";
import { CartFill, CashStack } from "react-bootstrap-icons";
import useOrders from "./context/useorders";
import useUser from "../auth/context/useuser";

const BreezoOrders = (props) => {
  const { orders, fetchOrders, setActiveOrderId, loading } = useOrders();
  const [show, setShow] = useState(false);
  const [pendingOrders, setPendingOrders] = useState([]);
  const { user } = useUser();

  // Filter for pending orders
  useEffect(() => {
    if (!loading) {
      setPendingOrders(orders.filter((order) => order.status === "pending"));
    }
  }, [orders, loading]);
  
  if (!user) {
    return null;
  }
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const selectOrder = (id) => {
    setActiveOrderId(id);
    window.location.href = `#payorder/${id}`;
    handleClose();
  }

  if (pendingOrders.length < 1) {
    return null;
  }

  return (
    <div className={`d-inline ${props.className}`} style={props.style}>
      <Button
        variant="primary"
        onClick={handleShow}
        className="position-relative me-1 p-2"
      >
        <CashStack size={24} />
        <Badge
          pill
          bg="info"
          className="position-absolute top-25 start-75 translate-middle"
          style={{ fontSize: "12px" }}
        >
          {pendingOrders.length}
          <span className="visually-hidden">pending orders</span>
        </Badge>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Pending Orders</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pendingOrders.length > 0 ? (
            <ListGroup>
              {pendingOrders.map((order) => (
                <ListGroup.Item key={order.id} onClick={()=>{selectOrder(order.id)}}>
                  <div>
                    <strong>Details:</strong> {order.order_details || "N/A"}
                  </div>
                  {order.order_month && (
                    <div>
                      <strong>Month:</strong>{" "}
                      {order.order_month || "Not Specified"}
                    </div>
                  )}
                  <div>
                    <strong>Total Price:</strong> R
                    {Number(order.total_price).toFixed(2)}
                  </div>
                  <Button>Pay Now</Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>No pending orders.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BreezoOrders;
