import React from 'react';
import { Card } from 'react-bootstrap';

const Tile = ({ data, onClick }) => {
  const { title, image, description, price, overlayText = true } = data;

  const placeholderImage = (
    <div className="w-100 ratio ratio-16x9 bg-light d-flex align-items-center justify-content-center text-light">
    </div>
  );

  return (
    <div className="tile-wrapper mb-4">
      <Card className="" onClick={()=>onClick(data)}>
        {image ? (
          <Card.Img variant="top" src={image} alt={title} />
        ) : (
          placeholderImage
        )}
        {overlayText && (
          <Card.ImgOverlay className="d-flex flex-column justify-content-between p-2 px-3">
            <Card.Header className="text-white bg-transparent border-0 text-center">
              <h5 className="mb-0">{title}</h5>
            </Card.Header>
            <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1">
              <Card.Text className="text-white">{description}</Card.Text>
            </div>
            <Card.Footer className="text-white text-center bg-transparent border-0 w-100">
              {price}
            </Card.Footer>
          </Card.ImgOverlay>
        )}
      </Card>
    </div>
  );
};

export default Tile;