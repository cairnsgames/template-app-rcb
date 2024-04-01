import React from 'react';

const Route = (props) => {
    const { children } = props;
    const childrenWithProps = React.Children.map(children, child => {
        // Passing customProp to each child
        return React.cloneElement(child, { ...props });
    });
  return <>
    {childrenWithProps}
  </>;
}

export default Route;
