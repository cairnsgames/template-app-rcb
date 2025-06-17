import React from "react";
import Tile from "./Tile";
import TicketTile from "./TicketTile";

const TileList = ({ images, onClick }) => {
  const sortedImages = images.sort((a, b) => b.priority - a.priority);

  return (
    <>
      {sortedImages.map((data, index) => {
        if (data.type === "ticket") {
          return <TicketTile key={data.id} data={data} index={index} onClick={onClick} />;
        }
        return (
          <Tile key={data.id} data={data} index={index} onClick={onClick} />
        );
      })}
    </>
  );
};

export default TileList;
