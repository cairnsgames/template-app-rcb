import React from "react";
import { Form, InputGroup, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { combineUrlAndPath } from "../../../functions/combineurlandpath";

const CoverImage = ({ 
  imageUrl, 
  fileInputRef, 
  loading, 
  fileSelected, 
  fileData 
}) => {
  const { t } = useTranslation();

  return (
    <div className="border p-2 my-3">
      <h3>{t('coverImage.title')}</h3>
      <Form.Group controlId="image">
        <Form.Label>
          {t('coverImage.image')} <small>{t('coverImage.displayedOnHomePage')}</small>
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
            alt={t('coverImage.preview')}
            className="img-preview"
          />
        ) : null}
      </Form.Group>
    </div>
  );
};

export default CoverImage;
