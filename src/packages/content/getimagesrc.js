export const getImageSrc = (src) => {
    if (src?.includes("blob")) {
      return src;
    }
    if (!src) {
      return "images/noimage.png";
    }
    return `${process.env.REACT_APP_FILES}${src}`;
  }

