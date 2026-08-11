import React from "react";

export type TileRawData = {
  event_id?: string | number;
  favorite?: number;
  start_time?: string;
  currency?: string;
  price?: string | number;
  quantity?: number;
  title?: string;
};

export type TileData = {
  id: string | number;
  title?: string;
  image?: string;
  description?: string | string[];
  footer?: React.ReactNode;
  overlayText?: boolean;
  qrcode?: boolean;
  type?: string;
  priority?: number;
  tracker?: string;
  quantity?: number;
  price?: string;
  event_id?: string | number;
  raw?: TileRawData;
};
