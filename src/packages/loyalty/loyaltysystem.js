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
import { useTranslation } from 'react-i18next';

const Loyalty = () => {
  const { t } = useTranslation();
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
    return <div>{t('loyalty.loadingUser')}</div>;
  }

  const onAddStamp = () => {
    addUserStamp(system.id, customer.id);
    addToast(t('loyalty.stampAdded'), 'success');
    clearCustomer();
  };
  const onRedeemReward = () => {
    redeemUserReward(system.id, customer.id);
    addToast(t('loyalty.rewardRedeemed'), 'info');
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
      <div className="m-3 packagesLoyaltySystem">
        <h2>{t('loyalty.programTitle')}</h2>
        <InfoBox>
          <InfoBox.Header varaint="primary">
            <em>
              <InfoCircleFill /> {t('loyalty.aboutPrograms')}
            </em>
          </InfoBox.Header>
          <InfoBox.Body>
            <p>{t('loyalty.programDescription')}</p>
            <p>{t('loyalty.howItWorks')}</p>
            <ul>
              <li>
                <p>
                  <strong>{t('loyalty.joinProgram')}</strong>
                </p>
                <p>{t('loyalty.joinProgramDescription')}</p>
              </li>

              <li>
                <p>
                  <strong>{t('loyalty.earningStamps')}</strong>
                </p>
                <p>{t('loyalty.earningStampsDescription')}</p>
              </li>

              <li>
                <p>
                  <strong>{t('loyalty.rewardsInfo')}</strong>
                </p>
                <p>{t('loyalty.rewardsDescription')}</p>
              </li>
            </ul>
            {t('loyalty.dancingMessage')}
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
      <h2>{t('loyalty.stamps')}</h2>
      <StampsBarChart data={cards} />
      <h2>{t('loyalty.rewards')}</h2>
      <LoyaltyRewards data={rewards} />

      {showCamera && (
        <QRCodeScanner
          onClose={() => setShowCamera(false)}
          onQRCode={captureId}
        />
      )}

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
