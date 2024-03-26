import React from "react";
import useAuth from "../context/useauth";

const Summary = () => {
  const { isLoggedIn, user } = useAuth();
  return (
    <div>
      <h3>Summary: Auth</h3>
      isLoggedIn: {isLoggedIn ? "true" : "false"}
      {isLoggedIn && (
        <>
          <div>User: {user?.email}</div>
          <div>Id: {user?.id}</div>
          <div>Name: {user?.firstname}</div>
          <div>Surname: {user?.lastname}</div>
        </>
      )}
    </div>
  );
};

export default Summary;
