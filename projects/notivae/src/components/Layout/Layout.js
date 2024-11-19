import React, { useState } from 'react';
import './Layout.scss'; // Assuming you will add styles here
import Left from './Left';
import Right from './Right';

const Layout = ({ className, style, children }) => {
  const [leftWidth, setLeftWidth] = useState(250); // Initial width of the left sidebar
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newWidth = e.clientX; // Get the new width based on mouse position
      setLeftWidth(newWidth > 100 ? newWidth : 100); // Minimum width of 100px
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Attach mouse move and mouse up events to the window
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className={`layout`} style={style}>
      {React.Children.map(children, (child) => {
        if (child.type === Left) {
          return React.cloneElement(child, { style: { width: leftWidth } });
        }
        return null;
      })}
      <div className="divider" onMouseDown={handleMouseDown} />
      {React.Children.map(children, (child) => {
        if (child.type === Right) {
          return React.cloneElement(child);
        }
        return null;
      })}
    </div>
  );
};

Layout.Left = Left;
Layout.Right = Right;

export default Layout;
