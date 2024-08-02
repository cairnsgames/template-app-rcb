import React, { useState, useEffect } from "react";
import PageFull from "../parts/pagelayouts/pagefull";
import ContentItem from "../packages/content/contentitem";
import { InputGroup, Form, Button } from "react-bootstrap";

const ContentPage = (props) => {
  const [contentid, setContentid] = useState(props.id ?? 4);
  const [id, setid] = useState(props.id ?? 4);

  const customType = (content) => {
    if (content.type === "tickets") {
      return (
        <div>
          <h1>Tickets</h1>
        </div>
      );
    }
  };

  useEffect(() => {
    console.log("ID Changed", id)
  }, [id]);

  return (
    <PageFull>
      <div style={{ padding: "1rem", border: "1px solid green" }}>
        <h1>Choose Content</h1>
        <InputGroup className="mb-3">
          <Form.Control
            value={contentid}
            onChange={(e) => setContentid(e.target.value)}
            placeholder="Content Id"
          />
          <Button
            onClick={() => {
              window.location.hash = `pagecontent/${contentid}`;
              setid(contentid);
            }}
          >
            Show
          </Button>
        </InputGroup>
      </div>
      <div className="pt-3" style={{ position: "relative" }}>
        <ContentItem id={id} customType={customType} />
      </div>
    </PageFull>
  );
};

export default ContentPage;
