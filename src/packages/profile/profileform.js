import React, { useState, useEffect } from "react";
import {
  Form,
  Row,
  Col,
  Spinner,
  InputGroup,
  Alert,
  Button,
} from "react-bootstrap";
import useUser from "../auth/context/useuser";
import UserPropertyForm from "./userpropertyform";
import useFileLoader from "../content/usefileloader";
import { combineUrlAndPath } from "../../functions/combineurlandpath";
import useToast from "../toasts/usetoast";
import CapturePhoto from "../photo/capturephoto";
import { Camera } from "react-bootstrap-icons";

function ProfileForm() {
  const { user, saveUser } = useUser();
  const [profile, setProfile] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCapturePhoto, setShowCapturePhoto] = useState(false);

  const { addToast } = useToast();

  const handleFileUploadSuccess = (response) => {
    const fileName = response.filename;
    const avatarUrl = combineUrlAndPath(process.env.REACT_APP_FILES, fileName);
    setProfile({ ...profile, avatar: avatarUrl });
    return fileName;
  };

  const handleFileUploadError = () => {
    console.error("File upload failed");
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
    if (user) {
      setProfile(user);
      setAvatarPreview(user.picture ? user.picture : null);
    }
  }, [user]);

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

  const base64ToFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleSave = async () => {
    setLoading(true);
    let avatarUrl = profile.avatar;

    console.log("Profile", profile);

    if (profile.avatar && typeof profile.avatar === "string" && profile.avatar.startsWith("data:image")) {
      const avatarFile = base64ToFile(profile.avatar, "avatar.jpg");
      const fileArray = [avatarFile];
      let file = await uploadFile(fileArray);
      console.log("File uploaded", file);
      avatarUrl = combineUrlAndPath(process.env.REACT_APP_FILES, file);
    } else if (isFileSelected) {
      const file = await uploadFile(fileInputRef.current.files);
      console.log("Image File uploaded", file);
      avatarUrl = combineUrlAndPath(process.env.REACT_APP_FILES, file);
    }
    console.log("Avatar URL", avatarUrl, );

    const updatedProfile = { ...profile, avatar: avatarUrl };
    saveUser(updatedProfile);
    addToast("Profile Updated", "Your profile has been updated", "success");

    setLoading(false);
  };

  const handleCapturePhoto = (dataUrl) => {
    setAvatarPreview(dataUrl);
    setProfile({ ...profile, avatar: dataUrl });
    setShowCapturePhoto(false);
  };

  const handleIdCapture = (id) => {
    console.log("Captured ID:", id);
  };

  if (!profile) {
    return null;
  }

  return (
    <Form>
      {!profile.firstname && (
        <Alert variant="info">
          Please fill in your profile details below, then use the save button at
          the bottom of the form to save your changes.
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
        </Col>
      </Row>
      <UserPropertyForm onSave={handleSave} />
      <CapturePhoto
        show={showCapturePhoto}
        onPhoto={handleCapturePhoto}
        onClose={() => setShowCapturePhoto(false)}
        onId={handleIdCapture}
        useRearCamera={false}
      />
    </Form>
  );
}

export default ProfileForm;
