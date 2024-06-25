import { Col, Row } from "react-bootstrap";
import PageCentered from "../../parts/pagelayouts/pagecentered";
import useToast from "@cairnsgames/toasts/usetoast";

const MagicCodePage = (props) => {
  const { addToast } = useToast();

  console.log("PROPS", props);

  return (
    <PageCentered position="middle" >
      <Row className="border-bottom">
        <h1>MAGIC CODE</h1>
      </Row>
      <Row className="mt-3">
        <Col>Code</Col>
        <Col>{props.code}</Col>
      </Row>
    </PageCentered>
  );
};

export default MagicCodePage;
