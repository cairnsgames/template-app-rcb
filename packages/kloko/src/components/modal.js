import React from 'react';
import './modal.css'; // Import the CSS file for styling

const Modal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="kloko-modal-overlay" onClick={onClose}>
      <div className="kloko-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="kloko-modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
