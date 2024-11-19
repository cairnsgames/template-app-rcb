import React from 'react';

const Left = ({ className, style, children }) => {
  return (
    <div className={`left-sidebar ${className ?? ""}`} style={style}>
      {children}
    </div>
  );
};

export default Left;
