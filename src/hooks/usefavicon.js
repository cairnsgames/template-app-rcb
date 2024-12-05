import { useEffect } from 'react';

const useFavicon = (faviconUrl) => {
  useEffect(() => {
    const link = document.getElementById('favicon');
    if (link) {
      link.href = faviconUrl;
    }
  }, [faviconUrl]);
};

export default useFavicon;
