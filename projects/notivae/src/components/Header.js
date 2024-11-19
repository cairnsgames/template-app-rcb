import React from 'react';
import { Navbar, Dropdown } from 'react-bootstrap';
import { PersonCircle } from 'react-bootstrap-icons';
import ElfIcon from '../icons/elf';

const Header = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Navbar className="top px-3" bg="primary" variant="dark" expand="lg">
      <Navbar.Brand href="#home" style={{color:"white"}}><ElfIcon /> <h1 className="pt-3" style={{display:"inline"}} className="pt-1">Noti Elf</h1></Navbar.Brand>
      <Dropdown className="ms-auto">
        <Dropdown.Toggle variant="secondary" id="dropdown-basic" style={{color:"yellow"}}>
          <PersonCircle size="1.5rem" />
        </Dropdown.Toggle>

        <Dropdown.Menu align="end">
          <Dropdown.Item onClick={handleReload}>Reload</Dropdown.Item>
          <Dropdown.Item href="#profile">Profile</Dropdown.Item>
          <Dropdown.Item href="#dashboard">Dashboard</Dropdown.Item>
          <Dropdown.Item href="#account">Account</Dropdown.Item>
          <Dropdown.Item href="#login">Login</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Navbar>
  );
};

export default Header;
