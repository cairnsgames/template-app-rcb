import React, { useState, useRef } from "react";
import ContentEditable from "react-contenteditable";
import { ButtonGroup, Button, DropdownButton, Dropdown } from "react-bootstrap";
import showdown from "showdown";

const MarkdownEditor = ({text}) => {
  const [htmlContent, setHtmlContent] = useState(text);
  const contentEditableRef = useRef();

  const handleBold = () => {
    document.execCommand("bold");
  };

  const handleItalic = () => {
    document.execCommand("italic");
  };

  const handleHeader = (level) => {
    document.execCommand("formatBlock", false, `h${level}`);
  };

  const handleHighlight = (className) => {
    document.execCommand("hiliteColor", false, className);
  };

  const handleContentChange = (e) => {
    setHtmlContent(e.target.value);
  };

  const saveAsMarkdown = () => {
    const converter = new showdown.Converter();
    const markdown = converter.makeMarkdown(htmlContent);
  };

  return (
    <div>
      <ButtonGroup className="mb-2">
        <Button onClick={handleBold}>Bold</Button>
        <Button onClick={handleItalic}>Italic</Button>
        <DropdownButton as={ButtonGroup} title="Headers" id="bg-nested-dropdown">
          <Dropdown.Item onClick={() => handleHeader(1)}>H1</Dropdown.Item>
          <Dropdown.Item onClick={() => handleHeader(2)}>H2</Dropdown.Item>
          <Dropdown.Item onClick={() => handleHeader(3)}>H3</Dropdown.Item>
        </DropdownButton>
        <DropdownButton as={ButtonGroup} title="Highlight" id="bg-nested-dropdown-highlight">
          <Dropdown.Item onClick={() => handleHighlight("name")}>Name</Dropdown.Item>
          <Dropdown.Item onClick={() => handleHighlight("age")}>Age</Dropdown.Item>
        </DropdownButton>
      </ButtonGroup>

      <ContentEditable
        innerRef={contentEditableRef}
        html={htmlContent}
        disabled={false}
        onChange={handleContentChange}
        tagName="div"
        className="editable-content"
      />

      <Button variant="primary" onClick={saveAsMarkdown} className="mt-2">
        Save as Markdown
      </Button>
    </div>
  );
};

export default MarkdownEditor;
