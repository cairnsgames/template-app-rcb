import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup, Row, Col, Spinner } from "react-bootstrap";
import { usePartnerRoles } from "./usepartnerroles";
import useUser from "../../../packages/auth/context/useuser";
import UserPropertyForm from "../../../packages/profile/userpropertyform";
import useFileLoader from "../../../packages/content/usefileloader";

import CapturePhoto from "../../../packages/photo/capturephoto";
import { Camera } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

const PartnerSignupModal = ({ show, handleClose }) => {
  const { t } = useTranslation();
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
    // Immediately save the updated avatar to the user profile
    saveUser({
      ...user,
      avatar: avatarUrl,
    });
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
    // Immediately save the captured photo as avatar
    saveUser({
      ...user,
      avatar: dataUrl,
    });
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
    console.log("PARTNER USER",user);
    setProfile({
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      avatar: user?.picture || user?.avatar || null,
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
        <Modal.Title>{t('partnerSignup.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="firstname">
                <Form.Label>{t('partnerSignup.firstNameLabel')}</Form.Label>
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
                <Form.Label>{t('partnerSignup.lastNameLabel')}</Form.Label>
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
            <Form.Label>{t('partnerSignup.selectRolesLabel')}</Form.Label>
            <Row>
              {roleList.map((role) => (
                <Col key={role.id} xs={6}>
                  <Form.Check
                    type="checkbox"
                    label={t(role.name)}
                    value={role.id}
                    checked={hasRole(role)}
                    onChange={() => handleRoleChange(role)}
                  />
                </Col>
              ))}
            </Row>
          </Form.Group>

          <Form.Group controlId="avatar">
            <Form.Label>{t('partnerSignup.avatarLabel')}</Form.Label>
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
            <Form.Label>{t('partnerSignup.preferredPaymentLabel')}</Form.Label>
            <Form.Check
              type="radio"
              label={t('partnerSignup.paypalLabel')}
              value="paypal"
              checked={bankDetails.payment_method === "paypal"}
              onChange={() => handlePaymentMethodChange("paypal")}
            />
            <Form.Check
              type="radio"
              label={t('partnerSignup.bankDepositLabel')}
              value="bank"
              checked={bankDetails.payment_method === "bank"}
              onChange={() => handlePaymentMethodChange("bank")}
            />
          </Form.Group>

          {bankDetails.payment_method === "paypal" && (
            <Form.Group className="mt-3">
              <Form.Label>{t('partnerSignup.paypalUsernameLabel')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('partnerSignup.paypalUsernameLabel')}
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
                <Form.Label>{t('partnerSignup.bankNameLabel')}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t('partnerSignup.bankNameLabel')}
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
                <Form.Label>{t('partnerSignup.accountNumberLabel')}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t('partnerSignup.accountNumberLabel')}
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
                <Form.Label>{t('partnerSignup.branchCodeLabel')}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t('partnerSignup.branchCodeLabel')}
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
          {t('partnerSignup.closeButton')}
        </Button>
        <Button variant="primary" onClick={handleJoin}>
          {t('partnerSignup.joinButton')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PartnerSignupModal;
