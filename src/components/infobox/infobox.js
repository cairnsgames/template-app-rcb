// src/components/infobox/infobox.jsx

import React, { useState, Children, cloneElement } from 'react';
import { Plus, Dash } from 'react-bootstrap-icons';
import './infobox.scss';

const InfoBox = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleBox = () => setIsOpen(!isOpen);

  const enhancedChildren = Children.map(children, child => {
    if (child.type === InfoBox.Header) {
      return cloneElement(child, { isOpen, toggleBox });
    }
    if (child.type === InfoBox.Body) {
      return cloneElement(child, { isOpen });
    }
    return child;
  });

  return <div className="infobox">{enhancedChildren}</div>;
};

const Header = ({ children, isOpen, toggleBox, variant = 'primary', className = '', style = {} }) => (
  <div
    className={`infobox-header bg-${variant} ${className}`}
    onClick={toggleBox}
    style={style}
    role="button"
    tabIndex={0}
    onKeyPress={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        toggleBox();
      }
    }}
    aria-expanded={isOpen}
  >
    <span className="toggle-icon">
      {isOpen ? <Dash /> : <Plus />}
    </span>
    <span>{children}</span>
  </div>
);

const Body = ({ children, isOpen, className = '', style = {} }) => (
  <div className={`infobox-body ${isOpen ? 'open' : ''} ${className}`} style={style}>
    {children}
  </div>
);

InfoBox.Header = Header;
InfoBox.Body = Body;

export default InfoBox;
