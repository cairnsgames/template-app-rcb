import React from 'react';
import { Container } from 'react-bootstrap';
import { TilesLayout } from './Tiles';
import TileList from './TileList';
import { exampleImages } from './images';

function TilesSample() {
  return (
    <Container >
      <TilesLayout>
        <TileList images={exampleImages} />
        <TileList images={exampleImages} />
      </TilesLayout>
    </Container>
  );
}

export default TilesSample;