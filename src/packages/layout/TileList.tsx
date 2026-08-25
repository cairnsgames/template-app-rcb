import React from "react";
import TileFormat from "./TileFormat";
import TicketTile from "./TicketTile";
import { TileData } from "./layout.types";

type TileListProps = {
  images: TileData[];
  onClick: (data: TileData) => void;
};

const TileList = ({ images, onClick }: TileListProps) => {
  const sortedImages = [...images].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  return (
    <>
      {sortedImages.map((data, index) => {
        if (data.type === "ticket") {
          return <TicketTile key={data.id} data={data} onClick={onClick} />;
        }
        return <TileFormat key={data.id} data={data} onClick={onClick} />;
      })}
    </>
  );
};

export default TileList;
