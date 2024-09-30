import React from "react";
import { Box } from "@material-ui/core";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PATH_AUTH } from "routes/paths";
import _ from "lodash";

const AuthMiddleware = ({ children }) => {
  const navigate = useNavigate();

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.data.status === 401) {
        localStorage.removeItem("auth");
        navigate(PATH_AUTH.login);
      }
      return Promise.reject(error);
    }
  );

  return <Box>{children}</Box>;
};

export default AuthMiddleware;
