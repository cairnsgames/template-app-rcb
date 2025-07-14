import React, { useContext, useState, useEffect } from "react";
import { Form, Button, InputGroup, Spinner } from "react-bootstrap";
import { LoyaltyContext } from "./context/loyaltyprovider";
import useFileLoader from "../../packages/content/usefileloader";
import useTenant from "../tenant/context/usetenant";
import useUser from "../auth/context/useuser";
import { useToast } from "../../packages/toasts/usetoast";
import { combineUrlAndPath } from "../../functions/combineurlandpath";
import { useTranslation } from 'react-i18next';

const LoyaltySystemForm = () => {
  const { t } = useTranslation();
  const { createSystem, updateSystem, system } = useContext(LoyaltyContext);
  const { tenant } = useTenant();
  const { user, token } = useUser();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    app_id: "",
    venue_id: "",
    stamps_required: "10",
    name: "",
    description: "",
    reward_description: "",
    image: "",
  });

  const canSave =
    !!formData.name && !!formData.reward_description;

  useEffect(() => {
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


  const handleFileUploadSuccess = (response) => {
    const fileName = response.filename;
    setImageUrl(combineUrlAndPath(process.env.REACT_APP_FILES, fileName));
    return fileName;
  };

  const handleFileUploadError = (error) => {
    console.error("File upload failed");
    addToast("File upload error", error, "danger" );
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
  } = useFileLoader("LOYALTY", handleFileUploadSuccess, handleFileUploadError);

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
      await updateSystem(
        system.id,
        updatedFormData.name,
        updatedFormData.description,
        updatedFormData.image,
        updatedFormData.stampsRequired,
        updatedFormData.rewardDescription
      );
    } else {
      await createSystem(
        updatedFormData.name,
        updatedFormData.description,
        updatedFormData.image,
        updatedFormData.stampsRequired,
        updatedFormData.rewardDescription
      );
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formStartDate">
        <Form.Label>{t('loyalty.nameProgram')}</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <Form.Text>{t('loyalty.nameProgramHint')}</Form.Text>
      </Form.Group>

      <Form.Group controlId="formImage">
        <Form.Label>{t('loyalty.stampCardLogo')}</Form.Label>
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
        <Form.Text>{t('loyalty.stampCardLogoHint')}</Form.Text>
        {fileData || imageUrl ? (
          <img
            src={fileData || combineUrlAndPath(process.env.REACT_APP_FILES, imageUrl)}
            alt="Preview"
            className="img-preview"
          />
        ) : null}
      </Form.Group>

      <Form.Group>
        <Form.Label>{t('loyalty.stampsRequired')}</Form.Label>
        <Form.Control
          type="number"
          readOnly
          disabled
          name="stamps_required"
          value={formData.stamps_required}
          onChange={handleChange}
          placeholder={t('loyalty.stampsRequiredPlaceholder')}
        />
      </Form.Group>

      <Form.Group controlId="formEndDate">
        <Form.Label>{t('loyalty.reward')}</Form.Label>
        <Form.Control
          type="text"
          name="reward_description"
          value={formData.reward_description}
          onChange={handleChange}
        />
        <Form.Text>{t('loyalty.rewardHint')}</Form.Text>
      </Form.Group>

      <div className="py-3">
        <Button
          variant="primary"
          type="submit"
          disabled={!hasChanges || loading || !canSave}
        >
          {system ? t('loyalty.update') : t('loyalty.create')}
        </Button>
      </div>
      {status && <div>{status}</div>}
    </Form>
  );
};

export default LoyaltySystemForm;
