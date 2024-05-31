export const videoMimeTypes = [
  "video/x-flv",
  "video/x-ms-wmv",
  "video/x-msvideo",
  "video/quicktime",
  "video/3gpp",
  "video/MP2T",
  "application/x-mpegURL",
  "video/mp4",
];

export const imageMimeTypes = [
  "image/webp",
  "image/tiff",
  "image/svg+xml",
  "image/png",
  "image/jpeg",
  "image/vnd.microsoft.icon",
  "image/gif",
  "image/bmp",
];

export const convertBytes = (bytes) => {
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
};

export const validateExtension = (file, allowedExtensions = []) => {
  return allowedExtensions.includes(file.type);
};

const Media = (props) => {
  const { style, alt, src } = props;

  if (src.includes("mp4")) {
    return (
      <video style={style} controls>
        <source src={src} />
      </video>
    );
  }
  return (
    <img
      style={style}
      alt={alt}
      src={src}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null; 
        currentTarget.src = "images/noimage.png";
      }}
    />
  );
};

export default Media;
