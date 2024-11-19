import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useFileSystem } from '../../context/FileSystemContext';
import NotiElfImage from '../../../public/NotiElf.png'; // Adjust the path as necessary
import './SelectAFile.css'; // Assuming a CSS file for styling
import './FolderNameEditDialog.css'; // New CSS file for dialog styling

const FolderNameEditDialog = ({ onClose }) => {
  const { currentDirectory, updateFolderName } = useFileSystem();
  const [newFolderName, setNewFolderName] = useState(currentDirectory ? currentDirectory.name : '');

  console.log("Expanded directory", currentDirectory);


  const handleChange = (e) => {
    setNewFolderName(e.target.value);
  };

  const handleSubmit = () => {
    if (newFolderName) {
      updateFolderName(newFolderName);
      setNewFolderName(''); // Clear input after submission
      onClose(); // Close the dialog after submission
    }
  };

  return (
    <div className="dialog-backdrop">
      <div className="elf-dialog d-flex align-items-start">
        <img src={NotiElfImage} alt="NotiElf" className="elf-image" />
        <div className="dialog-bubble ms-3 d-flex flex-column">
          <h5>Edit Folder Name</h5>
          <input
            type="text"
            value={newFolderName}
            onChange={handleChange}
            placeholder="Enter new folder name"
            className="form-control"
          />
          <footer className="dialog-footer d-flex justify-content-end mt-auto">
            <Button onClick={handleSubmit} variant="primary" className="me-2">Submit</Button>
            <Button onClick={onClose} variant="secondary">Cancel</Button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default FolderNameEditDialog;
