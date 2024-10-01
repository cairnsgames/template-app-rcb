import React, { useState, useRef } from "react";
import { useUser } from "../auth/context/useuser";

import { videoMimeTypes, imageMimeTypes, validateExtension } from "./media";
import { combineUrlAndPath } from "../../functions/combineurlandpath";

const useFileLoader = (
  prefix = "FILE",
  onSuccess,
  onError,
  onProgress
) => {
  const { token } = useUser();
  const url = combineUrlAndPath(process.env.REACT_APP_CONTENT_API, `uploadfile.php?pre=${prefix}`);
  const [fileData, setFileData] = useState();
  const fileInputRef = useRef();
  const [file, setFile] = useState();
  const [percent, setPercent] = useState();
  const [loaded, setLoaded] = useState();
  const [total, setTotal] = useState();
  const [files, setFiles] = useState();
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(false);

  const isFileSelected = !!fileData;

  const getFileSpecForVideo = (file) => {
    let fileSpecInfo = {};
    var video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      fileSpecInfo = {
        name: file.name,
        size: file.size,
        height: video.videoHeight,
        width: video.videoWidth,
        type: file.type,
      };
      setFile(fileSpecInfo);
    };
    video.src = URL.createObjectURL(file);
  };
  const getFileSpecForImage = (file) => {
    let fileSpecInfo = {};
    var img = new Image();
    img.onload = function () {
      var sizes = {
        width: this.width,
        height: this.height,
      };
      URL.revokeObjectURL(this.src);
      fileSpecInfo = {
        name: file.name,
        size: file.size,
        height: sizes.height,
        width: sizes.width,
        type: file.type,
      };
      setFile(fileSpecInfo);
    };
    var objectURL = URL.createObjectURL(file);
    img.src = objectURL;
  };
  const getFileSpec = (file) => {
    if (validateExtension(file, videoMimeTypes)) {
      getFileSpecForVideo(file);
    } else if (validateExtension(file, imageMimeTypes)) {
      getFileSpecForImage(file);
    } else {
      setFile({});
    }
  };

  const fileSelected = (e) => {
    setStatus("");
    setFiles(e.target.files);
    setPercent(0);
    setLoaded(0);
    setTotal(0);
    setStatus("");

    const file1 = e.target.files[0];
    setFileData(URL.createObjectURL(file1));
    getFileSpec(file1);
  };

  const uploadFile = (files) => {
    return new Promise(function (resolve, reject) {
      setLoading(true);
      const file1 = files[0];

      var formData = new FormData();
      formData.append("files[]", files[0], files[0].name);
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
      xhr.open("POST", url);
      xhr.setRequestHeader("token", token);
      xhr.send(formData);
    });
  };

  const linkImage = (id, entity, entityid) => {
    fetch(combineUrlAndPath(process.env.REACT_APP_FILES,`files/${id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        entity: entity,
        entityid: entityid,
      }),
    });
  };

  function convertBytes(bytes) {
    if (!bytes) {
      return "No file selected";
    }
    if (bytes < 1024) {
      return bytes + " bytes";
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + " KB";
    } else if (bytes < 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    } else {
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    }
  }

  const ProgressHandler = (e) => {
    var percent = (e.loaded / e.total) * 100;
    setPercent(Math.round(percent));
    setLoaded(e.loaded);
    setTotal(e.total);
    
    console.log("Progress Handler", e.loaded, e.total, percent);
    if (onProgress) {
      onProgress(percent, e.loaded, e.total);
    }
  };

  const SuccessHandler = (e) => {
    const res = e.target.responseText;
    const response = JSON.parse(res);
    setStatus("File upload complete");
    setPercent(100);
    setLoaded(total);
    setLoading(false);
    if (onSuccess) {
      return onSuccess(response);
    }
    return response;
  };
  const ErrorHandler = () => {
    setLoading(false);
    if (onError) {
      onError();
    }
    setStatus("File upload failed");
  };
  const AbortHandler = () => {
    setLoading(false);
    setStatus("File upload aborted");
  };

  return {
    fileData,
    setFileData,
    fileInputRef,
    status,
    percent,
    loaded,
    total,
    file,
    url,
    fileSelected,
    uploadFile,
    convertBytes,
    linkImage,
    isFileSelected,
  };
};

// const FileUploaderPanel = (props) => {
//   const controller = props.controller;
//   const fileInputRef = useRef();
//   if (!controller) {
//     throw new Error("FileUploaderPanel must have a controller");
//   }
//   const {
//     file,
//     fileData,
//     isFileSelected,
//     status,
//     percent,
//     loaded,
//     total,
//     fileSelected,
//     convertBytes,
//   } = controller;

//   const Video = () => {
//     if (percent === 0 || percent === 100) {
//       return (
//         <video style={{ width: "100%" }} controls>
//           <source src={fileData} type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//       );
//     }
//     return (
//       <>
//         <span>Please wait while the video is uploaded.</span>
//       </>
//     );
//   };

//   return (
//     <Container fluid>
//       <Row className="fileupload mb-3">
//         <Col sm={6}>
//           <Button
//             variant="outline-primary"
//             onClick={() => fileInputRef.current.click()}
//           >
//             Select File
//           </Button>
//           <input
//             style={{ display: "none" }}
//             ref={fileInputRef}
//             type="file"
//             name="file"
//             onChange={fileSelected}
//           />
//         </Col>
//         <Col sm={6}>
//           <label>File progress:</label>
//           <ProgressBar
//             variant="primary"
//             style={{ width: "100%" }}
//             now={percent}
//             max="100"
//           />
//         </Col>
//       </Row>
//       <Row>
//         <Col>
//           {file?.name && <label>File: {file?.name}</label>}
//           {file?.size > 1024 * 1024 * 3 ? (
//             <Alert variant="danger">
//               File size is very large, and will therefore take a long time to
//               upload
//             </Alert>
//           ) : file?.size > 1024 * 512 ? (
//             <Alert variant="warning">
//               File size is large, will take a while to upload
//             </Alert>
//           ) : null}
//         </Col>
//       </Row>

//       {status && (
//         <Row>
//           <Col>{status}</Col>
//         </Row>
//       )}
//       <Row>
//         <Col xs={12} sm={6}>
//           {loaded > 0 && (
//             <div>
//               <div>{`Progress: ${percent}%`}</div>
//               <div>{`uploaded ${convertBytes(loaded)} bytes of ${convertBytes(
//                 total
//               )}`}</div>

//               <div>Total: {convertBytes(total ?? "")}</div>
//             </div>
//           )}
//         </Col>
//         <Col xs={12} sm={6}>
//           {!file?.name ? (
//             <div>No file selected</div>
//           ) : file?.name.includes("mp4") ? (
//             <Video />
//           ) : (
//             <img
//               style={{ width: "100%" }}
//               alt={"File upload Preview"}
//               src={fileData}
//             />
//           )}
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// const useFileUploader = (props) => {
//   const controller = useFileController(props);

//   const linkImage = controller.linkImage;
//   const upload = controller.uploadFile;
//   const isFileSelected = controller.isFileSelected;

//   const FileUploader = () => {
//     return (
//       <div>
//         <FileUploaderPanel controller={controller} />
//       </div>
//     );
//   };

//   return { linkImage, upload, isFileSelected, FileUploader };
// };

// export default useFileUploader;

export default useFileLoader;