import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { usePartnerRoles } from "./usepartnerroles";

const PartnerSignupModal = ({ show, handleClose }) => {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [bankDetails, setBankDetails] = useState({
    id: "",
    partner_id: "",
    bank_name: "",
    account_number: "",
    branch_code: "",
    payment_method: "",
    paypal_username: "",
  });
  const { roles, roleList, updatePartnerRoles, bankingDetails } = usePartnerRoles();

  useEffect(() => {
    setSelectedRoles(roles || []);
  }, [roles]);

  useEffect(() => {
    // Ensure bankingDetails is not null or undefined
    setBankDetails(bankingDetails || {
      id: "",
      partner_id: "",
      bank_name: "",
      account_number: "",
      branch_code: "",
      payment_method: "",
      paypal_username: "",
    });
  }, [bankingDetails]);

  const handleRoleChange = (role) => {
    if (hasRole(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r.role_id !== role.id));
    } else {
      setSelectedRoles([...selectedRoles, { role_id: role.id, name: role.name }]);
    }
  };

  const handlePaymentMethodChange = (method) => {
    setBankDetails((prevDetails) => ({
      ...prevDetails,
      payment_method: method,
      paypal_username: "",
      bank_name: "",
      account_number: "",
      branch_code: "",
    }));
  };

  const handleJoin = () => {
    updatePartnerRoles(selectedRoles, bankDetails);
    handleClose();
  };

  const hasRole = (role) => {
    return !!selectedRoles.find((r) => r.role_id === role.id);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Join Partner Program</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Select Your Role(s)</Form.Label>
            <Row>
              {roleList.map((role) => (
                <Col key={role.id} xs={6}>
                  <Form.Check
                    type="checkbox"
                    label={role.name}
                    value={role.id}
                    checked={hasRole(role)}
                    onChange={() => handleRoleChange(role)}
                  />
                </Col>
              ))}
            </Row>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Preferred Payment Method</Form.Label>
            <Form.Check
              type="radio"
              label="PayPal"
              value="paypal"
              checked={bankDetails.payment_method === "paypal"}
              onChange={() => handlePaymentMethodChange("paypal")}
            />
            <Form.Check
              type="radio"
              label="Bank Deposit"
              value="bank"
              checked={bankDetails.payment_method === "bank"}
              onChange={() => handlePaymentMethodChange("bank")}
            />
          </Form.Group>

          {bankDetails.payment_method === "paypal" && (
            <Form.Group className="mt-3">
              <Form.Label>PayPal Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your PayPal username"
                value={bankDetails.paypal_username}
                onChange={(e) =>
                  setBankDetails({ ...bankDetails, paypal_username: e.target.value })
                }
              />
            </Form.Group>
          )}

          {bankDetails.payment_method === "bank" && (
            <>
              <Form.Group className="mt-3">
                <Form.Label>Bank Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your Bank Name"
                  value={bankDetails.bank_name}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, bank_name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Account Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your Account Number"
                  value={bankDetails.account_number}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      account_number: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Branch Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your Branch Code"
                  value={bankDetails.branch_code}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      branch_code: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleJoin}>
          Join
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PartnerSignupModal;
