import React, { useState, useEffect } from "react";
import { Form, Row, Col, Spinner, InputGroup, Alert } from "react-bootstrap";
import useUser from "../auth/context/useuser";
import UserPropertyForm from "./userpropertyform";
import useFileLoader from "../content/usefileloader";
import { combineUrlAndPath } from "../../functions/combineurlandpath";
import useToast from "../toasts/usetoast";

function ProfileForm() {
  const { user, saveUser } = useUser();
  const [profile, setProfile] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  useEffect(() => {
    console.log("=== Profile: User", user);
  }, [user]);

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
    if (user) {
      setProfile(user);
      setAvatarPreview(user.picture ? user.picture : null);
    }
  }, [user]);

  const handleFileUploadSuccess = (response) => {
    const fileName = response.filename;
    const avatarUrl = combineUrlAndPath(process.env.REACT_APP_FILES, fileName);
    setProfile({ ...profile, avatar: avatarUrl });
    return fileName;
  };

  const handleFileUploadError = () => {
    console.error("File upload failed");
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      fileSelected(e);
      setAvatarPreview(URL.createObjectURL(file));
      setProfile({ ...profile, avatar: file });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    let avatarUrl = profile.avatar;

    if (isFileSelected) {
      const file = await uploadFile(fileInputRef.current.files);

      avatarUrl = combineUrlAndPath(process.env.REACT_APP_FILES, file.filename);
    }
    const updatedProfile = { ...profile, avatar: avatarUrl };
    saveUser(updatedProfile);
    addToast("Profile Updated", "Your profile has been updated", "success");

    setLoading(false);
  };

  if (!profile) {
    return null;
  }

  return (
    <Form>
      {(!profile.firstname) && (
        <Alert variant="info">
          Please fill in your profile details below, then use the save button at the bottom of the form to save your changes.
        </Alert>
        )}
      <Row>
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
      <Row>
        <Col md={6}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={profile.email || ""}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="avatar">
            <Form.Label>Avatar</Form.Label>
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
        </Col>
      </Row>
      <UserPropertyForm onSave={handleSave} />
    </Form>
  );
}

export default ProfileForm;
