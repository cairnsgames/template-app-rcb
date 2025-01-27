import React, { useState, useContext, useEffect } from "react";
import { Form, Button, InputGroup, Spinner } from "react-bootstrap";
import useMyEvents from "./context/usemyevents";
import useFileLoader from "../content/usefileloader";
import { combineUrlAndPath } from "../../functions/combineurlandpath";
import { extractFileName } from "../../functions/extractfilename";
import { useToast } from "../toasts/usetoast";
import Div from "../../components/react-bootstrap-mobile/div";
import LocationSelect from "./LocationSelect";

const KlokoEventEditor = ({ id, onClose }) => {
  const {
    createEvent,
    updateEvent,
    fetchEventById, 
    loading,
  } = useMyEvents();
  const { addToast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("ZAR");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [keywords, setKeywords] = useState("");
  const [eventType, setEventType] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [startTime, setStartTime] = useState("");
  const [enableBookings, setEnableBookings] = useState(true);
  const [showInNews, setShowInNews] = useState(false);
  const [overlayText, setOverlayText] = useState(true);

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
    loading: fileLoading,
    fileSelected,
    uploadFile,
    isFileSelected,
  } = useFileLoader("EVENT", handleFileUploadSuccess, handleFileUploadError);

  useEffect(() => {
    if (id) {
      const eventToEdit = fetchEventById(id); // Fetch event data by ID
      if (eventToEdit) {
        console.log("Event to edit", eventToEdit);
        setTitle(eventToEdit.title);
        setDescription(eventToEdit.description);
        setCurrency(eventToEdit.currency);
        setPrice(eventToEdit.price);
        setImageUrl(eventToEdit.image_url);
        setKeywords(eventToEdit.keywords);
        setEventType(eventToEdit.event_type);
        setDuration(eventToEdit.duration);
        setLocation(eventToEdit.location);
        setMaxParticipants(eventToEdit.max_participants);
        setStartTime(eventToEdit.start_time);
        setOverlayText(eventToEdit.overlay_text === "Y");
        setEnableBookings(eventToEdit.enable_bookings === "Y");
        setShowInNews(eventToEdit.show_in_news === "Y");
      }
    }
  }, [id, fetchEventById]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endTime = new Date(
      new Date(startTime).getTime() + duration * 60000
    ).toISOString(); // Calculate end time
    const eventData = {
      title,
      description,
      currency,
      price,
      keywords: keywords,
      event_type: eventType,
      duration,
      location,
      max_participants: maxParticipants,
      start_time: startTime,
      end_time: endTime,
      enable_bookings: enableBookings ? "Y" : "N",
      show_in_news: showInNews ? "Y" : "N",
      overlay_text: overlayText ? "Y" : "N",
    };
    if (isFileSelected) {
      console.log("Uploading file...");
      const fileName = await uploadFile(fileInputRef.current.files);
      console.log("File Uploaded", fileName);
      eventData.image = extractFileName(
        combineUrlAndPath(process.env.REACT_APP_FILES, fileName)
      );
    }
    if (id) {
      await updateEvent({ id, ...eventData }); // Update event if ID is present
    } else {
      await createEvent(eventData); // Create event if no ID
    }
    // Reset form fields after submission
    setTitle("");
    setDescription("");
    setCurrency("ZAR");
    setPrice("");
    setImageUrl("");
    setEventType("");
    setDuration("");
    setLocation("");
    setMaxParticipants("");
    setStartTime("");
    setEnableBookings(true);
    setShowInNews(false);
    setOverlayText(true);
  };

  return (
    <Div onHide={onClose}>
      <Form onSubmit={handleSubmit}>
        <h2>{id ? "Edit Event" : "Create Event"}</h2>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <InputGroup>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="price">
          <Form.Label>Price</Form.Label>
          <InputGroup>
            <Form.Select
              className="form-control"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{ maxWidth: "25%" }}
            >
              <option value="ZAR">ZAR</option>
              <option value="USD">USD</option>
            </Form.Select>
            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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
                  }}
                />
              </>
            )}
          </InputGroup>
          {fileData || imageUrl ? (
            <img
              src={
                fileData ||
                combineUrlAndPath(process.env.REACT_APP_FILES, imageUrl)
              }
              alt="Preview"
              className="img-preview"
            />
          ) : null}
        </Form.Group>

        <Form.Group controlId="eventType">
          <Form.Label>Event Type</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="duration">
          <Form.Label>Duration</Form.Label>
          <InputGroup>
            <Form.Control
              as="select"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            >
              <option value="">Select Duration</option>
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
              <option value="120">120 minutes</option>
            </Form.Control>
            <Form.Control
              type="number"
              placeholder="Custom Duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="location">
          <Form.Label>Location</Form.Label>
          <LocationSelect onChange={setLocation} />
        </Form.Group>

        <Form.Group controlId="maxParticipants">
          <Form.Label>Max Participants</Form.Label>
          <InputGroup>
            <Form.Control
              type="number"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="startTime">
          <Form.Label>Start Time</Form.Label>
          <InputGroup>
            <Form.Control
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="enableBookings">
          <Form.Check
            type="checkbox"
            label="Enable Bookings"
            checked={enableBookings}
            onChange={(e) => setEnableBookings(e.target.checked)}
          />
        </Form.Group>

        <Form.Group controlId="showInNews">
          <Form.Check
            type="checkbox"
            label="Show in News"
            checked={showInNews}
            onChange={(e) => setShowInNews(e.target.checked)}
          />
        </Form.Group>

        <Form.Group controlId="overlayText">
          <Form.Check
            type="checkbox"
            label="Overlay Text"
            checked={overlayText}
            onChange={(e) => setOverlayText(e.target.checked)}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          disabled={loading || fileLoading}
        >
          {loading || fileLoading ? (
            <Spinner animation="border" size="sm" />
          ) : id ? (
            "Update Event"
          ) : (
            "Create Event"
          )}
        </Button>
      </Form>
    </Div>
  );
};

export default KlokoEventEditor;
