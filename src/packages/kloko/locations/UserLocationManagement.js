import React, { useEffect, useState } from "react";
import { useLocations } from "../context/uselocations";
import { Button, ButtonGroup, Spinner, Table } from "react-bootstrap";
import { Pencil, Trash } from "react-bootstrap-icons"; // Importing icons
import LocationEditModal from "./LocationEditModal";

const UserLocationManagement = () => {
  const {
    loading,
    userLocations,
    createUserLocation,
    updateUserLocation,
    deleteUserLocation,
  } = useLocations();
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
    showonmap: 1,
    default: 0,
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
        showonmap: 1,
        default: 0,
      });
    }
  }, [selectedLocation]);

  useEffect(() => {
    console.log("Details updated:", details);
  }, [details]);

  const handleSave = async () => {
    if (!details.name.trim()) {
      alert("Location name is required.");
      return;
    }

    if (details.default === 1) {
      // Ensure only one location is set as default
      await Promise.all(
        userLocations
          .filter((location) => location.default === 1)
          .map((location) =>
            updateUserLocation(location.id, { ...location, default: 0 })
          )
      );
    }

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
      showonmap: 1,
      default: 0,
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

  const getLocationAddress = (location) => {
    const addressParts = [
      location.address_line1,
      location.address_line2,
      location.town,
    ].filter(Boolean); // Filter out any undefined or empty values
    return addressParts.join(", ");
  };

  return (
    <div>
      <h1>User Location Management</h1>
      <div className="my-3">
        <Button
          variant="primary"
          onClick={() => {
            setSelectedLocation(null);
            setShowModal(true);
          }}
        >
          Add Location
        </Button>
      </div>
      <div className="d-none d-md-block">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Show on Map</th>
              <th>Default</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userLocations.map((location) => (
              <tr key={location.id}>
                <td>{location.name}</td>
                <td>{getLocationAddress(location)}</td>
                <td>{location.showonmap === 1 ? "Yes" : "No"}</td>
                <td>{location.default === 1 ? "Yes" : "No"}</td>
                <td>
                  <ButtonGroup>
                    <Button
                      variant="outline-primary"
                      onClick={() => handleEdit(location)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="outline-primary"
                      onClick={() => handleDelete(location.id)}
                    >
                      <Trash />
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="d-block d-md-none">
        {userLocations.map((location) => (
          <div key={location.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{location.name}</h5>
              <p className="card-text">{getLocationAddress(location)}</p>
              <p className="card-text">
                Show on Map: {location.showonmap === 1 ? "Yes" : "No"}
              </p>
              <p className="card-text">
                Default: {location.default === 1 ? "Yes" : "No"}
              </p>
              <ButtonGroup>
                <Button
                  variant="outline-primary"
                  onClick={() => handleEdit(location)}
                >
                  <Pencil />
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => handleDelete(location.id)}
                >
                  <Trash />
                </Button>
              </ButtonGroup>
            </div>
          </div>
        ))}
      </div>
      <LocationEditModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        details={details}
        setDetails={setDetails}
        handleSave={handleSave}
      />
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Spinner animation="border" variant="light" />
        </div>
      )}
    </div>
  );
};

export default UserLocationManagement;
