import React, { useState, useEffect } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import useMyEvents from "./context/usemyevents";
import useFileLoader from "../content/usefileloader";
import { combineUrlAndPath } from "../../functions/combineurlandpath";
import { extractFileName } from "../../functions/extractfilename";
import { useToast } from "../toasts/usetoast";
import Div from "../../components/react-bootstrap-mobile/div";

// Import form components
import EventDetails from "./eventform/eventdetails";
import CoverImage from "./eventform/coverimage";
import DateAndDuration from "./eventform/dateandduration";
import PricingOptions from "./eventform/pricingoptions";
import LocationSection from "./eventform/locationsection";
import DisplaySettings from "./eventform/displaysettings";

const KlokoEventEditor = ({ id, onClose }) => {
  const { createEvent, updateEvent, fetchEventById, loading } = useMyEvents();
  const { addToast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("ZAR");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [keywords, setKeywords] = useState("");
  const [eventType, setEventType] = useState("event");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    now.setMinutes(0, 0, 0); // Reset minutes and seconds to 0
    now.setHours(now.getHours() + 1); // Set to the start of the next hour
    return now.toISOString().slice(0, 16); // Format as "YYYY-MM-DDTHH:mm"
  });
  const [endTime, setEndTime] = useState("");
  const [enableBookings, setEnableBookings] = useState(true);
  const [showInNews, setShowInNews] = useState(false);
  const [overlayText, setOverlayText] = useState(true);
  const [durationType, setDurationType] = useState("duration");
  const [hasTicketTypes, setHasTicketTypes] = useState("fixed");
  const [tickets, setTickets] = useState([]);
  const [hasTicketOptions, setHasTicketOptions] = useState("no");
  const [ticketOptions, setTicketOptions] = useState([]);
  const [latlng, setLatlng] = useState({ lat: 0, lng: 0 });

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

  useEffect(() => {
    if (startTime && duration) {
      const endTimeDate = new Date(new Date(startTime).getTime() + duration * 60 * 1000);
      const formattedEndTime = endTimeDate.toISOString().slice(0, 16); // Format as "YYYY-MM-DDTHH:mm"
      setEndTime(formattedEndTime);
    }
  }, [startTime, duration]);

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
        setStartTime(eventToEdit.start_time);
        setEndTime(eventToEdit.end_time);
        setCurrency(eventToEdit.currency);
        setPrice(eventToEdit.price);
        setImageUrl(eventToEdit.image_url);
        setKeywords(eventToEdit.keywords);
        setEventType(eventToEdit.event_type);
        setDuration(eventToEdit.duration);
        setLocation(eventToEdit.location);
        setMaxParticipants(eventToEdit.max_participants);
        setOverlayText(eventToEdit.overlay_text === "Y");
        setEnableBookings(eventToEdit.enable_bookings === "Y");
        setShowInNews(eventToEdit.show_in_news === "Y");
      }
    }
  }, [id, fetchEventById]);

  const selectLocation = (location) => {
    setLatlng({ lat: location.lat, lng: location.lng });
    setLocation(location);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      await updateEvent({ id, ...eventData, tickets, ticketOptions }); // Update event if ID is present
    } else {
      await createEvent(eventData, tickets, ticketOptions); // Create event if no ID
    }
    // Reset form fields after submission
    setTitle("");
    setDescription("");
    setCurrency("ZAR");
    setPrice("");
    setImageUrl("");
    setEventType("event");
    setDuration("");
    setLocation("");
    setMaxParticipants("");
    setStartTime("");
    setEnableBookings(true);
    setShowInNews(false);
    setOverlayText(true);
  };

  useEffect(() => {
    console.log("LOCATION", location)
  }, [location]);

  return (
    <Div onHide={onClose}>
      <Form onSubmit={handleSubmit}>
        <h2>{id ? "Edit Event" : "Create Event"}</h2>

        <EventDetails
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          keywords={keywords}
          setKeywords={setKeywords}
          maxParticipants={maxParticipants}
          setMaxParticipants={setMaxParticipants}
        />

        <CoverImage
          imageUrl={imageUrl}
          fileInputRef={fileInputRef}
          loading={loading}
          fileSelected={fileSelected}
          fileData={fileData}
        />

        <DateAndDuration
          durationType={durationType}
          setDurationType={setDurationType}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          duration={duration}
          setDuration={setDuration}
        />

        <PricingOptions
          hasTicketTypes={hasTicketTypes}
          setHasTicketTypes={setHasTicketTypes}
          hasTicketOptions={hasTicketOptions}
          setHasTicketOptions={setHasTicketOptions}
          currency={currency}
          setCurrency={setCurrency}
          price={price}
          setPrice={setPrice}
          tickets={tickets}
          setTickets={setTickets}
          ticketOptions={ticketOptions}
          setTicketOptions={setTicketOptions}
        />

        <LocationSection value={""} setLocation={selectLocation} />

        <DisplaySettings
          enableBookings={enableBookings}
          setEnableBookings={setEnableBookings}
          showInNews={showInNews}
          setShowInNews={setShowInNews}
          overlayText={overlayText}
          setOverlayText={setOverlayText}
        />

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
