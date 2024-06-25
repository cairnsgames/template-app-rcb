import React from "react";
import Route from "./route";
import Default from "./default";

// Function to check if a path matches a specific pattern
function is(path, pattern) {
  // Remove the hash symbol if present
  let sanitizedPath = path.replace(/^#/, "");
  
  // Exclude characters after '?' if they exist
  sanitizedPath = sanitizedPath.split('?')[0];
  
  const regex = new RegExp(`^${pattern.replace(/{.*?}/g, ".*")}$`);
  return regex.test(sanitizedPath);
}

// Function to check if a path starts with a specific pattern
function startsWith(path, pattern) {
  const sanitizedPath = path.replace(/^#/, "");
  const regex = new RegExp(`^${pattern.replace(/{.*?}/g, ".*")}`);
  return regex.test(sanitizedPath);
}

function extractNamesAndValues(url, template) {
  // Splitting the URL into path and query parts
  const urlParts = url.split("?");
  const path = urlParts[0]; // Path part of the URL
  const queryString = urlParts[1]; // Query part of the URL

  // Splitting path and template into parts
  const pathParts = path.split("/");
  const templateParts = template.split("/");

  if (pathParts.length !== templateParts.length) {
    console.error("Path and template lengths do not match.");
    return null;
  }

  const result = {};
  
  // Extracting path parameters from the template
  for (let i = 0; i < templateParts.length; i++) {
    const templatePart = templateParts[i];
    if (templatePart.startsWith("{") && templatePart.endsWith("}")) {
      const name = templatePart.slice(1, -1);
      const value = pathParts[i];
      result[name] = value;
    }
  }

  // Handling query parameters
  if (queryString) {
    const queryParams = new URLSearchParams(queryString);
    queryParams.forEach((value, key) => {
      result[key] = value;
    });
  }

  return result;
}

// Function to extract the ID from a path
function extractId(path, pattern) {
  const sanitizedPath = path.replace(/^#/, "");
  const regex = new RegExp(`^${pattern.replace(/{.*?}/g, "(.*?)")}$`);
  const match = sanitizedPath.match(regex);
  return match ? match[1] : null;
}

const Router = ({ path, children }) => {
  const routes = React.Children.toArray(children);
  if (!path) {
    path = window.location.hash;
  }

  const findFirstRoute = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      if (route.type === Route) {
        if (route.props.is && is(path, route.props.is)) {
          const pathParams = extractNamesAndValues(path, route.props.is);
          return <Route {...route.props} {...pathParams} />;
        }
        if (
          route.props.startsWith &&
          startsWith(path, route.props.startsWith)
        ) {
          return <Route {...route.props} />;
        }

        if (route.props.if) {
          return <Route {...route.props} />;
        }
      } else {
        return <>{route}</>;
      }
    }
    return null;
  };

  return <>{findFirstRoute(routes)}</>;
};

export { Route, Default, is, startsWith, extractId, extractNamesAndValues };
export default Router;
