import React, { useContext, useEffect, useState } from "react";
import { LoyaltyContext, LoyaltyProvider } from "./context/loyaltyprovider";
import { useUser } from "../auth/context/useuser";
import StampsBarChart from "./stampsbarchart";
import LoyaltyRewards from "./loyaltyrewards";
import { Button } from "react-bootstrap";
import { getImageSrc } from "../../../packages/zharo/src/getimagesrc";
import { Camera, InfoCircleFill } from "react-bootstrap-icons";
import CapturePhoto from "../photo/capturephoto";
import { useToast } from "../../packages/toasts/usetoast";
import LoyaltySystemForm from "./loyaltysystemform";
import InfoBox from "../../components/infobox/infobox";
import UserRewardModal from "./userrewardmodal";
import LoadingSpinner from "../../components/spinner/spinner";
import QRCodeScanner from "../photo/qrcodescanner.js";
import Tracker from "../tracker/tracker";

const Loyalty = () => {
  const {
    loading,
    system,
    cards,
    rewards,
    redeemUserReward,
    addUserStamp,
    setCustomerId,
    customer,
    customerStamps,
    customerRewards,
  } = useContext(LoyaltyContext);
  const { user } = useUser();
  const { addToast } = useToast();

  const [showCamera, setShowCamera] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);

  if (!user) {
    return <div>Loading user...</div>;
  }

  const onAddStamp = () => {
    addUserStamp(system.id, customer.id);
    addToast("Loyalty", "Stamp added", "success");
    clearCustomer();
  };
  const onRedeemReward = () => {
    redeemUserReward(system.id, customer.id);
    addToast("Loyalty", "Reward redeemed", "info");
    clearCustomer();
  };

  const clearCustomer = () => {
    setShowCustomer(false);
    setCustomerId();
  };

  const onCloseCustomer = () => {
    clearCustomer();
  };

  const captureId = (id) => {
    setShowCamera(false);
    setCustomerId(id);
    setShowCustomer(true);
  };
  const capturePhoto = (photo) => {
    setShowCamera(false);
  };

  const captureQRCode = (qrCode) => {
    setShowCamera(false);
  };

  if (!system) {
    return (
      <div className="m-3">
        <h2>Loyalty Program</h2>
        <InfoBox>
          <InfoBox.Header varaint="primary">
            <em>
              <InfoCircleFill /> About Loyalty Programs
            </em>
          </InfoBox.Header>
          <InfoBox.Body>
            <p>
              Our Loyalty Program rewards your customers for their continued
              support. Customers earn stamps with every qualifying purchase,
              ensuring return visits and awareness.
            </p>
            <p>How It Works:</p>
            <ul>
              <li>
                <p>
                  <strong>Join the Program:</strong>
                </p>
                <p>
                  Design your own Loyalty Card and program
                  <br />
                  Customers join your program by scanning your xxxxxx <br />
                  Customers present their unique QR Code during their purchases
                  and are rewarded with your stamp
                </p>
              </li>

              <li>
                <p>
                  <strong>Earning Stamps:</strong>
                </p>
                <p>
                  For every qualifying purchase, partners scan the customer's QR
                  code to allocate a stamp to the customer's account.
                </p>
              </li>

              <li>
                <p>
                  <strong>Rewards:</strong>
                </p>
                <p>
                  Once the customer has collected your required amount of
                  stamps, they are eligible for a reward — typically an
                  additional item of the same type they were buying.
                </p>
              </li>
            </ul>
            ... Now we're dancing!!
          </InfoBox.Body>
        </InfoBox>
        <LoyaltySystemForm />
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Tracker itemtype="partner.loyalty" id={system.id}>
      <div className="d-flex justify-content-between pb-2">
        <h2>{system.name}</h2>
        <Button className="me-3" onClick={() => setShowCamera(true)}>
          <Camera />
        </Button>
      </div>
      {system.image ? (
        <img
          src={getImageSrc(system.image)}
          alt={system.name}
          style={{ maxWidth: "min(95vw, 500px)", height: "auto" }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      ) : (
        <h2>{system.name}</h2>
      )}
      <h2>Stamps</h2>
      <StampsBarChart data={cards} />
      <h2>Rewards</h2>
      <LoyaltyRewards data={rewards} />

      {showCamera && (
        <QRCodeScanner
          onClose={() => setShowCamera(false)}
          onQRCode={captureId}
        />
      )}

      {/* <CapturePhoto
        show={showCamera}
        onId={captureId}
        onPhoto={capturePhoto}
        onQRCode={captureQRCode}
        onClose={() => setShowCamera(false)} 
      />*/}
      <UserRewardModal
        show={showCustomer}
        customer={customer}
        customerStamps={customerStamps}
        customerRewards={customerRewards}
        onAddStamp={onAddStamp}
        onRedeemReward={onRedeemReward}
        onClose={onCloseCustomer}
      />
    </Tracker>
  );
};

export default Loyalty;
