import React from "react";
import "./tiles.css";

type TilesLayoutProps = {
  children: React.ReactNode;
};

type ColumnProps = {
  children: React.ReactNode;
};

export const TilesLayout = ({ children }: TilesLayoutProps) => (
  <div className="tiles mt-4">{children}</div>
);

export const Column = ({ children }: ColumnProps) => (
  <div className="d-flex flex-column gap-4">{children}</div>
);

export default TilesLayout;
