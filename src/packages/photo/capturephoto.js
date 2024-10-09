import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import jsQR from "jsqr"; // Import the jsQR library

const SwitchCameraIcon = () => {
  return (
    <svg
      version="1.1"
      viewBox="0 0 1024 1024"
      width="32"
      height="32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path transform="translate(0)" d="m0 0h1024v1024h-1024z" fill="#FCFCFC" />
      <path
        transform="translate(410,234)"
        d="m0 0h159l12 4 11 6 5 5 9 12 4 13v35h49l12 2 13 4v2l5 2 10 6 10 12 7 10 5 13 3 15v243l-3 16-5 11-7 11-7 9-9 6-10 7-14 5-8 1h-341l-12-2-15-6v-2l-5-2-8-6-12-13-7-15-4-11-1-8v-239l2-16 4-12 5-9 6-9 9-9 9-7 12-5 11-3 7-1h49v-34l4-12 7-11 6-7 10-6z"
        fill="#FCFCFC"
      />
      <path
        transform="translate(410,234)"
        d="m0 0h159l12 4 11 6 5 5 9 12 4 13v35h49l12 2 13 4v2l5 2 10 6 10 12 7 10 5 13 3 15v243l-3 16-5 11-7 11-7 9-9 6-10 7-14 5-8 1h-341l-12-2-15-6v-2l-5-2-8-6-12-13-7-15-4-11-1-8v-239l2-16 4-12 5-9 6-9 9-9 9-7 12-5 11-3 7-1h49v-34l4-12 7-11 6-7 10-6zm12 54-1 57-7 11-9 6-9 1h-72l-6 2-6 8-2 8v231l2 8 1 2h2v2h2v2l5 3h337l5-3 4-4 2-4v-242l-4-8-6-4-7-1h-73l-9-3-8-7-3-7-1-6-1-52z"
        fill="#010101"
      />
      <path
        transform="translate(766,157)"
        d="m0 0h15l10 6 8 6 7 4 8 7 12 9 5 4 5 5 14 13 10 10 9 10 6 7v2l5 2 7 11 8 10 7 11 7 9 5 9 12 20 4 9 4 7 6 16 6 12 3 11 6 19 4 16 6 31 2 18 1 18v49l-2 26-5 30-4 17-4 16-8 24-5 12-7 16-3 8-6 11-8 15h-2l-1 6-10 14-12 18-3 1-2 5-7 9-7 8-8 9-22 22-8 7-7 6-8 6-10 8-8 5-13 9h-2l-1 3-16 8-18 10-15 6-13 6-10 4-9 3-27 8-25 6-31 5h-28v2l4 2 10 9 6 10 2 10-2 10-6 9-7 6-11 3-13-1-10-5-9-8-5-5-10-9-4-4-2-1v-2h-2l-8-8v-2h-2l-4-4-8-7-5-6-8-6-15-15-3-6-1-5v-14l4-7 12-14 12-10 5-6 10-8 5-6 6-4 13-13 3-1 2-3h2l2-4 8-7 10-5 9-2 10 1 10 4 7 8 4 9v9l-4 10-9 10-10 7-11 11-5 4-5 5-2 3 46-1 26-3 16-3 13-3 36-12 15-7 15-6 21-13 12-7 10-8 7-4 11-10 5-3 5-6 8-7 10-10 5-6h2l2-5 9-10 6-8 4-7 7-9 8-14 7-11 5-12 10-19 3-10 9-27 7-31 4-31 1-15v-41l-3-30-3-17-4-18-4-15-4-10-2-8-12-27-3-7-8-14-7-11-6-9-11-16-9-11-5-5-9-10v-2l-4-2-4-4v-2l-4-2-4-4v-2l-4-2-11-9-4-3v-2l-4-2-11-8-9-6-5-4-6-3-5-6-3-7-1-11 2-8 6-8 7-6z"
        fill="#010101"
      />
      <path
        transform="translate(130,135)"
        d="m0 0h104l10 4 9 6 5 10 1 4 1 25v79l-3 9-4 6-7 6-8 3h-12l-12-6v-2h-2l-6-8-1-3v-35h-2l-2 4-8 6h-2l-2 5-4 2-1 3-4 3h-2l-1 3h-2l-2 5-5 6-6 5-8 11-6 7-11 17-10 15-2 6-6 11-7 13-4 12-6 16-7 23-3 14-5 36-1 20v35l5 40 5 23 4 15 6 18 9 23 9 16 2 3 2 6 12 18 7 10 9 11 5 8 8 7 7 9 7 5v2l4 2 4 5 10 7v2l5 2 5 5 6 3 8 7 21 13 10 6v2l4 1 8 3 10 6 17 8 9 3 8 4 11 3 12 5 22 6 13 4 28 6 11 8 5 10 1 10-2 9-7 9-8 6-5 1h-15l-35-9-14-4-17-5-23-9-3-2-11-3-28-14-9-4-10-6-9-6-13-7-4-3v-2l-5-2-15-10-5-4-5-5-10-7-6-6v-2l-4-2-9-7v-2l-3-1v-2h-2l-5-6v-2l-5-2-8-11-5-4-5-6-2-5-5-5-9-13-6-10-4-4-8-16-11-20-2-6-5-11-6-17-6-16-3-13-4-16-4-21-3-27-1-12v-51l3-32 6-30 4-16 5-17 12-32 4-8 4-10 5-9 6-9 4-9 7-11 8-12 15-21h2l2-4 6-7 5-7h2l2-4 4-4h2l2-4 7-9 3-1 15-15-39-1-7-3-6-4-6-7-3-7v-13l6-12 8-6z"
        fill="#010101"
      />
      <path
        transform="translate(481,361)"
        d="m0 0h18l16 2 23 7 16 8 9 7 6 3 13 13 6 5 4 7v2h2v2l3 1 8 14 5 12 5 13 3 15 1 8v17l-2 14-4 17-7 18-7 11-7 9-3 6-7 6-4 5h-2l-2 4-3 1v2l-7 4-5 4h-2v2l-18 9-9 3-16 4-11 2-18 1-16-2-18-5-19-7-20-14-11-9-4-5v-2l-4-2-2-4h-2l-7-10-12-23-5-14-3-15v-34l5-22 5-12 10-19 2-4 5-5 3-4h2l2-4 5-6 4-1 2-4 11-9 11-6 16-8 21-6z"
        fill="#010101"
      />
      <path
        transform="translate(481,415)"
        d="m0 0h20l16 4 12 7 7 4 4 3v2l4 2 10 13 4 8 4 10 3 14v15l-4 16-4 12-9 12-7 8-12 9-8 4-15 5-12 2-13-1-15-3-9-4-11-7-13-12-6-9-5-8-4-10-2-11v-20l2-12 5-12 5-8 6-8 5-5 11-9 16-8z"
        fill="#FCFCFC"
      />
    </svg>
  );
};

function getIdFromUrl(url) {
  if (!url) {
    console.error("$$$ No URL provided");
    return null;
  }
  // Regex to match id parameter after the # or in the URL path
  const hashRegex = /[#&?]id=(\d+)/; // Matches id=21 after the #
  const pathRegex = /\/(\d+)(?:\/)?$/; // Matches /21 at the end of the URL path

  // Check for id in the fragment or query parameters
  const hashMatch = url.match(hashRegex);
  if (hashMatch) {
    return hashMatch[1];
  }

  // Check for id in the URL path
  const pathMatch = url.match(pathRegex);
  if (pathMatch) {
    return pathMatch[1];
  }

  // Return null if id is not found
  return null;
}

const CapturePhoto = ({
  show,
  onPhoto,
  onQRCode,
  onClose,
  onId,
  useRearCamera = true,
}) => {
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [input, setInput] = useState(21);
  const [cameraFacingMode, setCameraFacingMode] = useState(
    useRearCamera ? "environment" : "user"
  );
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (show && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      checkCameraAvailability();
      startVideoStream();
    }
    return () => {
      stopVideoStream();
    };
  }, [show, cameraFacingMode]);

  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setHasMultipleCameras(videoInputDevices.length > 1);
    } catch (err) {
      console.error("Error checking camera availability", err);
    }
  };

  const decodeQRCode = (dataUrl) => {
    const image = new Image();
    image.src = dataUrl;
    image.onload = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      const id = getIdFromUrl(code?.data);
      console.log("$$$ id captured", id);
      if (id && onId) {
        onId(id);
      } else if (code && onQRCode) {
        console.log("$$$ QR Code:", code.data);
        onQRCode(code.data); // Return the decoded text from the QR code
      } else {
        setError("No QR code found");
      }
    };
  };

  const startVideoStream = async () => {
    try {
      const constraints = {
        video: { facingMode: cameraFacingMode },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setError("Error accessing camera");
      console.error("Error accessing camera", err);
    }
  };

  const stopVideoStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      const dataUrl = canvasRef.current.toDataURL("image/png");

      if (onQRCode) {
        decodeQRCode(dataUrl); // Decode the QR code from the captured image
      } else if (onPhoto) {
        onPhoto(dataUrl);
      } else {
        setPhoto(dataUrl);
      }
    }
  };

  const handleSwitchCamera = () => {
    setCameraFacingMode((prevMode) =>
      prevMode === "user" ? "environment" : "user"
    );
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      dialogClassName="capture-photo-modal"
      centered
      fullscreen={window.innerWidth <= 768 ? true : undefined}
    >
      <Modal.Header closeButton>
        <Modal.Title>Take a Photo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {photo ? (
          <img src={photo} alt="Captured" className="img-fluid" />
        ) : (
          <>
            <video ref={videoRef} style={{ width: "100%" }} />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            {error && <p className="text-danger">{error}</p>}
          </>
        )}
        <InputGroup>
          <InputGroup.Text>Customer ID</InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Enter Customer ID"
            value={input}
            onChange={(ev) => setInput(ev.target.value)}
          />
          <Button variant="primary" onClick={() => onId(input)}>
            Save
          </Button>
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        {!photo && (
          <Button variant="primary" onClick={handleTakePhoto}>
            Capture Photo
          </Button>
        )}
        {hasMultipleCameras && (
          <Button variant="secondary" onClick={handleSwitchCamera}>
            <SwitchCameraIcon />
          </Button>
        )}
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CapturePhoto;
