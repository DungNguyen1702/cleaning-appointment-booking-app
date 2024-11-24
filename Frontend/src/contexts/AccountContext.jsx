import { createContext, useState, useEffect, useMemo } from "react";
import axiosClient from "../utils/customFetch";
import LoginAPI from "../api/loginAPI";

const AccountContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [account, setAccount] = useState(
    JSON.parse(localStorage.getItem("user_info"))
  );

  useEffect(() => {
    if (token) {
      // Set authenticate token to axios
      axiosClient.application.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      axiosClient.formData.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      LoginAPI.login()
        .then((response) => {
          setAccount(response.data);
          localStorage.setItem("user_info", JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      // User logout
      delete axiosClient.application.defaults.headers.common["Authorization"];

      setAccount(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_info");
    }
  }, [token]);

  const login = (userInfo, accessToken) => {
    localStorage.setItem("user_info", JSON.stringify(userInfo));
    localStorage.setItem("access_token", accessToken);
    setAccount(userInfo);
    setToken(accessToken);
  };

  const logout = () => {
    localStorage.removeItem("user_info");
    localStorage.removeItem("access_token");
    setAccount(null);
    setToken(null);
  };

  const providerValue = { token, setToken, account, setAccount, login, logout };

  return (
    <AccountContext.Provider value={providerValue}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContext;
