import React from 'react';
import Tile from './Tile';

const TileList = ({ images, onClick }) => {
  const sortedImages = images.sort((a, b) => b.priority - a.priority);

  console.log("TileList", images);

  return (
    <>
      {sortedImages.map((data, index) => (
        <Tile key={data.id} data={data} index={index} onClick={onClick} />
      ))}
    </>
  );
};

export default TileList;