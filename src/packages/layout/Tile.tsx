import React from "react";

type TileProps = {
  children: React.ReactNode;
};

const Tile = ({ children }: TileProps) => (
  <div className="tile-wrapper mb-4">{children}</div>
);

export default Tile;
