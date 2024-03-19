import Breadcrumb from 'react-bootstrap/Breadcrumb';

function Breadcrumbs() {
  return (
    <><h2>Bread Crumbs</h2>
    <Breadcrumb>
      <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
      <Breadcrumb.Item href="https://getbootstrap.com/docs/4.0/components/breadcrumb/">
        Library
      </Breadcrumb.Item>
      <Breadcrumb.Item active>Data</Breadcrumb.Item>
    </Breadcrumb>
    </>
  );
}

export default Breadcrumbs;