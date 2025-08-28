import React from "react";

const JuztDanceVideo = () => (
  <section className="video-section my-4 d-flex flex-column align-items-center">
    <h2 className="mb-4">What's Inside?</h2>
    <div className="w-100 d-flex justify-content-center">
      <video
        className="w-100"
        style={{ maxWidth: '80vw', maxHeight: '70vh', borderRadius: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
        controls
      >
        <source src="/JuztDanceVideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </section>
);

export default JuztDanceVideo;
