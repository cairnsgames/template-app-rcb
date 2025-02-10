import React from 'react';
import Tile from './Tile';

const TileList = ({ images }) => {
  const sortedImages = images.sort((a, b) => b.priority - a.priority);

  return (
    <>
      {sortedImages.map((data, index) => (
        <Tile key={data.id} data={data} index={index} />
      ))}
    </>
  );
};

export default TileList;