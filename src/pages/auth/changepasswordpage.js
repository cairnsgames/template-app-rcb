import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import PageCentered from "../../parts/pagelayouts/pagecentered";
import ChangePasswordForm from "../../packages/auth/forms/changepassword";

const ChangePasswordPage = (props) => {
  return (
    <PageCentered position="middle" >
      <ChangePasswordForm />
    </PageCentered>
  );
};

export default ChangePasswordPage;
