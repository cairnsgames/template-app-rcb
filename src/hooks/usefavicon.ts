import { useEffect } from "react";

const useFavicon = (faviconUrl: string): void => {
  useEffect(() => {
    const link = document.getElementById("favicon") as HTMLLinkElement | null;
    if (link) {
      link.href = faviconUrl;
    }
  }, [faviconUrl]);
};

export default useFavicon;
