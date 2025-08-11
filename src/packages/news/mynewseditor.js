import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Spinner,
  InputGroup,
  CloseButton,
} from "react-bootstrap";
import { useNews } from "./context/newscontext";
import useFileLoader from "../content/usefileloader";
import "./mynewseditor.scss";
import { extractFileName } from "../../functions/extractfilename";
import Div from "../../components/react-bootstrap-mobile/div";
import { useToast } from "../toasts/usetoast";
import { combineUrlAndPath } from "../../functions/combineurlandpath";
import { useTranslation } from 'react-i18next';

const MyNewsEditor = ({ id, onClose }) => {
  const { t } = useTranslation();
  const { createNewsItem, updateNewsItem, myNewsItems, fetchMyNewsItems } =
    useNews();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    const futureDate = new Date(today);
    return futureDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  });

  const [expires, setExpires] = useState(() => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 14); // Add 2 weeks (14 days)
    return futureDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  });
  const [imageUrl, setImageUrl] = useState("");
  const [overlayText, setOverlayText] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const { addToast } = useToast();

  const handleEditorClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const canSave = !!title && !!body && !!date && !!expires;

  const handleFileUploadSuccess = (response) => {
    const fileName = response.filename;
    setImageUrl(combineUrlAndPath(process.env.REACT_APP_FILES, `${fileName}`));
    addToast("File upload", "success", "success");
    return fileName;
  };

  const handleFileUploadError = () => {
    console.error("File upload failed");
    addToast("File upload", "failed", "danger");
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
  } = useFileLoader("NEWS", handleFileUploadSuccess, handleFileUploadError);

  useEffect(() => {
    if (id) {
      const newsItem = myNewsItems.find((item) => item.id === Number(id));
      if (newsItem) {
        setTitle(newsItem.title);
        setBody(newsItem.body);
        setDate(newsItem.date.split(" ")[0]); // Extract the date part
        setExpires(newsItem.expires.split(" ")[0]); // Extract the date part
        setImageUrl(newsItem.image_url); // Set initial image URL
      }
    }
  }, [id, myNewsItems]);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setHasChanges(true); // Mark as changed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = `${date} 00:00:00`; // Append time to date
    const formattedExpires = `${expires} 00:00:00`; // Append time to expires
    const newsItem = {
      title,
      body,
      date: formattedDate,
      expires: formattedExpires,
      image_url: imageUrl,
      overlay_text: overlayText ? "Y" : "N",
    };

    if (isFileSelected) {
      const fileName = await uploadFile(fileInputRef.current.files);
      newsItem.image_url = extractFileName(
        combineUrlAndPath(process.env.REACT_APP_FILES, fileName)
      );
    }

    if (id) {
      await updateNewsItem(id, newsItem);
      handleEditorClose();
    } else {
      await createNewsItem(newsItem);
      handleEditorClose();
    }
  };

  return (
    <Div onHide={onClose}>
      <Form onSubmit={handleSubmit}>
        <h2>{id ? t('news.updateNews') : t('news.createNews')}</h2>
        <Form.Group controlId="title">
          <Form.Label>{t('news.title')}</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              value={title}
              onChange={handleInputChange(setTitle)}
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="body">
          <Form.Label>{t('news.body')}</Form.Label>
          <InputGroup>
            <Form.Control
              as="textarea"
              rows={3}
              value={body}
              onChange={handleInputChange(setBody)}
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="image">
          <Form.Label>{t('news.image')}</Form.Label>
          <InputGroup>
            {loading ? (
              <Spinner animation="border" />
            ) : (
              <Form.Control
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  fileSelected(e);
                  setHasChanges(true); // Mark as changed
                }}
              />
            )}
          </InputGroup>
          {fileData || imageUrl ? (
            <img
              src={
                fileData ||
                combineUrlAndPath(process.env.REACT_APP_FILES, imageUrl)
              }
              alt={t('news.preview')}
              className="img-preview"
            />
          ) : null}
        </Form.Group>

        <Form.Group controlId="overlayText">
          <Form.Check
            type="checkbox"
            label={t('news.showOverlayText')}
            checked={overlayText}
            onChange={(e) => {
              setOverlayText(e.target.checked);
              setHasChanges(true);
            }}
          />
        </Form.Group>

        <Form.Group controlId="date">
          <Form.Label>{t('news.displayFrom')}</Form.Label>
          <InputGroup>
            <Form.Control
              type="date"
              value={date}
              onChange={handleInputChange(setDate)}
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="expires">
          <Form.Label>{t('news.expires')}</Form.Label>
          <InputGroup>
            <Form.Control
              type="date"
              value={expires}
              onChange={handleInputChange(setExpires)}
              required
            />
          </InputGroup>
        </Form.Group>

        <div className="p-3">
          <Button
            variant="primary"
            type="submit"
            disabled={!hasChanges || loading || !canSave}
          >
            {id ? t('news.updateNews') : t('news.createNews')}
          </Button>
        </div>

        {status && <div>{status}</div>}
      </Form>
    </Div>
  );
};

export default MyNewsEditor;
