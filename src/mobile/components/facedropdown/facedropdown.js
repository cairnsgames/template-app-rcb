import React, { useState } from "react";
import { Container, Dropdown, Navbar, Nav, Image } from "react-bootstrap";
import useAuth from "../../../packages/auth/context/useauth";
import useUser from "../../../packages/auth/context/useuser";
import { Person, PersonCircle } from "react-bootstrap-icons";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <div
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    style={{ display: "inline-block" }}
  >
    {children}
  </div>
));

const FaceDropdown = () => {
  const { logout, isLoggedIn } = useAuth();
  const { user } = useUser();
  // const { venues } = useAssistant();

  const hardReload = () => {
    if ('caches' in window) {
      // Clear all cached assets
      caches.keys().then((names) => {
        Promise.all(names.map((name) => caches.delete(name))).then(() => {
          // Force a reload after cache is cleared
          window.location.reload(true); // Reload the page
        });
      });
    } else {
      // If caches are not available, just reload the page
      window.location.reload(true);
    }
  };

  return (
    <Dropdown align="end">
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        <PersonCircle size={24} className="ms-3" style={{ color: "white" }} />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {isLoggedIn && <Dropdown.Item>Welcome {user.firstname}</Dropdown.Item>}
        {isLoggedIn && <Dropdown.Item href="#profile">Profile</Dropdown.Item>}
        {isLoggedIn && <Dropdown.Item href="#partner">Partner</Dropdown.Item>}
        {isLoggedIn && <Dropdown.Item href="#settings">Settings</Dropdown.Item>}
        <Dropdown.Item
          onClick={() => {
            hardReload(true);
          }}
        >
          RELOAD
        </Dropdown.Item>
        {/* {venues?.length > 0 && (
          <Dropdown.Item href="#assitant/select">Assistant</Dropdown.Item>
        )} */}
        <Dropdown.Item href="#landing">About</Dropdown.Item>
        {isLoggedIn && (
          <Dropdown.Item
            onClick={() => {
              logout();
              window.location.hash = "home";
            }}
          >
            Logout
          </Dropdown.Item>
        )}
        {!isLoggedIn && <Dropdown.Item href="#login">Login</Dropdown.Item>}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default FaceDropdown;
