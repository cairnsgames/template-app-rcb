import React, { useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import './customStyles.css'; // Make sure to import the CSS file

const CustomButton = (props) => {
  const { variant, children } = props;
  const buttonRef = useRef(null);

  useEffect(() => {
    if (buttonRef.current) {
      const buttonColor = getComputedStyle(buttonRef.current).backgroundColor;
      buttonRef.current.style.setProperty('--arrow-color', buttonColor);
    }
  }, [variant]); // Re-run effect if variant changes

  return (
    <Button ref={buttonRef}  {...props} className={`custom-button ${props.className}`}>
      {children}
    </Button>
  );
};

export default CustomButton;
