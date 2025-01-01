import React from 'react';
import { Navbar, Container, NavDropdown } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';
import useUser from '../mocks/providers/useuser';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar className="sticky-top py-2">
      <Container fluid className="px-3">
        <Navbar.Brand as={Link} to="/app">CairnsGames</Navbar.Brand>
        <NavDropdown 
          title={<Person size={20} />}
          id="user-dropdown"
          align="end"
        >
          <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
        </NavDropdown>
      </Container>
    </Navbar>
  );
};

export default Header;
