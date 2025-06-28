import React, { useState } from "react";
import { CloseButton } from "react-bootstrap";
import "./div.scss";

const Div = ({ children, onHide, className, style, ...props }) => {
  const [isRendered, setIsRendered] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  const handleAnimationEnd = () => {
    if (!isVisible) {
      setIsRendered(false);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation(); // Prevent click event propagation
    setIsVisible(false);
    if (onHide) {
      setTimeout(() => {
        onHide();
      }, 300); // Wait for the animation to finish
    }
  };

  if (!isRendered) return null;

  return (
    <div
      className={`div-container ${!isVisible ? "hidden" : ""} ${className}`}
      style={style}
      onTransitionEnd={handleAnimationEnd}
      {...props}
    >
      {children}
      {onHide && (
        <CloseButton
          onClick={handleClose}
          className="close-button pe-3 pt-2"
          style={{ zIndex: 100 }}
        />
      )}
    </div>
  );
};

export default Div;
