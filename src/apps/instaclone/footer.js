import React from "react";
import { Navbar, Button, ButtonGroup } from "react-bootstrap";
import { GeoAlt, House, HouseAdd, HouseDoorFill, Map, PlusSquare } from "react-bootstrap-icons";

function Footer() {
  return (
    <Navbar fixed="bottom" bg="light" data-bs-theme="light">
      <ButtonGroup  style={{minWidth:"90%", marginLeft:"5%"}}>
        <Button variant="outline-primary"  onClick={()=>{window.location.hash="home"}}>
          <House size="32"/>
        </Button>
        <Button variant="outline-primary" onClick={()=>{window.location.hash="add"}}>
          <PlusSquare size="32" />
        </Button>
        <Button variant="outline-primary" onClick={()=>{window.location.hash="map"}}>
          <GeoAlt size="32" />
        </Button>
      </ButtonGroup>
    </Navbar>
  );
}

export default Footer;
