import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { List } from "react-bootstrap-icons";
import "./footer.scss";

const Footer = ({ children, variant }) => {
  const [hideMenu, setHideMenu] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [leftChildren, setLeftChildren] = useState([]);
  const [rightChildren, setRightChildren] = useState([]);

  const toggleMenu = () => {
    setHideMenu(false);
    setShowMenu(!showMenu);
  };

  const handleIconClick = () => {
    setShowMenu(false);
  };

  useEffect(() => {
    const nonCenterChildren = React.Children.toArray(children).filter(
      (child) => child.type !== Footer.Center
    );
    const half = Math.ceil(nonCenterChildren.length / 2);

    setLeftChildren(nonCenterChildren.slice(0, half));
    setRightChildren(nonCenterChildren.slice(half));
  }, [children]);

  return (
    <div className={`footer ${variant ? `footer-${variant}` : ""}`}>
      <Container className="d-flex justify-content-between align-items-center">
        <div className="w-50 left-icons d-flex justify-content-around align-items-center">
          {leftChildren.map((child, index) =>
            React.cloneElement(child, { onClick: handleIconClick, key: index })
          )}
        </div>
        <div className="central-icon" onClick={toggleMenu}>
          <List size={30} />
        </div>
        <div className="w-50 right-icons d-flex justify-content-around align-items-center">
          {rightChildren.map((child, index) =>
            React.cloneElement(child, { onClick: handleIconClick, key: index })
          )}
        </div>
      </Container>
      {!hideMenu && (
        <Footer.Center className={showMenu ? "show" : "hide"} handleIconClick={handleIconClick}>
          {React.Children.map(children, (child) =>
            child.type === Footer.Center ? child.props.children : null
          )}
        </Footer.Center>
      )}
    </div>
  );
};

Footer.Icon = ({ children, className = "", style = {}, onClick, ...props }) => (
  <Button
    variant="link"
    className={`icon-button ${className}`}
    style={style}
    onClick={(e) => {
      if (onClick) onClick(e);
    }}
    {...props}
  >
    {children}
  </Button>
);

Footer.Center = ({ children, className, handleIconClick }) => {
  const [menuItemCount, setMenuItemCount] = useState(0);

  useEffect(() => {
    setMenuItemCount(React.Children.count(children));
  }, [children]);

  return (
    <div
      className={`footer-menu ${className}`}
      style={{ "--menu-item-count": menuItemCount }}
    >
      {children.map((child, index) =>
        React.cloneElement(child, { onClick: handleIconClick, key: index })
      )}
    </div>
  );
};

export default Footer;
