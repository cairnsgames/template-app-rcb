import { Row, Col } from "react-bootstrap";
import ContentDisplay from "./contentdisplay";
import ContentItem from "./contentitem";

const Layout = ({ props }) => {
  const { item } = props;
  const layout = JSON.parse(item.content);

  console.log("Item", item);
  console.log("Layout", layout);

  if (layout.type === "Row") {
    return (<Row style={layout.style}>
        {layout.content.map((item, index) => {
            console.log("Content to display", item)
            return (
            <Col key={index} xs={item.xs} md={item.md} lg={item.lg}>
                <ContentItem style={item.style} id={item.id} />
            </Col>
        )})}
    </Row>)
  }
  return <div className="layout">{item.content}</div>;
};

export default Layout;

