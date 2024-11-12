import React from "react";
import PageFull from "../../parts/pagelayouts/pagefull";
import InfoCard from "../../components/infocard/infocard"; // Import InfoCard component

const PayNowThankYouPage = () => {
  return (    
    <PageFull className="pt-2">
      <InfoCard 
        title="Thank You!" 
        text="Your payment has been received successfully." 
        message="We appreciate your order and hope you enjoy your purchase!" 
      />
    </PageFull>
  );
};

export default PayNowThankYouPage;
