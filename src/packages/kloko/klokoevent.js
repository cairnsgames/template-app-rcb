import React, { useState, useEffect } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

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
import useUser from "../auth/context/useuser";

const KlokoEventEditor = ({ id, onClose }) => {
  const { t } = useTranslation();
  const {
    createEvent,
    updateEvent,
    fetchEventById,
    loading,
    fetchTicketTypesByEventId,fetchTicketOptionsByEventId ,
  } = useMyEvents();
  const { addToast } = useToast();
  
  const { defaultLocation } = useUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("ZAR");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [keywords, setKeywords] = useState("");
  const [eventType, setEventType] = useState("event");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState(defaultLocation || {});
  const [maxParticipants, setMaxParticipants] = useState("");
  const [event, setEvent] = useState({});
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    now.setMinutes(0, 0, 0); 
    now.setHours(now.getHours() + (24 * 7 + 1));
    return now.toISOString().slice(0, 16); 
  });
  const [endTime, setEndTime] = useState("");
  const [enableBookings, setEnableBookings] = useState(true);
  const [showInNews, setShowInNews] = useState(false);
  const [overlayText, setOverlayText] = useState(false);
  const [durationType, setDurationType] = useState("duration");
  const [hasTicketTypes, setHasTicketTypes] = useState("different");
  const [tickets, setTickets] = useState([]);
  const [hasTicketOptions, setHasTicketOptions] = useState("no");
  const [ticketOptions, setTicketOptions] = useState([]);
  const [latlng, setLatlng] = useState({ lat: 0, lng: 0 });
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      const endTimeDate = new Date(
        new Date(startTime).getTime() + duration * 60 * 1000
      );
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

      console.log("Event to Edit", {name: eventToEdit.location, lat: eventToEdit.lat, lng: eventToEdit.lng});
      setEvent(eventToEdit);
      if (eventToEdit) {
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
        setLocation({name: eventToEdit?.location, lat: eventToEdit.lat, lng: eventToEdit.lng});
        setMaxParticipants(eventToEdit.max_participants);
        setOverlayText(eventToEdit.overlay_text === "Y");
        setEnableBookings(eventToEdit.enable_bookings === "Y");
        setShowInNews(eventToEdit.show_as_news === "Y");
        setHasTicketOptions(eventToEdit.options === "yes" ? "yes" : "no");
        setHasTicketTypes(eventToEdit.tickettypes);
        setDurationType(eventToEdit.period_type);

        // fetch TicketTypes
        const fetchTicketTypes = async () => {
          // Fetch ticket types based on the event ID
          const ticketTypes = await fetchTicketTypesByEventId(id);
          setTickets(ticketTypes);
        };
        fetchTicketTypes();

        // Fetch TicketOptions
        const fetchTicketOptions = async () => {
          // Fetch ticket options based on the event ID
          const options = await fetchTicketOptionsByEventId(id);
          setTicketOptions(options);
        };
        fetchTicketOptions();
      }
    }
  }, [id]);

  const selectLocation = (location) => {
    setLatlng({ lat: location.lat, lng: location.lng });
    setLocation(location);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitted(true); // Disable submit button immediately

    const startTimePlus1Hour = new Date(new Date(startTime).getTime() + 60 * 60 * 1000).toISOString().slice(0, 16);

    const locationName =
      location && typeof location === "object" && location.name
      ? location.name
      : typeof location === "string"
      ? location
      : "";

    const eventData = {
      ...event,
      title,
      description,
      currency,
      price,
      keywords: keywords,
      event_type: eventType,
      duration,
      location: locationName,
      lat:
      location && typeof location === "object" && location.lat != null
        ? location.lat
        : latlng.lat,
      lng:
      location && typeof location === "object" && location.lng != null
        ? location.lng
        : latlng.lng,
      max_participants: maxParticipants,
      start_time: startTime,
      end_time: endTime < startTime ? startTimePlus1Hour : endTime,
      enable_bookings: enableBookings ? "Y" : "N",
      show_as_news: showInNews ? "Y" : "N",
      overlay_text: overlayText ? "Y" : "N",
      period_type: durationType,
      tickettypes: hasTicketTypes,
      ticketoptions: hasTicketOptions,
    };

    if (isFileSelected) {
      const fileName = await uploadFile(fileInputRef.current.files);
      eventData.image = extractFileName(
        combineUrlAndPath(process.env.REACT_APP_FILES, fileName)
      );
    }

    if (id) {
      await updateEvent(eventData, tickets, ticketOptions); // Update event if ID is present
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
    setDurationType("duration");
    setHasTicketTypes("fixed");
    setTickets([])  ;
    setHasTicketOptions("no");
    setTicketOptions([]);
    onClose();
  };

  // useEffect(() => {
  //   console.log("LOCATION", location);
  // }, [location]);

  return (
    <Div className="packagesKlokoEvent">
      <Form onSubmit={handleSubmit}>

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
          hasTicketOptions={hasTicketOptions === "yes" ? "yes" : "no"}
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

        <LocationSection location={location} setLocation={selectLocation} />

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
          disabled={loading || fileLoading || isSubmitted}
        >
          {loading || fileLoading ? (
            <Spinner animation="border" size="sm" />
          ) : id ? (
            t('updateEvent')
          ) : (
            t('events.createEvent')
          )}
        </Button>
      </Form>
    </Div>
  );
};

export default KlokoEventEditor;
