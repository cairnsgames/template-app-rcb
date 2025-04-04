import React, { createContext, useState, useEffect, useMemo } from "react";

const useJwt = () => ({ decodedToken: null });
const useTenant = () => ({ tenant: "mockTenant" });
const useDeviceInfo = () => ({ deviceId: "mockDeviceId" });
const useEventing = () => {};
const combineUrlAndPath = (url, path) => `${url}/${path}`;

const AuthenticationContext = createContext();

const AuthenticationProvider = (props) => {
  const { children, googleClientId } = props;

  // Mocked states
  const [token, setToken] = useState("mockToken");
  const [user, setUser] = useState();
  const [properties, setProperties] = useState([{ id: 1, name: "Mock Property" }]);
  const [roles, setRoles] = useState(["Admin"]);

  const { tenant } = useTenant();
  const { deviceId } = useDeviceInfo();

  const isLoggedIn = user?.id;

  // Mocked lifecycle effects
  useEffect(() => {
    console.log("Mock effect for token persistence", token);
  }, [token]);

  useEffect(() => {
    if (user?.id) {
      console.log("Mock fetching properties for user", user);
    }
  }, [user]);

  // Mocked functions
  const validateToken = (mockToken) => {
    console.log("Mock token validation", mockToken);
    setToken(mockToken);
  };

  const register = (email, password, confirm) => {
    console.log("Mock registration", { email, password, confirm });
    setToken("mockRegisteredToken");
    return { email, password, confirm };
  };

  const login = (email, password = "none") => {
    console.log("Mock login", { email, password });
    setToken("mockLoggedInToken");
    setUser({ id: "mockUserId", name: "Mock User", email, avatar: "https://via.placeholder.com/150" });
    return { token: "mockLoggedInToken" };
  };

  const logout = () => {
    console.log("Mock logout");
    setToken(null);
    setUser(null);
  };

  const forgot = (email) => {
    console.log("Mock forgot password", { email });
    return { status: "success" };
  };

  const requestMagicLink = (email) => {
    console.log("Mock request magic link", { email });
    return { status: "success" };
  };

  const loginWithMagicLink = (magicCode) => {
    console.log("Mock login with magic link", { magicCode });
    setToken("mockMagicLinkToken");
    setUser({ id: "mockUserId", name: "Mock User", email: "mock@user.com" });
  };

  const changePassword = (id, old, password, password2) => {
    console.log("Mock change password", { id, old, password, password2 });
  };

  const impersonate = (id) => {
    console.log("Mock impersonate", { id });
    setToken("mockImpersonatedToken");
    setUser({ id, name: "Impersonated User" });
  };

  const saveProperties = (newProperties) => {
    console.log("Mock save properties", newProperties);
    setProperties(newProperties);
  };

  const saveUser = (newUser) => {
    console.log("Mock save user", newUser);
    setUser(newUser);
  };

  const oldIdToNewMapping = async (oldId) => {
    console.log("Mock ID mapping", { oldId });
    return `new_${oldId}`;
  };

  const setGoogleAccessToken = (val) => {}

  const values = useMemo(
    () => ({
      isLoggedIn,
      token,
      register,
      login,
      requestMagicLink,
      loginWithMagicLink,
      logout,
      forgot,
      user,
      saveUser,
      setGoogleAccessToken,
      changePassword,
      impersonate,
      properties,
      saveProperties,
      oldIdToNewMapping,
    }),
    [
      token,
      register,
      login,
      requestMagicLink,
      loginWithMagicLink,
      logout,
      forgot,
      user,
      setGoogleAccessToken,
      changePassword,
      impersonate,
      properties,
    ]
  );

  return (
      <AuthenticationContext.Provider value={values}>
        {children}
      </AuthenticationContext.Provider>
  );
};

export { AuthenticationContext, AuthenticationProvider };
export default AuthenticationProvider;
