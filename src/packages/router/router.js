import React from "react";
import Route from "./route";
import Default from "./default";

// Function to check if a path matches a specific pattern
function checkIs(path, pattern) {
  // Remove the hash symbol if present
  let sanitizedPath = path.replace(/^#/, "");

  // Exclude characters after '?' if they exist
  sanitizedPath = sanitizedPath.split("?")[0];

  const regex = new RegExp(`^${pattern.replace(/{.*?}/g, ".*")}$`);
  return regex.test(sanitizedPath);
}

// Function to check if a path starts with a specific pattern
function checkStartsWith(path, pattern) {
  const sanitizedPath = path.replace(/^#/, "");
  const regex = new RegExp(`^${pattern.replace(/{.*?}/g, ".*")}`);
  return regex.test(sanitizedPath);
}

function extractNamesAndValues(url, template) {
  if (!url) {
    url = window.location.href;
  }
  if (!template) {
    template = "";
  }
  // Splitting the URL into path and query parts
  const urlParts = url.split("?");
  const path = urlParts[0]; // Path part of the URL
  const queryString = urlParts[1]; // Query part of the URL

  // Splitting path and template into parts
  const pathParts = path.split("/");
  const templateParts = template.split("/");

  if (pathParts.length !== templateParts.length) {
    // console.error("Path and template lengths do not match.", pathParts, templateParts);
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

const Router = (props) => {
  let { path, children, ...restProps } = props;
  const isLoggedIn = props.isLoggedIn || false;
  const routes = React.Children.toArray(children);
  if (!path) {
    path = window.location.hash;
  }

  const findFirstRoute = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      if (route.type === Route) {
        const is = route.props.hasOwnProperty("is")
          ? checkIs(path, route.props.is)
          : true;
        const startsWith = route.props.hasOwnProperty("startsWith")
          ? checkStartsWith(path, route.props.startsWith)
          : true;
        const ifTrue = route.props.hasOwnProperty("if") ? route.props.if : true;
        const andTrue = route.props.hasOwnProperty("and")
          ? route.props.and
          : true;
        const auth = route.props.hasOwnProperty("auth") ? isLoggedIn : true;
        if (route.props.debug) {
        }
        if (is && startsWith && ifTrue && andTrue && auth) {
          const pathParams = extractNamesAndValues(path, route.props.is);
          
          return <Route children={route.props.children} {...pathParams} {...restProps} />;
        }
      } else {
        return <>{route}</>;
      }
    }
    return null;
  };

  return <>{findFirstRoute(routes)}</>;
};

export { Route, Default, checkIs as is, checkStartsWith as startsWith, extractId, extractNamesAndValues };
export default Router;
