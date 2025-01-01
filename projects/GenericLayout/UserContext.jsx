import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    isLoggedIn: false,
    email: '',
    name: ''
  });

  const login = (userData) => {
    setUser({
      isLoggedIn: true,
      email: userData.email,
      name: userData.email.split('@')[0]
    });
  };

  const logout = () => {
    setUser({
      isLoggedIn: false,
      email: '',
      name: ''
    });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
