import React, { useContext, useEffect, useState } from "react";
import { LoyaltyContext, LoyaltyProvider } from "./loyaltyprovider";
import { useUser } from "../auth/context/useuser";
import StampsBarChart from "./stampsbarchart";
import LoyaltyRewards from "./loyaltyrewards";
import { Button, Collapse } from "react-bootstrap";
import { getImageSrc } from "../../../packages/zharo/src/getimagesrc";
import { Camera, InfoCircleFill } from "react-bootstrap-icons";
import CapturePhoto from "../photo/capturephoto";
import { useToast } from "../../packages/toasts/usetoast";
import LoyaltySystemForm from "./loyaltysystemform";
import InfoBox from "../../components/infobox/infobox";
import UserRewardModal from "./userrewardmodal";

const Loyalty = () => {
  const {
    system,
    systems,
    selectSystem,
    cards,
    rewards,
    redeemUserReward,
    createNewCard,
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
    console.log("$$$$ Add Stamp", customer);
    addUserStamp(system.id, customer.id);
    addToast("Loyalty", "Stamp added", "success");
    clearCustomer();
  };
  const onRedeemReward = () => {
    redeemUserReward(system.id, customer.id);
    console.log("$$$$ Redeem Reward", customer);
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

  console.log("System", system);
  console.log("Cards", cards);

  const captureId = (id) => {
    console.log("$$$ ID captured", id);
    // addUserStamp(system.id, id);
    // addToast("Loyalty", "Stamp added", "success");
    setShowCamera(false);
    setCustomerId(id);
    setShowCustomer(true);
  };
  const capturePhoto = (photo) => {
    console.log("Photo captured", photo);
    setShowCamera(false);
  };

  const captureQRCode = (qrCode) => {
    console.log("$$$ QR Code captured", qrCode);
    setShowCamera(false);
  };

  console.log("Checking if there is a system", system);

  if (!system) {
    return (
      <div>
        <h2>Loyalty Program</h2>
        <InfoBox>
          <InfoBox.Header  varaint="primary">
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

  return (
    <div>
      <h2>{system.name}</h2>
      <div className="box border-primary">
        <Button className="ms-3" onClick={() => setShowCamera(true)}>
          <Camera />
        </Button>
      </div>
      {system.image ? (
        <img
          src={getImageSrc(system.image)}
          alt={system.name}
          style={{ maxWidth: "500px" }}
        />
      ) : (
        <h2>{system.name}</h2>
      )}
      <h2>Stamps</h2>
      <StampsBarChart data={cards} />
      <h2>Rewards</h2>
      <LoyaltyRewards data={rewards} />

      <CapturePhoto
        show={showCamera}
        onId={captureId}
        onPhoto={capturePhoto}
        onQRCode={captureQRCode}
        onClose={() => setShowCamera(false)}
      />
      <UserRewardModal
        show={showCustomer}
        customer={customer}
        customerStamps={customerStamps}
        customerRewards={customerRewards}
        onAddStamp={onAddStamp}
        onRedeemReward={onRedeemReward}
        onClose={onCloseCustomer}
      />
    </div>
  );
};

export default Loyalty;
