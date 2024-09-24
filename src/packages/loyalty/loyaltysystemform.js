import React, { useContext, useState, useEffect } from "react";
import { Form, Button, InputGroup, Spinner } from "react-bootstrap";
import { LoyaltyContext } from "./loyaltyprovider";
import useFileLoader from "../../packages/content/usefileloader";
import useTenant from "../tenant/context/usetenant";
import useUser from "../auth/context/useuser";

const LoyaltySystemForm = () => {
  const { createSystem, updateSystem, system } = useContext(LoyaltyContext);
  const { tenant } = useTenant();
  const { user, token } = useUser();

  const [formData, setFormData] = useState({
    app_id: "",
    venue_id: "",
    stamps_required: "10",
    name: "",
    description: "",
    reward_description: "",
    image: "",
  });

  useEffect(() => {
    console.log("---- teant, user", tenant, user);
    const data = formData;
    if (tenant) {
      data.app_id = tenant;
    }
    if (user) {
      data.venue_id = user.id;
    }
    setFormData(data);
  }, [tenant, user]);

  const [imageUrl, setImageUrl] = useState(""); // Store the image URL
  const [hasChanges, setHasChanges] = useState(false); // Track if there are changes

  useEffect(() => {
    console.log("--- formData", formData);
  }, [formData]);

  const handleFileUploadSuccess = (response) => {
    const fileName = response.filename;
    setImageUrl(`${process.env.REACT_APP_CONTENT_API}/uploads/${fileName}`);
    return fileName;
  };

  const handleFileUploadError = () => {
    console.error("File upload failed");
  };

  const {
    fileData,
    fileInputRef,
    status,
    percent,
    loading,
    fileSelected,
    uploadFile,
    isFileSelected,
  } = useFileLoader(
    "LOYALTY_SYSTEM",
    handleFileUploadSuccess,
    handleFileUploadError
  );

  useEffect(() => {
    if (system) {
      setFormData({
        app_id: system.app_id || "",
        venue_id: system.venue_id || "",
        stamps_required: system.stamps_required || "",
        name: system.name || "",
        description: system.description || "",
      });
      setImageUrl(system.image || "");
    }
  }, [system]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setHasChanges(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = { ...formData };

    if (isFileSelected) {
      const fileName = await uploadFile(fileInputRef.current.files);
      updatedFormData.image = fileName;
    } else {
      updatedFormData.image = imageUrl;
    }

    if (system) {
      await updateSystem(system.id, updatedFormData.name, updatedFormData.description, updatedFormData.image, updatedFormData.stampsRequired, updatedFormData.rewardDescription);
    } else {
      await createSystem(updatedFormData.name, updatedFormData.description, updatedFormData.image, updatedFormData.stampsRequired, updatedFormData.rewardDescription);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formStartDate">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formImage">
        <Form.Label>Stamp Card Logo</Form.Label>
        <InputGroup>
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <>
              <Form.Control
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  fileSelected(e);
                  setHasChanges(true); // Mark as changed
                }}
              />
            </>
          )}
        </InputGroup>
        {fileData || imageUrl ? (
          <img
            src={fileData || `http://localhost/files/${imageUrl}`}
            alt="Preview"
            className="img-preview"
          />
        ) : null}
      </Form.Group>

      <Form.Group>
        <Form.Label>Stamps Required</Form.Label>
        <Form.Control
          type="number"
          name="stamps_required"
          value={formData.stamps_required}
          onChange={handleChange}
          placeholder="Enter Stamps Required"
        />
      </Form.Group>

      <Form.Group controlId="formEndDate">
        <Form.Label>Reward</Form.Label>
        <Form.Control
          type="text"
          name="reward_description"
          value={formData.reward_description}
          onChange={handleChange}
        />
      </Form.Group>

      <div className="py-3">
        <Button
          variant="primary"
          type="submit"
          disabled={!hasChanges || loading}
        >
          {system ? "Update" : "Create"}
        </Button>
      </div>
      {status && <div>{status}</div>}
    </Form>
  );
};

export default LoyaltySystemForm;
