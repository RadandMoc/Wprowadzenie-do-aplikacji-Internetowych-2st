import axios from "axios";
import { AppContext } from "./context/AppContext";
import React, { useContext, useEffect } from "react";

const AxiosSetup: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("AxiosSetup must be used within an AppProvider");
  }

  const { accessToken, logout } = context;

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          // Log out the user when a 401 error occurs
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, logout]);

  return null;
};

export default AxiosSetup;
