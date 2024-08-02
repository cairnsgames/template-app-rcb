export const combineUrlAndPath = (url, path) => {
  // Remove any trailing slash from the URL
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }

  // Remove any leading slash from the path
  if (path.startsWith("/")) {
    path = path.slice(1);
  }

  // Combine the URL and path with a single slash in between
  return `${url}/${path}`;
};
