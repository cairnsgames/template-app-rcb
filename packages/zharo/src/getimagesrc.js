import { combineUrlAndPath } from "../../../src/functions/combineurlandpath";

export const getImageSrc = (src) => {
    if (src?.includes("blob")) {
      return src;
    }
    if (!src) {
      return combineUrlAndPath(process.env.REACT_APP_FILES,`noimage.png`);
    }
    return combineUrlAndPath(process.env.REACT_APP_FILES,src);
  }

