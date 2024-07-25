import { Row, Col, Tab, Nav, Carousel } from "react-bootstrap";
import LayoutItem from "./layoutitem";

const Layout = ({ props }) => {
  const { item, customType } = props;
  const layout = JSON.parse(item.content);


  if (layout.type === "Row") {
    return (
      <Row style={layout.style}>
        {layout.content.map((item, index) => {
          return (
            <Col key={index} xs={item.xs} md={item.md} lg={item.lg}>
              <LayoutItem content={item} customType={customType} />
            </Col>
          );
        })}
      </Row>
    );
  } else if (layout.type === "Gallery") {
    return (
      <Row style={layout.style}>
        {layout.contents.map((content, index) => {
          return (
            <Col key={index} xs={12} md={6} lg={4}>
              <LayoutItem content={content}  customType={customType}/>
            </Col>
          );
        })}
      </Row>
    );
  } else if (layout.type === "Slide") {
    return (
      <Carousel style={layout.style}>
        {layout.contents.map((content, index) => {
          return (
            <Carousel.Item style={item.style} key={index}>
              <LayoutItem as={4} content={content}  customType={customType}/>
            </Carousel.Item>
          );
        })}
      </Carousel>
    );
  } else if (layout.type === "Tour") {
    return (
      <Row>
        <Col xs={12}>
          <LayoutItem
            content={layout}
            style={{ ...layout.style, borderRadius: "0px" }}
            customType={customType}
          />
        </Col>
        <Col xs={12}>
          {/* <Tabs fill>
          {layout.tabs.map((tab, index) => {
            return <Tab eventKey={tab.title} title={tab.title}>
              <ContentItem style={{margin:"3rem", ...tab.style}} id={tab.content} />
              </Tab>
          })}
        </Tabs> */}
          <Tab.Container defaultActiveKey={layout.tabs[0].title}>
            <Row
              className={`mt-2 ${layout.className}`}
              style={{ borderBottom: "1px solid green" }}
            >
              <Col xs={12}>
                <Nav variant="pills" className="flex-row">
                  {layout.tabs.map((tab, index) => {
                    return (
                      <Nav.Item bg="primary" key={index}>
                        <Nav.Link eventKey={tab.title}>{tab.title}</Nav.Link>
                      </Nav.Item>
                    );
                  })}
                </Nav>
              </Col>
              <Col xs={12}>
                <Tab.Content>
                  {layout.tabs.map((tab, index) => {
                    return (
                      <Tab.Pane eventKey={tab.title} key={index}>
                        <LayoutItem
                          content={tab}
                          style={{ margin: "0.5rem", ...tab.style }}
                          customType={customType}
                        />
                      </Tab.Pane>
                    );
                  })}
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Col>
      </Row>
    );
  } else {
    return customType(item)
  }
  return <div className="layout">{item.content}</div>;
};

export default Layout;
