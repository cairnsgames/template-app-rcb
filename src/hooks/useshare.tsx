import { Share as ShareIcon } from "react-bootstrap-icons";
import { Button, ButtonProps } from "react-bootstrap";

type ShareData = {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
};

const useShareData = (title?: string, text?: string, url?: string, files?: File[]) => {
  const shareData: ShareData = {
    title,
    text,
    url,
    files,
  };

  const fileFromUrl = async (fileUrl: string): Promise<File> => {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    return new File([blob], fileUrl.split("/").pop() ?? "file", { type: blob.type });
  }

  const canShare = (): boolean => {
    return navigator.canShare(shareData as ShareData & globalThis.ShareData);
  };

  const share = (): void => {
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      alert("Share not supported");
    }
  };

  const Share = (props: ButtonProps & Record<string, unknown>) => {
    const shareProps: ButtonProps & Record<string, unknown> = {
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
