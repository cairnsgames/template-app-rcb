import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useJwt } from "react-jwt";
import useTenant from "../../tenant/context/usetenant";

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
  console.log("AUTH TENANT", tenant)

  if (!process.env.REACT_APP_AUTH_API) {
    throw new Error("AuthProvider: REACT_APP_AUTH_API environment variable is required");
  }

  console.log("process.env", process.env.REACT_APP_AUTH_API);
  console.log("APPLICATION ID For Auth", tenant);
  console.log("google ClinetId", googleClientId);

  useEffect(() => {
    console.log("Auth Tenant", tenant);
  }, [tenant]);

  useEffect(() => {
    console.log("USER DETAILS CHANGED", user);
  }, [user]);

  useEffect(() => {
    console.log("TOKEN CHANGED", token);
    if (token) {
      localStorage.setItem("cg." + tenant + ".auth", token);
    }
  }, [token]);

  useEffect(() => {
    if (!process.env) {
      return;
    }
    console.log("Process or Tenant Change", tenant);
    const savedToken = localStorage.getItem("cg." + tenant + ".auth");
    if (savedToken && savedToken !== "undefined") {
      // Validate Token
      const body = { token: savedToken };
      console.log("ValidateToken env", process.env.REACT_APP_AUTH_API);
      fetch(process.env.REACT_APP_AUTH_API + "/validateToken.php?debug=true", {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json", APP_ID: tenant },
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
          };
          setUser(userDetails);
          console.log("REMEMBER ME", userDetails);
          if (window.location.hash.includes("auth")) {
            window.location.hash = "#";
          }
        }).catch((err) => {
          if (onError) {
            onError("Auth: Unable to Validate Token",err);
          }
        });;
      settoken(savedToken);
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
        headers: { "Content-Type": "application/json", APP_ID: tenant },
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("GOOGLE LOGIN", data);
          settoken(data.token);
          window.location.hash = "#";
        }).catch((err) => {
          if (onError) {
            onError("Auth: Unable to complete Google Login",err);
          }
        });;
    }
  }, [googleAccessToken, decodedToken]);

  useEffect(() => {
    if (googleAccessToken) {
      getGoogleUser();
    }
  }, [googleAccessToken, getGoogleUser]);

  const logout = () => {
    console.log("Logout");
    setgoogleAccessToken(undefined);
    setUser(undefined);
    settoken(undefined);
    location.hash = "#";
    localStorage.removeItem("cg." + tenant + ".auth");
  };

  const register = async (email, password, confirm) => {
    console.log("Register");
    const body = {
      email: email,
      password: password,
      confirm: confirm,
    };
    return fetch(process.env.REACT_APP_AUTH_API + "/registration.php?debug=true", {
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json", APP_ID: tenant },
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
        };
        setUser(userDetails);
        return data;
      }).catch((err) => {
        if (onError) {
          onError("Auth: Unable to complete Registration",err);
        }
      });
    return { email, password, confirm};
  }

  const login = (email, password) => {
    console.log("Login", email, password);
    const body = {
      email: email,
      password: password,
    };
    
    console.log("APP_ID", tenant);
    return fetch(process.env.REACT_APP_AUTH_API + "/login.php?debug=true", {
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json", APP_ID: tenant },
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("LOGIN DATA", data);
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
        };
        console.log("LOGIN DETAILS", userDetails);
        setUser(userDetails);
        return data;
      }).catch((err) => {
        if (onError) {
          onError("Auth: Unable to complete Login",err);
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
        headers: { "Content-Type": "application/json", APP_ID: tenant },
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
      }).catch((err) => {
        if (onError) {
          onError("Auth: Unable to complete Forgot Password",err);
        }
      });
  };

  const changePassword = (
    id,
    old,
    password,
    password2
  ) => {
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
        headers: { "Content-Type": "application/json", APP_ID: tenant },
        method: "POST",
      }
    ).catch((err) => {
      if (onError) {
        onError("Auth: Unable to complete Chnage Password",err);
      }
    })
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
    }),
    [token, register, login, logout, forgot, user, setgoogleAccessToken, changePassword]
  );  

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthenticationContext.Provider
        value={values}
      >
        {children}
      </AuthenticationContext.Provider>
    </GoogleOAuthProvider>
  );
};

export { AuthenticationContext, AuthenticationProvider };
export default AuthenticationProvider;
