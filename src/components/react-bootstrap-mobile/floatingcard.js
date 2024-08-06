import React, { useEffect, useState } from 'react';
import './floatingcard.scss';

const FloatingCard = ({ image, children, onClick, className, ...props }) => {
  const [isDarkText, setIsDarkText] = useState(false);
  const [shudder, setShudder] = useState(false);
  const [swell, setSwell] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let totalLuminance = 0;

      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];

        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        totalLuminance += luminance;
      }

      const averageLuminance = totalLuminance / (imageData.data.length / 4);
      setIsDarkText(averageLuminance > 128);
    };

    // Trigger shudder effect when the card is first displayed
    setShudder(true);
    setTimeout(() => setShudder(false), 300);
  }, [image]);

  const handleMouseEnter = () => {
    setShudder(true);
    setTimeout(() => setShudder(false), 300); // Remove shudder class after animation
  };

  const handleClick = () => {
    // Trigger the swell animation
    setSwell(true);
    setTimeout(() => {
      setSwell(false); // Reset swell state after animation

      // Call the onClick callback after the swell animation
      if (onClick) onClick();
    }, 300); // Duration of the swell animation
  };

  return (
    <div
      className={`floating-card ${isDarkText ? 'dark-text' : 'light-text'} ${shudder ? 'shudder' : ''} ${swell ? 'swell' : ''} ${className}`}
      onMouseEnter={handleMouseEnter} // Trigger shudder on hover
      onClick={handleClick}
      {...props}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e);
        }
      }}
      tabIndex={0}
    >
      <div className="floating-card-image" style={{ backgroundImage: `url(${image})` }}>
        {children}
      </div>
    </div>
  );
};

FloatingCard.Header = ({ children }) => <div className="floating-card-header">{children}</div>;

FloatingCard.Body = ({ children }) => <div className="floating-card-body">{children}</div>;

FloatingCard.Footer = ({ children }) => <div className="floating-card-footer">{children}</div>;

export default FloatingCard;
