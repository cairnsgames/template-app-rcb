import React, { useRef, useState } from 'react';
import { Nav } from 'react-bootstrap';
import './bar.scss';

const Bar = ({ children, variant, className, style, defaultActiveKey, onSelect }) => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeKey, setActiveKey] = useState(defaultActiveKey);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    e.preventDefault(); // Prevent default link dragging behavior
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleSelect = (key, e) => {
    console.log('handleSelect', key);
    if (!isDragging) {
      
      console.log('setActiveKey', key);
      setActiveKey(key);
      onSelect(key, e);
      e.stopPropagation(); // Prevent the onClick from firing if dragging
    } else {
      e.preventDefault();
    }
  };

  return (
    <div
      className={`bar-container ${className || ''} ${variant || 'primary'}`}
      style={style}
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <Nav className="bar-nav">
        {React.Children.map(children, (child, index) => {
          if (!child) return null;
          // Clone each child and pass the active class if it's the active key
          const childKey = child.props.eventKey || index;
          return React.cloneElement(child, {
            className: childKey === activeKey ? 'active-pill' : '',
            onClick: (e) => handleSelect(childKey, e),
            key: childKey,
          });
        })}
      </Nav>
    </div>
  );
};

export default Bar;
