import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const ButtonGroups = () => {
  return (
    <><h2>Button Group</h2>
    <ButtonGroup aria-label="Basic example">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="info">Info</Button>
      <Button variant="light">Light</Button>
      <Button variant="dark">Dark</Button>
      <Button variant="outline-primary">Outline Primary</Button>
      <Button variant="outline-secondary">Outline Secondary</Button>
    </ButtonGroup>
    </>
  );
}

export default ButtonGroups;