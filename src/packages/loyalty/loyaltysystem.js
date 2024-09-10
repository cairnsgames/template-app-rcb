import React, { useContext, useEffect, useState } from "react";
import { LoyaltyContext, LoyaltyProvider } from "./loyaltyprovider";
import { useUser } from "../auth/context/useuser";
import StampsBarChart from "./stampsbarchart";
import LoyaltyRewards from "./loyaltyrewards";
import { Button } from "react-bootstrap";
import { getImageSrc } from "../../../packages/zharo/src/getimagesrc";
import { Camera } from "react-bootstrap-icons";
import CapturePhoto from "../photo/capturephoto";

const Loyalty = () => {
  const {
    setUser,
    systems,
    selectSystem,
    cards,
    rewards,
    createNewCard,
    addNewStamp,
  } = useContext(LoyaltyContext);
  const { user } = useUser();

  const [system, setSystem] = useState();
  const [showCamera, setShowCamera] = useState(false);

  if (!user) {
    return <div>Loading user...</div>;
  }

  useEffect(() => {
    if (systems?.length > 0) {
      setSystem(systems[0]);
      selectSystem(systems[0].id);
    }
  }, [systems]);

  console.log("System", system);
  console.log("Cards", cards);

  if (!system) {
    return <div>Loading...</div>;
  }

  const capturePhoto = (photo) => {
    console.log("Photo captured", photo);
    setShowCamera(false);
  }

  const captureQRCode = (qrCode) => {
    console.log("QR Code captured", qrCode);
    setShowCamera(false);
  }

  return (
    <div>
      {system.image ? (
        <img src={getImageSrc(system.image)} alt={system.name} style={{maxWidth:"min(90vw, 500px)"}} />
      ) : (
        <h2>{system.name}</h2>
      )}
      <h2>Stamps</h2>
      <StampsBarChart data={cards} />
      <h2>Rewards</h2>
      <LoyaltyRewards data={rewards} />
      <Button variant="outline-primary" onClick={() => createNewCard(user.id, selectedSystemId)}>
        Create New Card
      </Button>
      <Button className="ms-3" onClick={() => setShowCamera(true)}>
        <Camera />
      </Button>

      <CapturePhoto show={showCamera} onPhoto={capturePhoto} onQRCode={captureQRCode} onClose={()=>setShowCamera(false)} />
    </div>
  );
};

export default Loyalty;
