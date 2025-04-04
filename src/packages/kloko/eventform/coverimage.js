import React from "react";
import { Form, InputGroup, Spinner } from "react-bootstrap";
import { combineUrlAndPath } from "../../../functions/combineurlandpath";

const CoverImage = ({ 
  imageUrl, 
  fileInputRef, 
  loading, 
  fileSelected, 
  fileData 
}) => {
  return (
    <div className="border p-2 my-3">
      <h3>Cover Image</h3>
      <Form.Group controlId="image">
        <Form.Label>
          Image <small>Displayed on home page</small>
        </Form.Label>
        <InputGroup>
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <>
              <Form.Control
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  fileSelected(e);
                }}
              />
            </>
          )}
        </InputGroup>
        {fileData || imageUrl ? (
          <img
            src={
              fileData ||
              combineUrlAndPath(process.env.REACT_APP_FILES, imageUrl)
            }
            alt="Preview"
            className="img-preview"
          />
        ) : null}
      </Form.Group>
    </div>
  );
};

export default CoverImage;
