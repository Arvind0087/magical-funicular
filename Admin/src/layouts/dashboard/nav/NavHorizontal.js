import { memo } from "react";
import { useTheme } from "@mui/material/styles";
import { AppBar, Box, Toolbar } from "@mui/material";
import { HEADER } from "../../../config";
import { bgBlur } from "../../../utils/cssStyles";
import { NavSectionHorizontal } from "../../../components/nav-section";
import { DashMenus } from "../../Navigation/DashMenus";

const NavHorizontal = () => {
  const theme = useTheme();

  return (
    <AppBar
      component="nav"
      color="transparent"
      sx={{
        boxShadow: 0,
        top: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
      }}
    >
      <Toolbar
        sx={{
          ...bgBlur({
            color: theme.palette.background.default,
          }),
        }}
      >
        <NavSectionHorizontal data={DashMenus} />
      </Toolbar>

      <Shadow />
    </AppBar>
  );
};

export default memo(NavHorizontal);

const Shadow = ({ sx, ...other }) => {
  return (
    <Box
      sx={{
        left: 0,
        right: 0,
        bottom: 0,
        height: 24,
        zIndex: -1,
        width: 1,
        m: "auto",
        borderRadius: "50%",
        position: "absolute",
        boxShadow: (theme) => theme.customShadows.z8,
        ...sx,
      }}
      {...other}
    />
  );
};
