import React, { useState, useContext } from "react";
import PageCentered from "../../../parts/pagelayouts/pagecentered";
import { Container, Row, Col } from "react-bootstrap";
import TxProvider, { TxContext } from "./txContext";
import { Tabs, Tab, Card } from "react-bootstrap";
import DetailsTab from "./DetailsTab";
import PayoutsTab from "./PayoutsTab";
import TransactionsTab from "./TransactionsTab";
import ReportsTab from "./ReportsTab";
import useUser from "../../../packages/auth/context/useuser";

const FinancesContent = (): JSX.Element => {
  const { balance } = useContext(TxContext) as any;
  const [active, setActive] = useState("details");

  return (
    <Container fluid className="my-3">
      <Row>
        <Col xs={1} md={1} lg={1} />
        <Col xs={10} md={10} lg={10}>
          <h1>Finances (Under development)</h1>

          <Card className="mb-3 p-3">
            <div>Balance: <strong>R{balance}</strong></div>
          </Card>

          <Tabs
            id="finances-tabs"
            activeKey={active}
            onSelect={(k: string | null) => setActive(k || "details")}
            className="mb-3"
          >
            <Tab eventKey="details" title="Details">
              <Card className="p-3">
                <DetailsTab />
              </Card>
            </Tab>
            <Tab eventKey="payouts" title="Payouts">
              <Card className="p-3">
                <PayoutsTab />
              </Card>
            </Tab>
            <Tab eventKey="transactions" title="Transactions">
              <Card className="p-3">
                <TransactionsTab />
              </Card>
            </Tab>
            <Tab eventKey="reports" title="Reports">
              <Card className="p-3">
                <ReportsTab />
              </Card>
            </Tab>
          </Tabs>
        </Col>
        <Col xs={1} md={1} lg={1} />
      </Row>
    </Container>
  );
};

const FinancesPage = (): JSX.Element => {
  const { user } = useUser();
  const allowed = user && [21, 167].includes(Number(user.id));
  const [showUserId, setShowUserId] = useState(false);

  if (!allowed) {
    return (
      <Container fluid className="my-3">
        <Row>
          <Col xs={1} md={1} lg={1} />
          <Col xs={10} md={10} lg={10}>
            <Card
              className="p-3 text-center"
              onClick={() => setShowUserId(true)}
              style={{ cursor: "pointer" }}
            >
              <h2>Coming Soon</h2>
              <p>This feature is not yet available for your account.</p>
            </Card>
            {showUserId && (
              <div className="mt-2 text-center">UserID: {user?.id ?? "-"}</div>
            )}
          </Col>
          <Col xs={1} md={1} lg={1} />
        </Row>
      </Container>
    );
  }

  console.log("USER - before TxProvider:", user);

  return (
    <TxProvider user={user}>
      <FinancesContent />
    </TxProvider>
  );
};

export default FinancesPage;
