import React from 'react';
import NotiElfImage from '../../../public/NotiElf.png'; // Adjust the path as necessary
import './SelectAFile.css'; // Assuming a CSS file for styling

const SelectAFile = () => {
  return (
    <div className="select-a-file-container text-center mt-5">
      <img src={NotiElfImage} alt="NotiElf" style={{ width: '200px' }} />
      <div className="speech-bubble">
        <h5>Select a file from the left</h5>
      </div>
    </div>
  );
};

export default SelectAFile;
