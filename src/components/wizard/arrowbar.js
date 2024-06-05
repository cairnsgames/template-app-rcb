import React, { useState } from 'react';
import './customstyle.scss';
import { Button } from 'react-bootstrap';
import CustomButton from './custombutton';

const ArrowBar = () => {
  const [activeIndex, setActiveIndex] = useState(1);

  const handleButtonClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="arrow-bar-container">
      <CustomButton 
      variant={"primary"}
        className={`custom-button`} 
        onClick={() => handleButtonClick(0)}
      >
        Section 1
      </CustomButton>
      <CustomButton 
      variant={"secondary"} 
      className={`custom-button`}  
        onClick={() => handleButtonClick(1)}
      >
        Section 2
      </CustomButton>
      <CustomButton 
      variant={"primary"} 
      disabled
      className={`custom-button`} 
        onClick={() => handleButtonClick(2)}
      >
        Section 3
      </CustomButton>
      <Button 
      variant={"primary"} 
        disabled
        onClick={() => handleButtonClick(3)}
      >
        Section 4
      </Button>
    </div>
  );
};

export default ArrowBar;