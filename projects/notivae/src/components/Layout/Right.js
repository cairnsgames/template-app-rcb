import React from 'react';

const Right = ({ className, style, children }) => {
  return (
    <div className={`right-content ${className ?? ""}`} style={style}>
      {children}
    </div>
  );
};

export default Right;
