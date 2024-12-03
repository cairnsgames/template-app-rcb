import React, { useEffect, useState } from "react";
import { useLocations } from "../context/uselocations";
import { Button, ButtonGroup, Spinner, Table } from "react-bootstrap";
import { Pencil, Trash } from 'react-bootstrap-icons'; // Importing icons
import LocationEditModal from "./LocationEditModal";

const UserLocationManagement = () => {
  const { loading, userLocations, createUserLocation, updateUserLocation, deleteUserLocation } = useLocations();
  const [showModal, setShowModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [details, setDetails] = useState({
    id: 0,
    name: "",
    address_line1: "",
    address_line2: "",
    town: "",
    lat: "",
    lng: "",
  });

  useEffect(() => {
    if (selectedLocation) {
      setDetails(selectedLocation);
    } else {
      setDetails({
        name: "",
        address_line1: "",
        address_line2: "",
        town: "",
        lat: "",
        lng: "",
      });
    }
  }, [selectedLocation]);

  const handleSave = async () => {
    if (selectedLocation) {
      await updateUserLocation(selectedLocation.id, details);
    } else {
      await createUserLocation(details);
    }
    setShowModal(false);
    setSelectedLocation(null);
    setDetails({
      name: "",
      address_line1: "",
      address_line2: "",
      town: "",
      lat: "",
      lng: "",
    });
  };

  const handleEdit = (location) => {
    setSelectedLocation(location);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      await deleteUserLocation(id);
    }
  };

  return (
    <div>
      <h1>User Location Management</h1>
      <Button variant="primary" onClick={() => {
        setSelectedLocation(null);
        setShowModal(true);
      }}>
        Add Location
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userLocations.map((location) => (
            <tr key={location.id}>
              <td>{location.name}</td>
              <td>{`${location.address_line1}, ${location.town}`}</td>
              <td>
                <ButtonGroup>
                <Button variant="outline-primary" onClick={() => handleEdit(location)}>
                  <Pencil /> {/* Pencil icon for Edit */}
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => handleDelete(location.id)}
                >
                  <Trash /> {/* Trash icon for Delete */}
                </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <LocationEditModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        details={details}
        setDetails={setDetails}
        handleSave={handleSave}
      />
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <Spinner animation="border" variant="light" />
        </div>
      )}
    </div>
  );
};

export default UserLocationManagement;
