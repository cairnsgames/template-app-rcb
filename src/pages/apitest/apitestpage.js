import React from "react";
import { APITestProvider } from "../../packages/apitest/provider";
import PageFull from "../../parts/pagelayouts/pagefull";
import ProjectDropdown from "./projectdropdown";
import { Row, Col } from "react-bootstrap";
import CallsList from "./callslist";
import EditCallForm from "./editcall";

const APITestPage = (props) => {
  return (<div> </div>);
  return (
    <APITestProvider>
      <PageFull className="p-2">
        <h1>API Test Page</h1>
        <ProjectDropdown />
        <Row>
          <Col xs={4}>
            <CallsList />
          </Col>
          <Col xs={8}>
            <EditCallForm />
          </Col>
        </Row>
      </PageFull>
    </APITestProvider>
  );
};

export default APITestPage;
