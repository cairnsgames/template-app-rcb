import React from 'react';
import { Form } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';
import useUser from '../../mocks/providers/useuser';

const UserDetailsTab = () => {
  const { user } = useUser();
  console.log("**** USER", user)

  return (
    <>
      <div className="text-center mb-4">
        <Person size={80} className="text-primary mb-3" />
        <h2>{user.name}</h2>
        <p className="text-muted">{user.email}</p>
      </div>

      <Form>
        <h4 className="mb-4">Profile Information</h4>
        <Form.Group className="mb-3">
          <Form.Label>Display Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter display name"
            defaultValue={user.name}
            disabled
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            defaultValue={user.email}
            disabled
          />
        </Form.Group>

        <h4 className="mb-4 mt-5">Account Settings</h4>
        <Form.Group className="mb-3">
          <Form.Label>Language</Form.Label>
          <Form.Select defaultValue="en">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Time Zone</Form.Label>
          <Form.Select defaultValue="UTC">
            <option value="UTC">UTC</option>
            <option value="EST">Eastern Time</option>
            <option value="PST">Pacific Time</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check 
            type="switch"
            id="email-notifications"
            label="Email Notifications"
            defaultChecked
          />
        </Form.Group>
      </Form>
    </>
  );
};

export default UserDetailsTab;
