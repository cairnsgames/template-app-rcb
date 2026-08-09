import { useState, useEffect } from "react";

export type LocationParam = {
  key: string;
  value: string;
};

export type LocationDetails = {
  href: string;
  hash: string;
  params: LocationParam[];
  hostname: string;
  port: string;
  pathname: string;
  path: string[];
  protocol: string;
  set: (url: string) => void;
};

export const loadURLDetails = (valid?: string[]): LocationDetails => {
  let hash = window.location.hash;
  hash = hash.split("?")[0].replace("#", "");

  const myURL = new URL(window.location.href);
  if (window.location.hash) {
    myURL.search = window.location.hash.substr(
      window.location.hash.indexOf("?")
    );
  }
  const hrefparams: LocationParam[] = [];
  myURL.searchParams.forEach((value, key) => {
    if (!valid || valid.includes(key)) {
      hrefparams.push({ key, value });
    }
  });

  return {
    href: window.location.href,
    hash: hash,
    params: hrefparams,
    hostname: window.location.hostname,
    port: window.location.port,
    pathname: window.location.pathname,
    path: window.location.pathname.split(/\//).filter((x) => x !== ""),
    protocol: window.location.protocol,
    set: (url: string) => {},
  };
};

export const useLocation = (valid?: string[]) => {
  const [details, setDetails] = useState<LocationDetails>(loadURLDetails(valid));
  const [validParams] = useState(valid);

  const popstate = () => {
    setDetails(loadURLDetails(validParams));
  };
  const locationchange = () => {
    setDetails(loadURLDetails(validParams));
  };

  useEffect(() => {
    window.addEventListener("popstate", popstate);
    window.addEventListener("locationchange", locationchange);
    return () => {
      window.removeEventListener("popstate", popstate);
      window.removeEventListener("locationchange", locationchange);
    };
  }, []);

  const set = (url: string, parms?: Record<string, string>) => {
    if (parms) {
      url += "?" + new URLSearchParams(parms).toString();
    }
    window.history.pushState(null, "", url);
    setDetails(loadURLDetails(validParams));
  };

  const setHash = (hash: string, parms?: Record<string, string>) => {
    let url = `#${hash}`;
    if (parms) {
      url += "?" + new URLSearchParams(parms).toString();
    }
    set(url);
  };

  // will go back 1 url, or go to the fallback if none available. use fallback to go to previous logical screen
  const back = (fallback = "/") => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = fallback;
    }
  };

  useEffect(() => {
    setDetails(loadURLDetails(validParams));
  }, [validParams]);

  const param = (key: string): string | null => {
    const item = details.params.find((i) => i.key === key);
    if (!item) return null;
    return item.value;
  };

  return { ...details, set, param, back, setHash };
};

export default useLocation;
