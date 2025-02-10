import React from 'react';
import './tiles.css';

export const TilesLayout = ({ children }) => {
  return (
    <div className="tiles mt-4">
      {children}
    </div>
  );
};

export const Column = ({ children }) => {
  return <div className="d-flex flex-column gap-4">{children}</div>;
};

export default TilesLayout;