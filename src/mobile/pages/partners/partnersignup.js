import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup, Row, Col } from "react-bootstrap";
import { usePartnerRoles } from "./usepartnerroles";
import useUser from "../../../packages/auth/context/useuser";
import UserPropertyForm from "../../../packages/profile/userpropertyform";
import useFileLoader from "../../../packages/content/usefileloader";

import CapturePhoto from "../../../packages/photo/capturephoto";
import { Camera } from "react-bootstrap-icons";

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

  const [profile, setProfile] = useState({});
  const { roles, roleList, updatePartnerRoles, bankingDetails } =
    usePartnerRoles();
  const { user, saveUser } = useUser();

  const [avatarPreview, setAvatarPreview] = useState(null);

  const [showCapturePhoto, setShowCapturePhoto] = useState(false);
  const handleFileUploadSuccess = (response) => {
    const fileName = response.filename;
    const avatarUrl = combineUrlAndPath(process.env.REACT_APP_FILES, fileName);
    setProfile({ ...profile, avatar: avatarUrl });
    return fileName;
  };
  const handleFileUploadError = () => {
    console.error("File upload failed");
  };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      fileSelected(e);
      setAvatarPreview(URL.createObjectURL(file));
      setProfile({ ...profile, avatar: file });
    }
  };
    const handleCapturePhoto = (dataUrl) => {
    setAvatarPreview(dataUrl);
    setProfile({ ...profile, avatar: dataUrl });
    setShowCapturePhoto(false);
  };

  const {
    fileInputRef,
    loading: fileLoading,
    fileSelected,
    uploadFile,
    isFileSelected,
  } = useFileLoader(
    "USER_AVATAR",
    handleFileUploadSuccess,
    handleFileUploadError
  );

  useEffect(() => {
    setProfile({
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
    });
  }, [user]);

  useEffect(() => {
    setSelectedRoles(roles || []);
  }, [roles]);

  useEffect(() => {
    // Ensure bankingDetails is not null or undefined
    setBankDetails(
      bankingDetails || {
        id: "",
        partner_id: "",
        bank_name: "",
        account_number: "",
        branch_code: "",
        payment_method: "",
        paypal_username: "",
      }
    );
  }, [bankingDetails]);

  const handleRoleChange = (role) => {
    if (hasRole(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r.role_id !== role.id));
    } else {
      setSelectedRoles([
        ...selectedRoles,
        { role_id: role.id, name: role.name },
      ]);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleJoin = () => {
    updatePartnerRoles(selectedRoles, bankDetails);
    saveUser({
      ...user,
      firstname: profile.firstname,
      lastname: profile.lastname,
    });
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
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="firstname">
                <Form.Label>First Name / Venue Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstname"
                  value={profile.firstname || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="lastname">
                <Form.Label>Last Name (optional)</Form.Label>
                <Form.Control
                  type="text"
                  name="lastname"
                  value={profile.lastname || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
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

          <Form.Group controlId="avatar">
            <Form.Label>Avatar (optional)</Form.Label>
            <InputGroup>
              {fileLoading ? (
                <Spinner animation="border" />
              ) : (
                <Form.Control
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  ref={fileInputRef}
                />
              )}

              <Button
                variant="primary"
                onClick={() => setShowCapturePhoto(true)}
              >
                <Camera />
              </Button>
            </InputGroup>
            <div
              style={{
                border: "1px solid #ccc",
                padding: "5px",
                marginTop: "5px",
                height: "100px",
                width: "100px",
              }}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="img-preview mt-2"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              ) : profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Avatar Preview"
                  className="img-preview mt-2"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              ) : null}
            </div>
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
                  setBankDetails({
                    ...bankDetails,
                    paypal_username: e.target.value,
                  })
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
                    setBankDetails({
                      ...bankDetails,
                      bank_name: e.target.value,
                    })
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
        <UserPropertyForm width={12} onSave={() => {}} />
        <CapturePhoto
          show={showCapturePhoto}
          onPhoto={handleCapturePhoto}
          onClose={() => setShowCapturePhoto(false)}
          useRearCamera={false}
          optionalLabel={false}
        />
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
