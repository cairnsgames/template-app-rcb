import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import jsQR from "jsqr"; // Import the jsQR library

function getIdFromUrl(url) {
  if (!url) {
    console.error("$$$ No URL provided");
    return null;
  }
  // Regex to match `id` parameter after the `#` or in the URL path
  const hashRegex = /[#&?]id=(\d+)/;   // Matches `id=21` after the `#`
  const pathRegex = /\/(\d+)(?:\/)?$/; // Matches `/21` at the end of the URL path

  // Check for `id` in the fragment or query parameters
  const hashMatch = url.match(hashRegex);
  if (hashMatch) {
    return hashMatch[1];
  }

  // Check for `id` in the URL path
  const pathMatch = url.match(pathRegex);
  if (pathMatch) {
    return pathMatch[1];
  }

  // Return null if `id` is not found
  return null;
}

const CapturePhoto = ({ show, onPhoto, onQRCode, onClose, onId }) => {
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [input, setInput] = useState(21);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (show && !onPhoto && !onQRCode) {
      captureFromCamera();
    } else if (
      show &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    ) {
      startVideoStream();
    }
    return () => {
      stopVideoStream();
    };
  }, [show]);

  const captureFromCamera = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (onQRCode || onId) {
        decodeQRCode(image.dataUrl);
      } else if (onPhoto) {
        onPhoto(image.dataUrl);
      } else {
        setPhoto(image.dataUrl);
      }
    } catch (err) {
      setError("Error capturing photo");
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
      if (id && onId) {
          onId(id);
      } else if (code && onQRCode) {
        onQRCode(code.data); // Return the decoded text from the QR code
      } else {
        setError("No QR code found");
      }
    };
  };

  const startVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setError("Error accessing camera");
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

  return (
    <Modal show={show} onHide={onClose}>
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
        <Form.Control type="text" placeholder="Enter Customer ID" value={input} onChnage={(ev) => setInput(ev.target.value)} />
        <Button variant="primary" onClick={()=>onId(input)}>Save</Button>
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        {!photo && (
          <Button variant="primary" onClick={handleTakePhoto}>
            Capture Photo
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
