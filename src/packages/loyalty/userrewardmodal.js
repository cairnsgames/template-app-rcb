// Filename: usermodal.js

import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

const UserRewardModal = ({
  show,
  customer,
  customerStamps,
  customerRewards,
  onClose,
  onAddStamp,
  onRedeemReward,
}) => {
  const { t } = useTranslation();

  const stampsCollected =
    (Array.isArray(customerStamps) && customerStamps[0]?.stamps_collected) || 0;
  const rewardsEarned = customerRewards?.length ?? 0;

  return (
    <Modal
      show={show}
      onHide={() => onClose()}
      dialogClassName="user-reward-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {t('loyalty.customerStampsRewards', { customer: customer?.firstname || t('loyalty.customer') })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-center">
          <strong>
            {customer?.firstname} {customer?.lastname}
          </strong>
        </p>
        {customer?.avater && (
          <div>
            <img
              src={customer?.avater}
              alt={customer?.firstname}
              className="img-fluid rounded-circle"
            />
          </div>
        )}
        <p>{t('loyalty.stampsCollectedCount', { count: stampsCollected })}</p>
        <p>{t('loyalty.rewardsEarnedCount', { count: rewardsEarned })}</p>
      </Modal.Body>
      <Modal.Footer>
        {rewardsEarned > 0 && (
          <Button variant="success" onClick={() => onRedeemReward()}>
            {t('loyalty.redeemReward')}
          </Button>
        )}
        <Button variant="primary" onClick={() => onAddStamp()}>
          {t('loyalty.addStamp')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserRewardModal;
