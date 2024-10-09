import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import jsQR from "jsqr"; // Import the jsQR library
import { ArrowRepeat } from "react-bootstrap-icons";

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
            <ArrowRepeat size={32} />
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
