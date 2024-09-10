export const extractFileName = (path) => {
  // If the path is a URL, create a URL object and extract the file name from the pathname.
  if (path.startsWith("http://") || path.startsWith("https://")) {
    const url = new URL(path);
    return url.pathname.split("/").pop();
  }

  // If it's just a file path, split by '/' and return the last element.
  return path.split("/").pop();
};
