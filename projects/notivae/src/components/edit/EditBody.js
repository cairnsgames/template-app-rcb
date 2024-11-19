import React, { useState, useEffect } from "react";
import Editor from "./Editor";
import Layout from "../Layout/Layout";
import FileTree from "./FileTree"; // Importing the FileTree component
import { useFileSystem } from "../../context/FileSystemContext"; // Importing the context
import Chat from "../chat/Chat";
import SelectAFile from "./SelectAFile"; // Importing the SelectAFile component
import "./editor.scss";

const EditBody = () => {
  const { selectedFile, updateFileContent } = useFileSystem(); // Accessing the selected file and update function from context
  const [content, setContent] = useState(
    selectedFile ? selectedFile.content : "Select a file"
  );
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  console.log("Selected file", selectedFile);

  useEffect(() => {
    if (selectedFile) {
      setContent(selectedFile.content);
    }
  }, [selectedFile]);

  const handleContentChange = (newContent) => {
    setContent(newContent);
    if (selectedFile) {
      updateFileContent(newContent); // Update the selected file content in context
    }
  };

  return (
    <Layout className="editor-wrapper">
      <Layout.Left>
        <FileTree />
      </Layout.Left>
      <Layout.Right className="editor-wrapper">
        {selectedFile ? (
          <Editor
            content={content}
            onChange={handleContentChange}
            filename={selectedFile ? selectedFile.name : "No file selected"}
          />
        ) : (
          <SelectAFile
            show={true}
            handleClose={() => setShowModal(false)}
          />
        )}
        <Chat />
      </Layout.Right>
    </Layout>
  );
};

export default EditBody;
