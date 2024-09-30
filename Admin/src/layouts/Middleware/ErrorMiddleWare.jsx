import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { emptyErrorMessage } from "redux/slices/error.slice";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
import { Box } from "@material-ui/core";

const ErrorMiddleWare = ({ children }) => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.error);

  useEffect(() => {
    if (error) {
      toast.error(error, toastoptions);
      dispatch(emptyErrorMessage());
    }
  }, [error]);

  return <Box>{children}</Box>;
};

export default ErrorMiddleWare;
