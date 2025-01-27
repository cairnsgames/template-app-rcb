import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import QrScanner from "react-qr-scanner";
import { ArrowRepeat } from "react-bootstrap-icons";

const QRCodeScanner = ({ onClose, onQRCode }) => {
  const [scannedID, setScannedID] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [cameraFacingMode, setCameraFacingMode] = useState("environment"); // Default to rear camera
  const [hasCameraPermission, setHasCameraPermission] = useState(true);

  function extractOriginalId(expandedId) {
    if (expandedId.length <= 4) {
      return expandedId;
    }
  
    return expandedId.slice(2); // Return only the original ID (after checksum)
  }

  async function getIdFromUrl(url) {
    if (!url) {
      console.error("$$$ No URL provided");
      return null;
    }

    // Updated regex to match refer in both query string and hash fragment
    const hashRegex = /[#&?]id=(\d+)/; // Matches id=870001 after the #
    const pathRegex = /\/(\d+)(?:\/)?$/; // Matches /870001 at the end of the URL path
    const referRegex = /[?&#]refer=(\d+)/; // Matches refer=27 in the query string or fragment

    const hashMatch = url.match(hashRegex);
    if (hashMatch) {
      return extractOriginalId(hashMatch[1]);
    }

    const pathMatch = url.match(pathRegex);
    if (pathMatch) {
      return extractOriginalId(pathMatch[1]);
    }

    const referMatch = url.match(referRegex);
    if (referMatch) {
      const oldId = referMatch[1];
      return await oldIdToNewMapping(oldId);
    }

    return null;
  }


  useEffect(() => {
    const checkCameraPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        stream.getTracks().forEach(track => track.stop()); // Stop the stream
      } catch (error) {
        alert("Camera permissions are not set");
      }
    };

    checkCameraPermissions();
  }, []);
  
  const handleScan = async (data) => {
    if (data) {
      console.log("Scanned URL: ", data);
      // const urlParams = new URLSearchParams(data.text.split("?")[1]);
      const id = await getIdFromUrl(data.text);
      console.log("GET ID FROM URL", id);
      setScannedID(id);
      setIsScanning(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleNext = () => {
    if (onQRCode) {
      onQRCode(scannedID);
    }
  }

  const toggleScanning = () => {
    setIsScanning(!isScanning);
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
            <QrScanner
              onError={handleError}
              onScan={handleScan}
              facingMode={cameraFacingMode}
              style={{ width: "100%" }}
            />
            <InputGroup className="mb-3">
              <InputGroup.Text>Customer ID</InputGroup.Text>
              <Form.Control
                value={scannedID || ''}
                readOnly
              />
            </InputGroup>
            <div className="d-flex justify-content-between mt-3">
              <Button variant="secondary" onClick={onClose}>Close</Button>
              <Button variant="secondary" onClick={switchCamera}><ArrowRepeat size={32} /></Button>              
              <Button variant="primary" disabled={!scannedID} onClick={handleNext}>Next</Button>
            </div>
            {scannedID && (
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    top: "10%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    padding: "10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => alert(`Scanned ID: ${scannedID}`)}
                >
                  {scannedID}
                </div>
              </div>
            )}
          </>
        ) : (
          <div>Camera permissions are not set</div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default QRCodeScanner;
