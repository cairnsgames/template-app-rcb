import { Share as ShareIcon } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";

const useShareData = (title, text, url, files) => {
  const shareData = {
    title,
    text,
    url,
    files,
  };

  const fileFromUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], url.split("/").pop(), { type: blob.type });
  }

  const canShare = () => {
    return navigator.canShare(shareData);
  };

  const share = () => {
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      alert("Share not supported");
    }
  };

  const Share = (props) => {
    const shareProps = {
      size: "sm",
      variant: "outline-primary",
      onClick: share,
      disable: canShare,
      ...props,
    };
    return (
      <Button {...shareProps}>
        <ShareIcon />
      </Button>
    );
  };

  return { canShare, share, Share, fileFromUrl };
};

export default useShareData;
