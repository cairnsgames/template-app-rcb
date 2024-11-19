import React, { useState } from "react";
import { useFileSystem } from "../../context/FileSystemContext";
import {
  FileEarmark,
  Folder2, Folder2Open,
  Pencil,
  Plus,
  Trash,
} from "react-bootstrap-icons";
import { Button, ButtonGroup } from "react-bootstrap";
import FolderNameEditDialog from "./FolderNameEditDialog"; // Importing the FolderNameEditDialog

const FileTreeButton = ({ children, onClick }) => (
  <Button
    variant="light"
    size="sm"
    style={{
      color: "var(--bs-secondary)",
      padding: "0px 0.2rem",
      height: "1.5rem",
      float: "right",
    }}
    onClick={onClick}
  >
    {(Array.isArray(children) ? children : [children]).map((child) =>
      React.cloneElement(child, { key: child.props.id, size: "0.75rem" })
    )}
  </Button>
);

const FileTree = () => {
  const {
    currentDirectory,
    navigateToDirectory,
    expandedDirectory,
    getFilesInCurrentDirectory,
    selectFile,
    selectedFile,
  } = useFileSystem();
  
  const [showEditDialog, setShowEditDialog] = useState(false); // State for dialog visibility
  const [hoveredId, setHoveredId] = useState(null); // State for hovered directory or file

  const handleEditClick = (directory) => {
    selectFile(directory); // Select the folder
    setShowEditDialog(true); // Show the edit dialog
  };

  const renderDirectory = (directory) => {
    const isExpanded = expandedDirectory === directory.id;
    const isSelected = expandedDirectory === directory.id; // Check if the directory is selected
    const filesInDirectory = getFilesInCurrentDirectory();

    return (
      <div>
        <div
          onClick={() => navigateToDirectory(directory.id)}
          onMouseEnter={() => setHoveredId(directory.id)}
          onMouseLeave={() => setHoveredId(null)}
          style={{
            cursor: "pointer",
            fontWeight: "bold",
            backgroundColor: isSelected ? "#d3d3d3" : "transparent", 
          }}
        >
          {isSelected ? <Folder2Open size="1.25rem" className="mx-1" style={{ marginTop: "-1rem", marginRight:"0.25rem"}} /> : <Folder2 size="1.25rem" style={{ marginTop: "-1rem", marginRight:"0.25rem"}}/>} 
          <span style={{
            display: 'inline-block',
            maxWidth: 'calc(100% - 50px)', // Adjust based on button width
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}>
            {directory.name}
          </span>
          {hoveredId === directory.id && (
            <ButtonGroup style={{ float: "right" }}>
              <FileTreeButton onClick={() => handleEditClick(directory)}>
                <Pencil />
              </FileTreeButton>
              <FileTreeButton>
                <Plus />
              </FileTreeButton>
              {directory.files.length === 0 && (
                <FileTreeButton>
                  <Trash />
                </FileTreeButton>
              )}
            </ButtonGroup>
          )}
        </div>
        {directory.subdirectories &&
          Object.values(directory.subdirectories).map((subdir) => (
            <div key={subdir.id} style={{ paddingLeft: "0.5rem" }}>
              {renderDirectory(subdir)}
            </div>
          ))}
        {isExpanded &&
          filesInDirectory.map((file) => {
            const isFileSelected = selectedFile && selectedFile.id === file.id; // Check if the file is selected
            return (
              <div key={file.id} style={{ paddingLeft: "0.5rem" }}>
                <div
                  onClick={() => selectFile(file)}
                  onMouseEnter={() => setHoveredId(file.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: isFileSelected ? "#d3d3d3" : "transparent", // Highlight selected file
                  }}
                >
                  <FileEarmark size="1rem" style={{ marginTop: "-1rem", marginRight:"0.25rem"}} /> 
                  <span style={{
                    display: 'inline-block',
                    maxWidth: 'calc(100% - 50px)', // Adjust based on button width
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}>
                    {file.name}
                  </span>
                  {hoveredId === file.id && (
                    <FileTreeButton>
                      <Trash />
                    </FileTreeButton>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    );
  };

  const filesInRoot = getFilesInCurrentDirectory();

  return (
    <div className="filetree">
      <h3 className="text-secondary">File Structure</h3>
      {renderDirectory(currentDirectory)}
      {showEditDialog && <FolderNameEditDialog onClose={() => setShowEditDialog(false)} />} {/* Pass close function to dialog */}
    </div>
  );
};

export default FileTree;
