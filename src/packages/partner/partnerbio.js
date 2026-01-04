import React from 'react';

function PartnerBio({ bio }) {
  const content = bio || null;
  if (!content) return null;

  return (
    <div className="pd-section pd-bio open">
      <div className="pd-section__header">
        <h3>About</h3>
      </div>
      <div className="pd-section__body">
        <div className="pd-bio__content">{content}</div>
      </div>
    </div>
  );
}

export default PartnerBio;
