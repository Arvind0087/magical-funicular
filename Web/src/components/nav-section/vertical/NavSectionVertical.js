import PropTypes from "prop-types";
// @mui
import { List, Stack } from "@mui/material";
// locales
import { useLocales } from "../../../locales";
//
import { StyledSubheader } from "./styles";
import NavList from "./NavList";
import { getstudentbyidAsync } from "redux/async.api";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";

// ----------------------------------------------------------------------

NavSectionVertical.propTypes = {
  sx: PropTypes.object,
  data: PropTypes.array,
};

export default function NavSectionVertical({ data, sx, ...other }) {
  const { translate } = useLocales();
  const { studentLoader, studentById } = useSelector((state) => state?.student);
  return (
    <Stack sx={sx} {...other}>
      {data.map((group) => {
        const key = group.subheader || group.items[0].title;
        return (
          <List key={key} disablePadding sx={{ px: 2 }}>
            {group.subheader && (
              <StyledSubheader disableSticky>
                {translate(group.subheader)}
              </StyledSubheader>
            )}

            {group.items.map((list) => {
              return (
                <NavList
                  key={list.title + list.path}
                  data={list}
                  depth={1}
                  hasChild={!!list.children}
                />
              );

              // return studentById?.subscriptionType === "Free" &&
              //   list.title === "Doubts" ? (
              //   ""
              // ) : (
              //   <NavList
              //     key={list.title + list.path}
              //     data={list}
              //     depth={1}
              //     hasChild={!!list.children}
              //   />
              // );
            })}
          </List>
        );
      })}
    </Stack>
  );
}
