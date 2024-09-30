import React from "react";
import { Box } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getSettingForAdminAsync } from "redux/slices/SiteSettingsSlice/WebAsync.api";

const SiteInfoMiddleWare = ({ children }) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getSettingForAdminAsync({}));
  }, []);

  return <Box>{children}</Box>;
};

export default SiteInfoMiddleWare;
