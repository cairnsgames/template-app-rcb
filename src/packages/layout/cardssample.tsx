import React from "react";
import { Container } from "react-bootstrap";
import { TilesLayout } from "./Tiles";
import TileList from "./TileList";
import { exampleImages } from "./images";

const TilesSample = () => (
  <Container>
    <TilesLayout>
      <TileList images={exampleImages} onClick={() => {}} />
      <TileList images={exampleImages} onClick={() => {}} />
    </TilesLayout>
  </Container>
);

export default TilesSample;
