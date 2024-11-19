import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Heading } from "@tiptap/extension-heading";
import { Bold } from "@tiptap/extension-bold";
import { Italic } from "@tiptap/extension-italic";
import { ListItem } from "@tiptap/extension-list-item";
import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { Button, ButtonGroup } from "react-bootstrap";
import {
  ListOl,
  ListUl,
  TypeBold,
  TypeH1,
  TypeH2,
  TypeItalic,
  Type,
} from "react-bootstrap-icons";
import EditableHeader from './EditableHeader'; // Importing EditableHeader
import { useFileSystem } from "../../context/FileSystemContext";

const Editor = ({ content, onChange, filename }) => {
  const { selectedFile, updateFileName } = useFileSystem();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Paragraph,
      Heading,
      Bold,
      Italic,
      ListItem,
      BulletList,
      OrderedList,
      HorizontalRule,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleClick = () => {
    editor?.commands.focus();
  };

  const formatText = (command, options) => {
    editor?.commands[command](options);
  };

  return (
    <div
      className="editor-wrapper"
      style={{ flexGrow: 1 }}
    >
      <EditableHeader value={selectedFile?.name} onChange={(e) => updateFileName(e.target.value)} /> 
      <div>
        <ButtonGroup className="mb-2 me-2">
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => formatText("toggleBold")}
          >
            <TypeBold />
          </Button>
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => formatText("toggleItalic")}
          >
            <TypeItalic />
          </Button>
        </ButtonGroup>
        <ButtonGroup className="mb-2 me-2">
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => formatText("setParagraph")}
          >
            <Type />
          </Button>
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => formatText("setHeading", { level: 1 })}
          >
            <TypeH1 />
          </Button>
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => formatText("setHeading", { level: 2 })}
          >
            <TypeH2 />
          </Button>
        </ButtonGroup>
        <ButtonGroup className="mb-2 me-2">
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => formatText("toggleBulletList")}
          >
            <ListUl />
          </Button>
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => formatText("toggleOrderedList")}
          >
            <ListOl />
          </Button>
        </ButtonGroup>
      </div>
      <EditorContent className="editor" editor={editor} />
    </div>
  );
};

export default Editor;
