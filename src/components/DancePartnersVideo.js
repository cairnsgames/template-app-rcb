import React from "react";

const DancePartnersVideo = () => (
  <section className="video-section my-4 d-flex justify-content-center">
    <video
      width="100%"
      style={{ maxWidth: '80vw', maxHeight: '70vh', borderRadius: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
      controls
    >
      <source src="/JuztDancePartners.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </section>
);

export default DancePartnersVideo;
