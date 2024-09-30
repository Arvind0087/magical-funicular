import { useEffect } from "react";
import { Box } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import {
  storepermission,
  storeroutepermission,
} from "redux/menusPermission/menupermission";
import { IconsGenerate, PATH_ROUTE } from "layouts/dashboard/nav/utils";

const NavigateMiddleware = ({ children }) => {
  const dispatch = useDispatch();
  const { userinfo } = useSelector((state) => state.userinfo);

  useEffect(() => {
    if (userinfo?.route?.length > 0) {
      const InfoRoute = [];
      const routeInfo = [];
      for (let route of userinfo?.route) {
        // CHECK IF PARENT IS AVALIABLE OR NOT
        if (Boolean(route.parent === "")) {
          // PUSH PARENT IS NOT AVALIABLE
          InfoRoute.push({
            title: route.title,
            path: PATH_ROUTE[route.path],
            icon: IconsGenerate(route.icon),
          });
          if (route.add) {
            routeInfo.push({
              id: route.id,
              path: `${PATH_ROUTE[route.path]}/create`,
            });
          }
          if (route.edit) {
            routeInfo.push({
              id: route.id,
              path: `${PATH_ROUTE[route.path]}/edit`,
            });
          }
          routeInfo.push({
            id: route.id,
            path: PATH_ROUTE[route.path],
            add: route.add,
            view: route.view,
            edit: route.edit,
            remove: route.remove,
          });
        } else {
          // FIND PARENT INDEX
          const findIndex = InfoRoute.findIndex(
            (ev) => ev.title === route.parent
          );
          if (findIndex !== -1) {
            // PUSH CHILD IF PARENT EXIST
            InfoRoute[findIndex].children.push({
              title: route.title,
              path: PATH_ROUTE[route.path],
            });
            if (route.add) {
              routeInfo.push({
                id: route.id,
                path: `${PATH_ROUTE[route.path]}/create`,
              });
            }
            if (route.edit) {
              routeInfo.push({
                id: route.id,
                path: `${PATH_ROUTE[route.path]}/edit`,
              });
            }
            routeInfo.push({
              id: route.id,
              path: PATH_ROUTE[route.path],
              add: route.add,
              view: route.view,
              edit: route.edit,
              remove: route.remove,
            });
          } else {
            // PARENT PARENT IF PARENT IS NOT EXIST
            InfoRoute.push({
              title: route.parent,
              path: PATH_ROUTE[route.parent],
              icon: IconsGenerate(route.icon),
              children: [],
            });
            // AFTER PARENT CREATE NEED TO FIND INDEX
            const findIndexInner = InfoRoute.findIndex(
              (ev) => ev.title === route.parent
            );
            // PUSH CHILD IN PARENT
            InfoRoute[findIndexInner].children.push({
              title: route.title,
              path: PATH_ROUTE[route.path],
            });
            if (route.add) {
              routeInfo.push({
                id: route.id,
                path: `${PATH_ROUTE[route.path]}/create`,
              });
            }
            if (route.edit) {
              routeInfo.push({
                id: route.id,
                path: `${PATH_ROUTE[route.path]}/edit`,
              });
            }
            routeInfo.push({
              id: route.id,
              path: PATH_ROUTE[route.path],
              add: route.add,
              view: route.view,
              edit: route.edit,
              remove: route.remove,
            });
          }
        }
      }
      // SET ROUTE
      dispatch(
        storepermission([
          {
            subheader: "general",
            items: InfoRoute,
          },
        ])
      );
      dispatch(storeroutepermission(routeInfo));
    } else {
      dispatch(
        storepermission([
          {
            subheader: "general",
            items: [],
          },
        ])
      );
    }
  }, [userinfo]);

  return <Box>{children}</Box>;
};

export default NavigateMiddleware;
