import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { storemodulepermit } from "redux/menusPermission/menupermission";
import { useState } from "react";

const RoutePermissionMiddleware = ({ children }) => {
  let { pathname } = useLocation();
  const dispatch = useDispatch();
  const { routepermission } = useSelector((state) => state.menuPermission);

  useEffect(() => {
    // ROUTE CHECKING
    if (routepermission.length > 0) {
      if (_.includes(pathname, "edit")) {
        pathname = `${pathname.split("edit/")[0]}edit`;
      }
      const findRoute = _.find(routepermission, (ev) => ev.path === pathname);
      console.log("permitted-route", findRoute);
      dispatch(storemodulepermit(findRoute));
    }
  }, [routepermission]);

  return <Box>{children}</Box>;
};

export default RoutePermissionMiddleware;
