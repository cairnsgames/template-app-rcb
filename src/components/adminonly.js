import React from "react";
import { Alert } from "react-bootstrap";

const AdminOnly = ({ children, ...props }) => {
  if (props.text) {
    return <Alert variant="warning">{text}</Alert>;
  }
  return <Alert {...props}>{children}</Alert>;
};

export default AdminOnly;
