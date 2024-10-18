import React, { useState } from "react";
import QRCode from "../../packages/qrcode/qrcode";
import PageCentered from "../../parts/pagelayouts/pagecentered";
import useUser from "../../packages/auth/context/useuser";

const QRCodePage = (props) => {
  const { user, fullId } = useUser();
  if (!user) {
    return <div>Loading...</div>;
  }
  const text = `https://juzt.dance/#referral?id=${fullId}`;
  return (
    <PageCentered>
      <h2>Your QR Code</h2>
      <div className="mx-auto my-2" style={{ maxWidth: "350px" }}>
        <QRCode link={text} size={255} allowCopyToClipboard={true} />
      </div>
      <div className="primary-border my-3">
        <div>
          This QR Code can be used by anyone to join{" "}
          <span className="juztdance">Juzt.Dance</span>. Share it with your
          friends and family.
        </div>
        <div className="mt-3">
          This code can also be scanned by{" "}
          <span className="juztdance">Juzt.Dance</span> partners to get a
          discount, by venues that are part of the loyalty program, and teachers
          to add you to their class.
        </div>
        <div className="mt-3">
          Use it wherever you need it! It's your personal QR Code.
        </div>
      </div>
      
      <div className="mb-3">
          <em>Your customer ID is <strong>{fullId}</strong> if our partners have trouble scaning your code.</em>
        </div>
    </PageCentered>
  );
};

export default QRCodePage;
