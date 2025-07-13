import React, { useState, useEffect } from "react";
import {
  Form,
  InputGroup,
  Alert,
  Button,
  ProgressBar,
  Row,
  Col,
} from "react-bootstrap";
import { getImageSrc } from "../getimagesrc";
import { convertBytes } from "../media";
const MarkdownEditor = React.lazy(() => import("@uiw/react-markdown-editor"));
import { useTranslation } from "react-i18next";

const ImageEdit = (props) => {
  const { t } = useTranslation();
  const { item, setItem, style, className } = props;
  const {
    fileInputRef,
    file,
    setFile,
    fileSpecs,
    status,
    percent,
    total,
    loaded,
    fileSelected,
  } = props;

  const showImage = [1, 2, 4, 5, 7, 8, 9, 10].includes(item.type);
  const showHeader = [2, 3, 4, 7, 8, 9, 10].includes(item.type);
  const showText = [3, 5, 6, 7, 8, 9, 10].includes(item.type);

  return (
    <div className={className} style={style}>
      {showImage && (
        <>
          <div style={{ position: "relative" }}>
            <div
              className="p-2"
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "rgb(255,255,255,0.5)",
                height: "75px",
                width: "200px",
                borderRadius: "5px",
              }}
            >
              <ProgressBar now={percent} label={`${percent}%`} />
              <Row>
                <Col>{t('imageEdit.fileSize')}: {convertBytes(fileSpecs?.size)}</Col>
              </Row>
              {status && (
                <Row>
                  <Col>{t('imageEdit.status')}: {status}</Col>
                </Row>
              )}
            </div>
            {file ? (
              <img
                src={file}
                alt=""
                style={{ maxWidth: "100%" }}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = "images/noimage.png";
                }}
              />
            ) : (
              <img
                className={className}
                src={getImageSrc(item?.url)}
                alt={item?.title ?? `image ${id}`}
                style={{ maxWidth: "100%" }}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = "images/noimage.png";
                }}
              />
            )}
            <div style={{ position: "absolute", bottom: "10px", left: "10px" }}>
              <Button
                onClick={() => {
                  fileInputRef.current.click();
                }}
              >
                {t('imageEdit.chooseFile')}
              </Button>
            </div>
            <input
              type="file"
              name="file"
              ref={fileInputRef}
              onChange={fileSelected}
              style={{ display: "none" }}
            />
          </div>
          {fileSpecs?.size > 1024 * 1024 * 3 ? (
            <Alert variant="danger">
              {t('imageEdit.fileSizeDanger')}
            </Alert>
          ) : fileSpecs?.size > 1024 * 512 ? (
            <Alert variant="warning">
              {t('imageEdit.fileSizeWarning')}
            </Alert>
          ) : null}
        </>
      )}
      <h3>
        <InputGroup className="m-2">
          <InputGroup.Text>
            <h3>{t('imageEdit.display')}</h3>
          </InputGroup.Text>
          <Form.Select
            value={item.type}
            onChange={(ev) => {
              setItem({ ...item, type: Number(ev.target.value) });
            }}
          >
            <option value={1}>{t('imageEdit.imageOnly')}</option>
            <option value={8}>{t('imageEdit.imageWithDescription')}</option>
            <option value={4}>{t('imageEdit.overlayCard')}</option>
            <option value={3}>{t('imageEdit.plainText')}</option>
            <option value={5}>{t('imageEdit.markdownWithImage')}</option>
            <option value={6}>{t('imageEdit.markdownNoImage')}</option>
          </Form.Select>
        </InputGroup>
        {showHeader && (
          <InputGroup className="m-2">
            <InputGroup.Text>
              <h3>{t('imageEdit.title')}</h3>
            </InputGroup.Text>
            <Form.Control
              value={item.title}
              onChange={(ev) => {
                setItem({ ...item, title: ev.target.value });
              }}
              placeholder="image-title"
              aria-label="Title"
            />
          </InputGroup>
        )}
      </h3>
      {showText && (
        <MarkdownEditor
          value={item.content.replace(/\n/g, "\n")}
          onChange={(value, viewUpdate) => {
            setItem({ ...item, content: value });
          }}
        />
      )}
    </div>
  );
};

export default ImageEdit;
