import React, { useEffect, useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { ArrowRepeat } from "react-bootstrap-icons";

type QRCodeScannerProps = {
  onClose: () => void;
  onQRCode: (id: string) => void;
};

const extractOriginalId = (expandedId: string): string => {
  if (expandedId.length <= 4) {
    return expandedId;
  }
  return expandedId.slice(2);
};

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
    return referMatch[1];
  }
  return null;
};

const QRCodeScanner = ({ onClose, onQRCode }: QRCodeScannerProps) => {
  const [scannedID, setScannedID] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [cameraFacingMode, setCameraFacingMode] = useState("environment");
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  useEffect(() => {
    const checkCameraPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        stream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        alert("Camera permissions are not set");
      }
    };
    checkCameraPermissions();
  }, []);

  const handleScan = async (scannedData: IDetectedBarcode[]) => {
    if (scannedData) {
      const data = scannedData[0].rawValue;
      const id = await getIdFromUrl(data);
      setScannedID(id);
      setIsScanning(false);
    }
  };

  const handleError = (err: unknown) => {
    console.error(err);
  };

  const handleNext = () => {
    if (onQRCode && scannedID) {
      onQRCode(scannedID);
    }
  };

  const switchCamera = () => {
    setCameraFacingMode((prevMode) => (prevMode === "environment" ? "user" : "environment"));
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>Scan QR Code</Modal.Header>
      <Modal.Body>
        {hasCameraPermission ? (
          <>
            <Scanner
              onError={handleError}
              onScan={handleScan}
              constraints={{ facingMode: cameraFacingMode } as MediaTrackConstraints}
              styles={{ container: { width: "100%" } }}
            />
            <InputGroup className="my-3">
              <InputGroup.Text>Customer ID</InputGroup.Text>
              <Form.Control
                value={scannedID || ""}
                onChange={(e) => setScannedID(e.target.value)}
              />
            </InputGroup>
            <div className="d-flex justify-content-between mt-3">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
              <Button variant="secondary" onClick={switchCamera}>
                <ArrowRepeat size={32} />
              </Button>
              <Button variant="primary" disabled={!scannedID} onClick={handleNext}>
                Next
              </Button>
            </div>
          </>
        ) : (
          <div>Camera permissions are not set</div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default QRCodeScanner;
