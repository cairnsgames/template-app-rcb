import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Spinner,
  InputGroup,
  CloseButton,
} from "react-bootstrap";
import { useNews } from "./newscontext";
import useFileLoader from "../content/usefileloader";
import "./mynewseditor.scss";
import { extractFileName } from "../../functions/extractfilename";
import Div from "../../components/react-bootstrap-mobile/div";

const MyNewsEditor = ({ id, onClose }) => {
  const { createNewsItem, updateNewsItem, myNewsItems, fetchMyNewsItems } =
    useNews();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState("");
  const [expires, setExpires] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Store the image URL
  const [hasChanges, setHasChanges] = useState(false); // Track if there are changes

  const handleEditorClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const canSave = !!title && !!body && !!date && !!expires;

  const handleFileUploadSuccess = (response) => {
    const fileName = response.filename;
    setImageUrl(`${process.env.REACT_APP_CONTENT_API}/uploads/${fileName}`);
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
    fetchMyNewsItems();
  }, []);

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
    };

    if (isFileSelected) {
      const fileName = await uploadFile(fileInputRef.current.files);
      newsItem.image_url = extractFileName(
        `${process.env.REACT_APP_CONTENT_API}/uploads/${fileName}`
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
        <h2>{id ? "Update News" : "Create News"}</h2>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
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
          <Form.Label>Body</Form.Label>
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
          <Form.Label>Image</Form.Label>
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

        <Form.Group controlId="date">
          <Form.Label>Date</Form.Label>
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
          <Form.Label>Expires</Form.Label>
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
            {id ? "Update News" : "Create News"}
          </Button>
        </div>

        {status && <div>{status}</div>}
      </Form>
    </Div>
  );
};

export default MyNewsEditor;
