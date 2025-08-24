import React from "react";

const JuztDanceVideo = () => (
  <section className="video-section my-4 d-flex justify-content-center">
    <video
      width="100%"
      style={{ maxWidth: '80vw', maxHeight: '70vh', borderRadius: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
      controls
    >
      <source src="/JuztDanceVideo.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </section>
);

export default JuztDanceVideo;
