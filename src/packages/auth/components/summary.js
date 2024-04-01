import React from "react";
import useAuth from "../context/useauth";
import { Alert } from "react-bootstrap";
import AdminOnly from "../../../components/adminonly";

const Summary = () => {
  const { isLoggedIn, token, mastertoken, user } = useAuth();
  console.log("USER Summary", user);
  return (
    <>
      <h3>Summary: Auth</h3>
      <div>isLoggedIn: {isLoggedIn ? "true" : "false"}</div>
      {isLoggedIn && (
        <div>
          <div>User: {user?.email}</div>
          <div>Id: {user?.id}</div>
          <div>Name: {user?.firstname}</div>
          <div>Surname: {user?.lastname}</div>
          {user?.mastertoken && <AdminOnly variant="warning">Currently Impersonating the User</AdminOnly>}
          
        </div>
      )}
    </>
  );
};

export default Summary;
