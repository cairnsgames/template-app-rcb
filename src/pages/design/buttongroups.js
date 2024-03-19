import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const ButtonGroups = () => {
  return (
    <><h2>Button Group</h2>
    <ButtonGroup aria-label="Basic example">
      <Button variant="primary">Left</Button>
      <Button variant="secondary">Middle</Button>
      <Button variant="secondary">Right</Button>
    </ButtonGroup>
    </>
  );
}

export default ButtonGroups;