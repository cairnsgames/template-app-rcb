import React, { useState } from "react";
import QRCode from "../../packages/qrcode/qrcode";
import PageCentered from "../../parts/pagelayouts/pagecentered";

const QRCodePage = (props) => {
  const text = "https://juzt.dance/#referral?id=21";
  return (
    <PageCentered>
      <div className="mx-auto">
        <QRCode link={text} size={500} allowCopyToClipboard={true} />
      </div>
      <div className="primary-border my-3">
      <div>
        This QR Code can be used by anyone to join <span className="juztdance">Juzt.Dance</span>. Share it with
        your friends and family.
      </div>
      <div className="mt-3">
        This code can also be scanned by <span className="juztdance">Juzt.Dance</span> partners to get a discount,
        by venues that are part of the loyalty program, and teachers to add you
        to their class.
      </div>
      <div className="mt-3">
        Use it wherever you need it! It's your personal QR Code.
      </div>
      </div>
    </PageCentered>
  );
};

export default QRCodePage;
