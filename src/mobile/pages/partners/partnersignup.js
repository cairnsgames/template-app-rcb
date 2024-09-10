import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { usePartnerRoles } from "./usepartnerroles";

const PartnerSignupModal = ({ show, handleClose }) => {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paypalUsername, setPaypalUsername] = useState("");
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNumber: "",
    branchCode: "",
  });
  const { roles, roleList, updatePartnerRoles } = usePartnerRoles();

  useEffect(() => {
    setSelectedRoles(roles);
    console.log("Roles", roles);
  }, [roles]);

  const handleRoleChange = (role) => {
    console.log("======= handleRoleChange", role, selectedRoles);
    if (hasRole(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r.role_id !== role.id));
    } else {
      setSelectedRoles([...selectedRoles, {role_id: role.id, name}]);
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setPaypalUsername("");
    setBankDetails({ bankName: "", accountNumber: "", branchCode: "" });
  };

  const handleJoin = () => {
    const partnerData = {
      payment_method: paymentMethod,
      paypal_username: paypalUsername,
      bank_name: bankDetails.bankName,
      account_number: bankDetails.accountNumber,
      branch_code: bankDetails.branchCode,
    };
    updatePartnerRoles(selectedRoles, partnerData);
  };

  const hasRole = (role) => {
    return !!selectedRoles.find(r => r.role_id === role.id)
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
              {roleList.map(
                (role) => (
                  <Col key={role.id} xs={6}>
                    <Form.Check
                      type="checkbox"
                      label={role.name}
                      value={role.id}
                      checked={hasRole(role)}
                      onChange={() => handleRoleChange(role)}
                    />
                  </Col>
                )
              )}
            </Row>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Preferred Payment Method</Form.Label>
            <Form.Check
              type="radio"
              label="PayPal"
              value="paypal"
              checked={paymentMethod === "paypal"}
              onChange={() => handlePaymentMethodChange("paypal")}
            />
            <Form.Check
              type="radio"
              label="Bank Deposit"
              value="bank"
              checked={paymentMethod === "bank"}
              onChange={() => handlePaymentMethodChange("bank")}
            />
          </Form.Group>

          {paymentMethod === "paypal" && (
            <Form.Group className="mt-3">
              <Form.Label>PayPal Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your PayPal username"
                value={paypalUsername}
                onChange={(e) => setPaypalUsername(e.target.value)}
              />
            </Form.Group>
          )}

          {paymentMethod === "bank" && (
            <>
              <Form.Group className="mt-3">
                <Form.Label>Bank Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your Bank Name"
                  value={bankDetails.bankName}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, bankName: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Account Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your Account Number"
                  value={bankDetails.accountNumber}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      accountNumber: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Branch Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your Branch Code"
                  value={bankDetails.branchCode}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      branchCode: e.target.value,
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
