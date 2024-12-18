import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import PageCentered from "../../parts/pagelayouts/pagecentered";
import useToast from "@cairnsgames/toasts/usetoast";
import useAuth from "../../packages/auth/context/useauth";
import LoadingSpinner from "../../components/spinner/spinner";

const MagicCodePage = (props) => {
  const { addToast } = useToast();
  const { loginWithMagicLink } = useAuth();

  useEffect(() => {
    if (props?.code.length) {
      loginWithMagicLink(props.code);
    }
  }, [props.code]);

  return (
    <PageCentered position="middle" >
      <LoadingSpinner />
    </PageCentered>
  );
};

export default MagicCodePage;
