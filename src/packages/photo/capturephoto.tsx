import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, InputGroup, Alert } from "react-bootstrap";
import jsQR from "jsqr";
import { ArrowRepeat } from "react-bootstrap-icons";
import useUser from "../auth/context/useuser";

type CapturePhotoProps = {
  show: boolean;
  onPhoto?: (dataUrl: string) => void;
  onQRCode?: (data: string) => void;
  onClose: () => void;
  onId?: (id: string) => void;
  useRearCamera?: boolean;
};

const extractOriginalId = (expandedId: string): string => {
  if (expandedId.length <= 4) {
    return expandedId;
  }
  return expandedId.slice(2);
};

const CapturePhoto = ({
  show,
  onPhoto,
  onQRCode,
  onClose,
  onId,
  useRearCamera = true,
}: CapturePhotoProps) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [input, setInput] = useState<string>("21");
  const [cameraFacingMode, setCameraFacingMode] = useState(
    useRearCamera ? "environment" : "user"
  );
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  const { user, oldIdToNewMapping, getIdFromFullId } = useUser();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getIdFromUrl = async (url: string | null | undefined): Promise<string | null> => {
    if (!url) {
      console.error("$$$ No URL provided");
      return null;
    }
    const hashRegex = /[#&?]id=(\d+)/;
    const pathRegex = /\/(\d+)(?:\/)?$/;
    const referRegex = /[?&#]refer=(\d+)/;

    const hashMatch = url.match(hashRegex);
    if (hashMatch) return extractOriginalId(hashMatch[1]);

    const pathMatch = url.match(pathRegex);
    if (pathMatch) return extractOriginalId(pathMatch[1]);

    const referMatch = url.match(referRegex);
    if (referMatch) {
      const oldId = referMatch[1];
      return await oldIdToNewMapping(oldId);
    }
    return null;
  };

  const processId = (id: string) => {
    const tempId = getIdFromFullId(`${id}`);
    if (tempId && onId) {
      onId(tempId);
    }
  };

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
      const videoInputDevices = devices.filter((device) => device.kind === "videoinput");
      setHasMultipleCameras(videoInputDevices.length > 1);
    } catch (err) {
      console.error("Error checking camera availability", err);
    }
  };

  const decodeQRCode = (dataUrl: string) => {
    const image = new Image();
    image.src = dataUrl;
    image.onload = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      const id = await getIdFromUrl(code?.data);
      if (id && onId) {
        processId(id);
      } else if (code && onQRCode) {
        onQRCode(code.data);
      } else {
        setError(`No QR code found, use the customer ID instead.`);
      }
    };
  };

  const startVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacingMode },
      });
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
      if (stream instanceof MediaStream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      videoRef.current.srcObject = null;
    }
  };

  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (!context) return;
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      const dataUrl = canvasRef.current.toDataURL("image/png");
      if (onQRCode) {
        decodeQRCode(dataUrl);
      } else if (onPhoto) {
        onPhoto(dataUrl);
      } else {
        setPhoto(dataUrl);
      }
    }
  };

  const handleSwitchCamera = () => {
    setCameraFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  return (
    <Modal show={show} onHide={onClose} dialogClassName="capture-photo-modal" centered>
      <Modal.Header closeButton>
        <Modal.Title>Take a Photo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {onId && (
          <InputGroup className="mb-2">
            <InputGroup.Text>Customer ID</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Enter Customer ID"
              value={input}
              onChange={(ev) => setInput(ev.target.value)}
            />
            <Button variant="primary" onClick={() => processId(input)}>
              Save
            </Button>
          </InputGroup>
        )}
        {photo ? (
          <img src={photo} alt="Captured" className="img-fluid" />
        ) : (
          <>
            <video ref={videoRef} style={{ width: "100%" }} />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            {error && (
              <Alert className="mb-2" variant="danger">
                {error}
              </Alert>
            )}
          </>
        )}
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
