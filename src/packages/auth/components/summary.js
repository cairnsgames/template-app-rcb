import React from "react";
import useAuth from "../context/useauth";
import { Alert } from "react-bootstrap";
import AdminOnly from "../../../components/adminonly";

const Summary = () => {
  const { isLoggedIn, token, mastertoken, user } = useAuth();

  return (
    <>
      <h3>Summary: User</h3>
      {isLoggedIn &&<div>You are logged in</div>}
      {!isLoggedIn && <Alert variant="danger">You are not logged in</Alert>}
      {isLoggedIn && (
        <div>
          <div>User: {user?.email}</div>
          <div>Id: {user?.id}</div>
          <div>Name: {user?.firstname}</div>
          <div>Surname: {user?.lastname}</div>
          {user?.mastertoken && <AdminOnly variant="warning">You are currently Impersonating this User</AdminOnly>}          
        </div>
      )}
    </>
  );
};

export default Summary;
