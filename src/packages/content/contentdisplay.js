import React, { useState, useEffect, useMemo, useRef } from "react";
import { Pencil, Save, Eye, X, EyeSlash } from "react-bootstrap-icons";
import { Alert, Button, ButtonGroup } from "react-bootstrap";
import OverlayCard from "./display/overlaycard";
import Tracker from "../tracker/tracker";
import Layout from "./layout";
import ImageOnly from "./display/imageonly";
import VideoOnly from "./display/videoonly";
import PlainText from "./display/plaintext";
import Markdown from "./display/markdown";
import Link from "./display/link";
import ImageDescription from "./display/imagedescription";
import ImageEdit from "./edit/imageedit";
import useTenant from "../tenant/context/usetenant";
import useUser from "../auth/context/useuser";
import { getImageSrc } from "./getimagesrc";

/* Item Types
    1. Image
    2. Video
    3. Content
    4. Overlay Card
    5. Markdown View
    6. Editable Markdown
    7. Link
*/

// TODO: Allow advanced Styling

const contentType = (type) => {
  switch (type) {
    case 1:
      return "Image";
    case 2:
      return "Video";
    case 3:
      return "Content";
    case 4:
      return "Overlay Card";
    case 5:
      return "Markdown with Image";
    case 6:
      return "Editable without Image";
    case 10:
      return "Editable with Video";
    case 7:
      return "Link";
    case 8:
      return "Image and Description";
    case 9:
      return "Video and Description";
    case 99:
      return "Layout";
    default:
      return "Unknown";
  }
};

const ContentDisplay = (props) => {
  const { style, as, prefix = "FILE", customType } = props;
  const [edit, setEdit] = useState();
  const [preview, setPreview] = useState(false);
  const [item, setItem] = useState(props.item);
  const { user, token } = useUser();
  const { tenant } = useTenant();

  const [file, setFile] = React.useState();
  const [fileSpecs, setFileSpecs] = useState();
  const [percent, setPercent] = useState(0);
  const [loaded, setLoaded] = useState();
  const [total, setTotal] = useState();
  const [status, setStatus] = useState();
  const fileInputRef = useRef();

  useEffect(() => {
    if (!props.item?.user_id) {
      setEdit(true);
    }
  }, []);

  useEffect(() => {
    if (props.item) {
      setItem(props.item);
    }
  }, [props]);

  const fileSelected = () => {
    const file = fileInputRef.current.files[0];
    setFile(URL.createObjectURL(file));
    setStatus("File selected");
    setItem({ ...item, url: URL.createObjectURL(file) });
   
    var fileSize = file.size;
    var img = new Image();
    img.onload = function () {
      var sizes = {
        width: this.width,
        height: this.height,
      };
      URL.revokeObjectURL(this.src);
      const fileSpecInfo = {
        name: file.name,
        size: file.size,
        height: sizes.height,
        width: sizes.width,
        type: file.type,
      };
      setFileSpecs(fileSpecInfo);
    };
    var objectURL = URL.createObjectURL(file);
    img.src = objectURL;
  };

  const uploadFile = () => {
    if (!(fileInputRef?.current?.files?.length > 0)) {
      return new Promise(function (resolve, reject) {
        resolve({ filename: item.url });
      });
    }

    return new Promise(function (resolve, reject) {
      const file1 = fileInputRef.current.files[0];

      var formData = new FormData();
      formData.append(
        "files[]",
        fileInputRef.current.files[0],
        fileInputRef.current.files[0].name
      );
      var xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", ProgressHandler, false);
      xhr.addEventListener(
        "load",
        (e) => {
          resolve(SuccessHandler(e));
        },
        false
      );
      xhr.addEventListener(
        "error",
        (e) => {
          ErrorHandler(e);
          reject();
        },
        false
      );
      xhr.addEventListener(
        "abort",
        (e) => {
          AbortHandler(e);
          reject();
        },
        false
      );

      const url = `${process.env.REACT_APP_CONTENT_API}/uploadfile.php?pre=${prefix}`;
      xhr.open("POST", url);
      xhr.setRequestHeader("token", token);
      xhr.send(formData);
    });
  };

  const ProgressHandler = (e) => {
    var percent = (e.loaded / e.total) * 100;
    setPercent(Math.round(percent));
    setLoaded(e.loaded);
    setTotal(e.total);
  };

  const SuccessHandler = (e) => {
    const res = e.target.responseText;
    const response = JSON.parse(res);
    setStatus("File upload complete".response);
    setPercent(100);
    setLoaded(total);
    return response;
  };
  const ErrorHandler = () => {
    setStatus("File upload failed");
  };
  const AbortHandler = () => {
    setStatus("File upload aborted");
  };

  const saveItem = async () => {
    const newfile = await uploadFile();
    const fileName = newfile.filename;
    if (fileName) {
      setItem({ ...item, url: fileName });
    }
    const saveItemData = {
      ...item,
      url: fileName,
      style: JSON.stringify(item.style),
    };
    fetch(combineUrlAndPath(process.env.REACT_APP_CONTENT_API,`api.php/content/${item?.id ?? ""}`), {
      method: item.id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
        APP_ID: tenant,
        token: token,
      },
      body: JSON.stringify(saveItemData),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setEdit(false);
      });
  };

  const editFields = useMemo(() => {
    return {
      fileInputRef,
      fileSelected,
      item,
      setItem,
      saveItem,
      file,
      setFile,
      fileSpecs,
      setFileSpecs,
      status,
      setStatus,
      percent,
      total,
      loaded,
    };
  }, [
    fileInputRef,
    fileSelected,
    item,
    setItem,
    saveItem,
    file,
    setFile,
    fileSpecs,
    setFileSpecs,
    status,
    setStatus,
    percent,
    total,
    loaded,
  ]);

  return (
    <Tracker itemtype="content" id={props.id ?? props.contentid ?? props.item.id ?? props.item.contentid}>
      <div style={{ position: "relative" }}>
        {user && user?.id === item?.user_id && (
          <>
            {(edit || !item.id) && (
              <Alert style={{ ...style, height: "50px" }} variant="info">
                <span style={{ fontSize: "20px", fontWeight: "600" }}>
                  Editing
                </span>{" "}
                {preview && <>Previewing Changes</>}
                <ButtonGroup
                  style={{ position: "absolute", top: "5px", right: "20px" }}
                >
                  <Button
                    variant="light"
                    onClick={() => {
                      setEdit(false);
                      setPreview(false);
                      setItem(props.item);
                    }}
                  >
                    <X />
                  </Button>
                  {(edit || !item.id) && (
                    <Button onClick={() => saveItem()}>
                      <Save />
                    </Button>
                  )}
                  {(edit || !item.id) && (
                    <Button onClick={() => setPreview(!preview)}>
                      {preview ? <EyeSlash /> : <Eye />}
                    </Button>
                  )}
                </ButtonGroup>
              </Alert>
            )}
            {(!edit && item.id) && (
              <Button
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  zIndex: 99,
                }}
                variant="light"
                onClick={() => {
                  setEdit(!edit);
                }}
              >
                {!edit ? <Pencil /> : <X />}
              </Button>
            )}
          </>
        )}
        {(as ?? item?.type) === 1 &&
          ((edit || !item.id) && !preview ? (
            <ImageEdit {...props} {...editFields} />
          ) : (
            <ImageOnly {...props} item={item} setItem={setItem} />
          ))}
        {item?.type === 2 && <VideoOnly {...props} />}
        {(as ?? item?.type) === 3 &&
          ((edit || !item.id) && !preview ? (
            <ImageEdit {...props} {...editFields} />
          ) : (
            <PlainText {...props} />
          ))}
        {(as ?? item?.type) === 4 &&
          ((edit || !item.id) && !preview ? (
            <ImageEdit {...props} {...editFields} />
          ) : (
            <OverlayCard
              itemtype="content"
              id={item.id}
              title={item.title}
              src={getImageSrc(item?.url)}
              style={{ ...item.style }}
              className
            />
          ))}
        {(item?.type === 5 || item?.type === 6) &&
          ((edit || !item.id) && !preview ? (
            <ImageEdit {...props} {...editFields} />
          ) : (
            <Markdown {...props} item={item} />
          ))}
        {item?.type === 7 && <Link {...props} />}
        {(as ?? item?.type) === 8 &&
          ((edit || !item.id) && !preview ? (
            <ImageEdit {...props} {...editFields} />
          ) : (
            <ImageDescription {...props} item={item} />
          ))}
        {item?.type === 99 && (
          <Layout props={props} customType={customType} />
        )}
      </div>
    </Tracker>
  );
};

export default ContentDisplay;
