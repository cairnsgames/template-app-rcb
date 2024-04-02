import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useJwt } from "react-jwt";
import useTenant from "../../tenant/context/usetenant";
import useDeviceInfo from "../../device/usedeviceinfo";

// type AuthType = {
//   token?: string;
//   register: Function;
//   login: Function;
//   logout: Function;
//   forgot: Function;
//   user: any;
//   setgoogleAccessToken: Function;
//   changePassword: Function;
// };
// type AuthProviderType = {
//   googleClientId: string;
//   children: React.ReactNode;
//   TenantContext: any;
// };
// const defaultAuth: AuthType = {
//   token: "",
//   register: () => {},
//   login: () => {},
//   logout: () => {},
//   forgot: () => {},
//   user: {},
//   setgoogleAccessToken: () => {},
//   changePassword: () => {},
// };
// interface googleDecodedToken {
//   email: string;
//   lastname: string;
//   firstname: string;
//   sub: string;
//   name: string;
//   picture: string;
//   verified_email: string;
// }

// create context
// const AuthenticationContext = createContext<AuthType>(defaultAuth);
const AuthenticationContext = createContext();

const AuthenticationProvider = (props) => {
  const { children, googleClientId, onError } = props;
  const [token, settoken] = useState();
  const [googleAccessToken, setgoogleAccessToken] = useState();
  const [user, setUser] = useState();
  const { decodedToken } = useJwt(googleAccessToken || "");

  const { tenant } = useTenant();
  const { deviceId } = useDeviceInfo();

  if (!process.env.REACT_APP_AUTH_API) {
    throw new Error(
      "AuthProvider: REACT_APP_AUTH_API environment variable is required"
    );
  }

  useEffect(() => {
    if (token) {
      localStorage.setItem("cg." + tenant + ".auth", token);
    }
  }, [token]);

  const validateToken = (token) => {
    const body = { token: token };
      fetch(process.env.REACT_APP_AUTH_API + "/validateToken.php?debug=true", {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json", APP_ID: tenant, deviceid: deviceId },
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          if (typeof data === "string") {
            data = JSON.parse(data);
          }
          if (data.errors) {
            console.error("VALIDATE TOKEN ERRORS", data.errors);
          }
          settoken(data.token);
          const userDetails = {
            email: data.email,
            lastname: data.lastname,
            firstname: data.firstname,
            id: data.id,
            name: data.firstname + " " + data.lastname,
            picture: data.avatar,
            permissions: data.permissions,
            mastertoken: data.mastertoken,
          };
          setUser(userDetails);
          if (window.location.hash.includes("auth")) {
            window.location.hash = "#";
          }
        })
        .catch((err) => {
          if (onError) {
            onError("Auth: Unable to Validate Token", err);
          }
        });
      settoken(token);
  }

  useEffect(() => {
    if (!process.env) {
      return;
    }
    const savedToken = localStorage.getItem("cg." + tenant + ".auth");
    if (savedToken && savedToken !== "undefined") {
      // Validate Token
      validateToken(savedToken);
    }
  }, [tenant]);

  const getGoogleUser = useCallback(async () => {
    if (googleAccessToken && decodedToken) {
      const decodedToken2 = decodedToken;
      console.log("GOOGLE ACCESS TOKEN", decodedToken);
      setUser({
        email: decodedToken2.email,
        lastname: decodedToken2.lastname,
        firstname: decodedToken2.firstname,
        id: decodedToken2.sub,
        name: decodedToken2.name,
        avatar: decodedToken2.picture,
        verified_email: decodedToken2.verified_email,
        permissions: decodedToken2.permissions,
      });
      const body = {
        email: decodedToken2.email,
        firstname: decodedToken2.firstname,
        lastname: decodedToken2.lastname,
        googleid: decodedToken2.sub,
        avatar: decodedToken2.picture,
      };
      await fetch(process.env.REACT_APP_AUTH_API + "/logingoogle.php", {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json", APP_ID: tenant, deviceid: deviceId },
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("GOOGLE LOGIN", data);
          settoken(data.token);
          window.location.hash = "#";
        })
        .catch((err) => {
          if (onError) {
            onError("Auth: Unable to complete Google Login", err);
          }
        });
    }
  }, [googleAccessToken, decodedToken]);

  useEffect(() => {
    if (googleAccessToken) {
      getGoogleUser();
    }
  }, [googleAccessToken, getGoogleUser]);

  const logout = () => {
    console.log("Logout");
    // Check if we have a master token
    console.log("USER", user)
    if (user && user.mastertoken) {
      validateToken(user.mastertoken);
    } else {
      // else
      setgoogleAccessToken(undefined);
      setUser(undefined);
      settoken(undefined);
      location.hash = "#";
      localStorage.removeItem("cg." + tenant + ".auth");
    }
  };

  const register = async (email, password, confirm) => {
    console.log("Register");
    const body = {
      email: email,
      password: password,
      confirm: confirm,
    };
    return fetch(
      process.env.REACT_APP_AUTH_API + "/registration.php?debug=true",
      {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json", APP_ID: tenant, deviceid: deviceId },
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
        settoken(data.token);
        const userDetails = {
          email: data.email,
          lastname: data.lastname,
          firstname: data.firstname,
          id: data.id,
          name: data.firstname + " " + data.lastname,
          picture: data.avatar,
          permissions: data.permissions,
        };
        setUser(userDetails);
        return data;
      })
      .catch((err) => {
        if (onError) {
          onError("Auth: Unable to complete Registration", err);
        }
      });
    return { email, password, confirm };
  };

  const login = (email, password) => {
    const body = {
      email: email,
      password: password,
    };

    return fetch(process.env.REACT_APP_AUTH_API + "/login.php?debug=true", {
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json", APP_ID: tenant, deviceid: deviceId },
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
        settoken(data.token);
        const userDetails = {
          email: data.email,
          lastname: data.lastname,
          firstname: data.firstname,
          id: data.id,
          name: data.firstname + " " + data.lastname,
          picture: data.avatar,
          permissions: data.permissions,
        };
        setUser(userDetails);
        return data;
      })
      .catch((err) => {
        if (onError) {
          onError("Auth: Unable to complete Login", err);
        }
      });
  };

  const forgot = async (email) => {
    console.log("forgot", email);
    const body = {
      email: email,
    };
    console.log("process.env.REACT_APP_AUTH_API", process);
    return fetch(
      process.env.REACT_APP_AUTH_API + "/forgotpassword.php?debug=true",
      {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json", APP_ID: tenant, deviceid: deviceId },
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("FORGOT PASSWORD DATA", data);
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
        console.log("Forgot password response)  ", data);
        return data;
      })
      .catch((err) => {
        if (onError) {
          onError("Auth: Unable to complete Forgot Password", err);
        }
      });
  };

  const changePassword = (id, old, password, password2) => {
    console.log("change password", id, old, password, password2);
    const body = {
      userid: id,
      oldpassword: old,
      password: password,
      password2: password2,
    };
    console.log("process.env.REACT_APP_AUTH_API", process);
    return fetch(
      process.env.REACT_APP_AUTH_API + "/changepassword.php?debug=true",
      {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json", APP_ID: tenant, deviceid: deviceId },
        method: "POST",
      }
    ).catch((err) => {
      if (onError) {
        onError("Auth: Unable to complete Chnage Password", err);
      }
    });
  };

  const impersonate = (id) => {
    console.log("Impersonate", id);
    fetch(
      process.env.REACT_APP_AUTH_API + "/impersonate.php?debug=true&id=" + id,
      {
        headers: {
          "Content-Type": "application/json",
          APP_ID: tenant,
          token: token, 
          deviceid: deviceId,
        },
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
        if (data.errors) {
          console.error("IMPERSONATE TOKEN ERRORS", data.errors);
        }
        settoken(data.token);
        const userDetails = {
          email: data.email,
          lastname: data.lastname,
          firstname: data.firstname,
          id: data.id,
          name: data.firstname + " " + data.lastname,
          picture: data.avatar,
          permissions: data.permissions,
          mastertoken: data.mastertoken,
        };
        setUser(userDetails);
        if (window.location.hash.includes("auth")) {
          window.location.hash = "#";
        }
      })
      .catch((err) => {
        if (onError) {
          onError("Auth: Unable to Validate Token", err);
        }
      });
    return true;
  };

  const values = useMemo(
    () => ({
      token,
      register,
      login,
      logout,
      forgot,
      user,
      setgoogleAccessToken,
      changePassword,
      impersonate,
    }),
    [
      token,
      register,
      login,
      logout,
      forgot,
      user,
      setgoogleAccessToken,
      changePassword,
      impersonate,
    ]
  );

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthenticationContext.Provider value={values}>
        {children}
      </AuthenticationContext.Provider>
    </GoogleOAuthProvider>
  );
};

export { AuthenticationContext, AuthenticationProvider };
export default AuthenticationProvider;
