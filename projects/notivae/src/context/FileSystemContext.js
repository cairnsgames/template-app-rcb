import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context for the file system
const FileSystemContext = createContext();

// File System Provider component
export const FileSystemProvider = ({ children }) => {
  const [filesCache, setFilesCache] = useState([
    {
      id: 1,
      name: "My Christmas wish list",
      content: "<p>This is the content of file1.</p>",
    },
    {
      id: 2,
      name: "file2.txt",
      content: "<p>This is the content of file2.</p>",
    },
    {
      id: 3,
      name: "file3.txt",
      content: "<p>This is the content of file3.</p>",
    },
    {
      id: 4,
      name: "file4.txt",
      content: "<p>This is the content of file4.</p>",
    },
    {
      id: 5,
      name: "file5.txt",
      content: "<p>This is the content of file5.</p>",
    },
    {
      id: 6,
      name: "file6.txt",
      content: "<p>This is the content of file6.</p>",
    },
    {
      id: 7,
      name: "file7.txt",
      content: "<p>This is the content of file7.</p>",
    },
  ]);

  const [directoryTree, setDirectoryTree] = useState({
    root: {
      id: 0,
      name: "root",
      files: [1, 2], // Store only file IDs
      subdirectories: {
        folder1: {
          id: 1000001,
          name: "folder1",
          files: [3], // Store only file IDs
          subdirectories: {
            folder3: {
              id: 1000002,
              name: "folder3",
              files: [7], // Store only file IDs
              subdirectories: {},
            },
            folder4: {
              id: 1000004,
              name: "Empty",
              files: [], // Store only file IDs
              subdirectories: {},
            },
          },
        },
        folder2: {
          id: 1000003,
          name: "folder2",
          files: [4, 5, 6], // Store only file IDs
          subdirectories: {},
        },
      },
    },
  });

  const [currentDirectory, setCurrentDirectory] = useState(directoryTree.root);
  const [expandedDirectory, setExpandedDirectory] = useState(0); // Set default expanded directory to root
  const [selectedFile, setSelectedFile] = useState(null); // State for selected file

  const navigateToDirectory = (directoryId) => {
    if (directoryId === 0) {
      setExpandedDirectory(0);
    } else {
      const subdirectory = findSubdirectoryById(currentDirectory, directoryId);
      if (subdirectory) {
        setExpandedDirectory(directoryId);
      }
    }
  };

  const findSubdirectoryById = (directory, directoryId) => {
    if (directory.id === directoryId) return directory;
    for (const subdir of Object.values(directory.subdirectories)) {
      const found = findSubdirectoryById(subdir, directoryId);
      if (found) return found;
    }
    return null;
  };

  const getFilesInCurrentDirectory = () => {
    const directory = findSubdirectoryById(currentDirectory, expandedDirectory);
    return directory
      ? directory.files
          .map((fileId) => {
            return filesCache.find((file) => file.id === fileId);
          })
          .filter(Boolean)
      : [];
  };

  const selectFile = (file) => {
    setSelectedFile(file); // Set the selected file
  };


  const updateFileContent = (newContent) => {
    setFilesCache((prevFiles) =>
      prevFiles.map((file) =>
        file.id === selectedFile.id ? { ...file, content: newContent } : file
      )
    );
  };

  const updateFileName = (newName) => {
    setSelectedFile((prevFile) => ({
      ...prevFile,
      name: newName,
    }));
    setFilesCache((prevFiles) =>
      prevFiles.map((file) =>
        file.id === selectedFile.id ? { ...file, name: newName } : file
      )
    );
  };

  const updateFolderName = (newName) => {
    setCurrentDirectory((prevDirectory) => ({
      ...prevDirectory,
      name: newName,
    }));
  };

  return (
    <FileSystemContext.Provider
      value={{
        directoryTree,
        currentDirectory,
        navigateToDirectory,
        getFilesInCurrentDirectory,
        selectFile, // Provide selectFile method
        selectedFile, // Provide selectedFile state
        expandedDirectory,
        updateFileContent, // Provide updateFileContent method
        updateFileName, // Provide updateFileName method
        updateFolderName, // Provide updateFolderName method
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};

// Custom hook to use the FileSystemContext
export const useFileSystem = () => {
  return useContext(FileSystemContext);
};
