// Filename: usermodal.js

import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const UserRewardModal = ({ show, customer, customerStamps, customerRewards, onClose, onAddStamp, onRedeemReward }) => {

console.log("$$$ UserrewwardModal", show, customer, customerStamps, customerRewards);
  const stampsCollected = Array.isArray(customerStamps) && customerStamps[0]?.stamps_collected || 0;
  const rewardsEarned = customerRewards?.length ?? 0;

  return (
    <Modal show={show} onHide={() => onClose()}>
      <Modal.Header closeButton>
        <Modal.Title>{customer?.firstname}'s Stamps & Rewards</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Stamps Collected: {stampsCollected}</p>
        <p>Rewards Earned: {rewardsEarned}</p>
      </Modal.Body>
      <Modal.Footer>
        {rewardsEarned > 0 && (
          <Button variant="success" onClick={() => onRedeemReward()}>
            Redeem Reward
          </Button>
        )}
        <Button variant="primary" onClick={() => onAddStamp()}>
          Add Stamp
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserRewardModal;