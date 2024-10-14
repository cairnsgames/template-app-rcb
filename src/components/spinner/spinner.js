import { Spinner } from 'react-bootstrap';
import './spinner.scss';

const LoadingSpinner = () => (
  <div className="spinner-container">
    <Spinner animation="border" />
  </div>
);

export default LoadingSpinner;
