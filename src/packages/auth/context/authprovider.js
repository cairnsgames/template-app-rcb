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
import { combineUrlAndPath } from "../../../functions/combineurlandpath";
import useEventing from "../../eventing/useeventing";
import i18n from "i18next";

const AuthenticationContext = createContext();

const AuthenticationProvider = (props) => {
  const { children, googleClientId, onError } = props;
  const [token, settoken] = useState();
  const [googleAccessToken, setgoogleAccessToken] = useState();
  const [user, setUser] = useState();
  const { decodedToken } = useJwt(googleAccessToken || "");
  const [properties, setProperties] = useState([]);
  const [propertiesLoaded, setPropertiesLoaded] = useState(false);
  const [roles, setRoles] = useState([]);

  const { tenant } = useTenant();
  const { deviceId } = useDeviceInfo();

  if (!process.env.REACT_APP_AUTH_API) {
    throw new Error(
      "AuthProvider: REACT_APP_AUTH_API environment variable is required"
    );
  }

  console.log("==== AUTH PROVIDER", process.env.REACT_APP_AUTH_API);

  useEffect(() => {
    if (token) {
      localStorage.setItem("cg." + tenant + ".auth", token);
    }
  }, [token]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }
    fetchProperties();
  }, [user]);

  const validateToken = (token) => {
    const body = { token: token };
    fetch(
      combineUrlAndPath(
        process.env.REACT_APP_AUTH_API,
        "validateToken.php?debug=true"
      ),
      {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          APP_ID: tenant,
          deviceid: deviceId,
        },
        method: "POST",
      }
    )
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
        // Do not show the authentication screen when validating token
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
  };

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

  const reloadPermissions = async () => {
    const savedToken = localStorage.getItem("cg." + tenant + ".auth");
    if (savedToken && savedToken !== "undefined") {
      // Validate Token
      validateToken(savedToken);
    }
  };

  useEventing("permissions", "reload", reloadPermissions);

  const getGoogleUser = useCallback(async () => {
    if (googleAccessToken && decodedToken) {
      const decodedToken2 = decodedToken;
      console.log("GOOGLE ACCESS TOKEN", decodedToken);
      // setUser({
      //   email: decodedToken2.email,
      //   lastname: decodedToken2.lastname,
      //   firstname: decodedToken2.firstname,
      //   id: decodedToken2.sub,
      //   name: decodedToken2.name,
      //   avatar: decodedToken2.picture,
      //   verified_email: decodedToken2.verified_email,
      //   permissions: decodedToken2.permissions,
      // });
      const body = {
        email: decodedToken2.email,
        firstname: decodedToken2.firstname,
        lastname: decodedToken2.lastname,
        googleid: decodedToken2.sub,
        avatar: decodedToken2.picture,
      };
      await fetch(
        combineUrlAndPath(process.env.REACT_APP_AUTH_API, `logingoogle.php`),
        {
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            APP_ID: tenant,
            deviceid: deviceId,
          },
          method: "POST",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("GOOGLE LOGIN", data);
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
    // Check if we have a master token
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

  // Sets the user's default city property after registration
  useEffect(() => {
    if (!user || !propertiesLoaded) return;
    const setUserDefaultCity = async () => {
      if (!user) return;
      try {
        // Check if city property already exists (case-insensitive and value check)
        const hasCity = properties.some(
          (p) =>
            p.name?.toLowerCase() === "city" &&
            p.value?.toLowerCase() === locationData.city.toLowerCase()
        );
        if (!hasCity) {
          const locationData = await window.AccessElf.getLocationData();
          if (!locationData?.city) return;
          // Only add if not already present
          const updatedProperties = [
            ...properties.filter((p) => p.name?.toLowerCase() !== "city"),
            { name: "city", value: locationData.city },
          ];
          await saveProperties(updatedProperties);
        }
      } catch (err) {
        if (onError) {
          // onError("Auth: Unable to set default city", err);
        }
      }
    };

    setUserDefaultCity();
    // Only run when user or properties change
  }, [user, properties, propertiesLoaded]);

  const register = async (email, password, confirm, firstName, lastName, language) => {
    const body = {
      email: email,
      password: password,
      confirm: confirm,
      firstname: firstName,
      lastname: lastName,
      language: language,
    };
    return fetch(
      combineUrlAndPath(
        process.env.REACT_APP_AUTH_API,
        `registration.php?debug=true`
      ),
      {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          APP_ID: tenant,
          deviceid: deviceId,
        },
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

    return fetch(
      combineUrlAndPath(process.env.REACT_APP_AUTH_API, `login.php?debug=true`),
      {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          APP_ID: tenant,
          deviceid: deviceId,
        },
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.errors) {
          console.error("Login Error!!!!", data.errors);
          return data;
        }
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

        window.location.hash = "#";
        return data;
      })
      .catch((err) => {
        if (onError) {
          onError("Auth: Unable to complete Login", err);
        }
        return err;
      });
  };

  const requestMagicLink = (email) => {
    const body = {
      code: email,
    };
    return fetch(
      combineUrlAndPath(process.env.REACT_APP_AUTH_API, `magic.php`),
      {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          APP_ID: tenant,
          deviceid: deviceId,
        },
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
        return data;
      })
      .catch((err) => {
        if (onError) {
          onError("Auth: Unable to complete Magic Link Request", err);
        }
      });
  };

  const loginWithMagicLink = (magiccode) => {
    console.log;
    const body = {
      code: magiccode,
    };

    return fetch(
      combineUrlAndPath(
        process.env.REACT_APP_AUTH_API,
        `loginwithmagiclink.php?debug=true`
      ),
      {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          APP_ID: tenant,
          deviceid: deviceId,
        },
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
        console.log("MAGIC LINK LOGIN", data);
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
        window.location.hash = "home";
      })
      .catch((err) => {
        if (onError) {
          onError("Auth: Unable to complete Login", err);
        }
      });
  };

  const forgot = async (email) => {
    const body = {
      email: email,
    };
    return fetch(
      combineUrlAndPath(
        process.env.REACT_APP_AUTH_API,
        `forgotpassword.php?debug=true`
      ),
      {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          APP_ID: tenant,
          deviceid: deviceId,
        },
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
        return data;
      })
      .catch((err) => {
        if (onError) {
          onError("Auth: Unable to complete Forgot Password", err);
        }
      });
  };

  const changePassword = (id, old, password, password2) => {
    const body = {
      userid: id,
      oldpassword: old,
      password: password,
      password2: password2,
    };
    return fetch(
      combineUrlAndPath(
        process.env.REACT_APP_AUTH_API,
        `changepassword.php?debug=true`
      ),
      {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          APP_ID: tenant,
          deviceid: deviceId,
        },
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        return data;
      })
      .catch((err) => {
        if (onError) {
          onError("Auth: Unable to complete Change Password", err);
        }
      });
  };

  const impersonate = (id) => {
    console.log("Impersonate", id);
    fetch(
      combineUrlAndPath(
        process.env.REACT_APP_AUTH_API,
        `/impersonate.php?debug=true&id=${id}`
      ),
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

  const fetchProperties = async () => {
    if (!user) {
      setProperties([]);
      setPropertiesLoaded(false);
      return;
    }
    await fetch(
      combineUrlAndPath(
        process.env.REACT_APP_AUTH_API,
        `/api.php/user/${user.id}/properties`
      ),
      {
        headers: {
          "Content-Type": "application/json",
          APP_ID: tenant,
          token: token,
        },
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
        setProperties(data);
        setPropertiesLoaded(true);
      })
      .catch((err) => {
        if (onError) {
          onError("Auth: Unable to fetch properties", err);
        }
      });
  };

  const saveProperties = async (properties) => {
    if (!user || !properties || !Array.isArray(properties)) {
      return;
    }

    const savePromises = properties.map((property) => {
      const url = property.id
        ? `${process.env.REACT_APP_AUTH_API}/api.php/property/${property.id}`
        : `${process.env.REACT_APP_AUTH_API}/api.php/property/`;

      const method = property.id ? "PUT" : "POST";

      return fetch(url, {
        headers: {
          "Content-Type": "application/json",
          APP_ID: tenant,
          token: token,
        },
        method: method,
        body: JSON.stringify(property),
      });
    });

    try {
      await Promise.all(savePromises);
      await fetchProperties();
    } catch (err) {
      if (onError) {
        onError("Auth: Unable to save properties", err);
      }
    }
  };

  const saveUser = (newUser) => {
    fetch(
      combineUrlAndPath(
        process.env.REACT_APP_AUTH_API,
        `api.php/user/${user.id}`
      ),
      // fetch(combineUrlAndPath("http://localhost/cairnsgames/php/auth", `api.php/user/${user.id}`),
      {
        body: JSON.stringify(newUser),
        headers: {
          "Content-Type": "application/json",
          APP_ID: tenant,
          token: token,
        },
        method: "PUT",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
        settoken(data.token);
        setUser(data);
      })
      .catch((err) => {
        if (onError) {
          onError("Auth: Unable to save user", err);
        }
      });
  };

  const oldIdToNewMapping = async (oldId) => {
    const resp = await fetch(
      combineUrlAndPath(
        process.env.REACT_APP_AUTH_API,
        `api.php/user/${oldId}/old`
      ),
      {
        headers: {
          "Content-Type": "application/json",
          APP_ID: tenant,
          token: token,
        },
      }
    );
    const data = await resp.json();
    return data[0].new_user_id;
  };

  const values = useMemo(
    () => ({
      token,
      register,
      login,
      requestMagicLink,
      loginWithMagicLink,
      logout,
      forgot,
      user,
      saveUser,
      setgoogleAccessToken,
      changePassword,
      impersonate,
      properties,
      propertiesLoaded,
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
      setgoogleAccessToken,
      changePassword,
      impersonate,
    ]
  );

  useEffect(() => {
    if (propertiesLoaded) {
      const languageProperty = properties.find((p) => p.name === "language");
      console.log("Language Property", languageProperty);
      if (languageProperty) {
        switch (languageProperty.value.toLowerCase()) {
          case "portuguese":
            console.log("Changing language to Portuguese");
            i18n.changeLanguage("pt");
            break;
          case "french":
            console.log("Changing language to French");
            i18n.changeLanguage("fr");
            break;
          case "spanish":
            console.log("Changing language to Spanish");
            i18n.changeLanguage("es");
            break;
          default:
            console.log("No specific language set");
            i18n.changeLanguage("en");
        }
      } else {
        console.log("No language property found, defaulting to English");
        i18n.changeLanguage("en");
      }
    }
  }, [propertiesLoaded, properties]);

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
