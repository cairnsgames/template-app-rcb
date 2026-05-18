export type EventQRCodeEvent = {
  id: string | number;
  [key: string]: unknown;
};

export type EventQRCodeProps = {
  event: EventQRCodeEvent | null | undefined;
  size?: number;
  allowCopyToClipboard?: boolean;
  allowDownload?: boolean;
  allowWhatsapp?: boolean;
  allowFacebook?: boolean;
  className?: string;
};
