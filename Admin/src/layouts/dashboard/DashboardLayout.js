import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import useResponsive from "../../hooks/useResponsive";
import { useSettingsContext } from "../../components/settings";
import Main from "./Main";
import Header from "./header";
import NavMini from "./nav/NavMini";
import NavVertical from "./nav/NavVertical";
import NavHorizontal from "./nav/NavHorizontal";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { PATH_DASHBOARD } from "routes/paths";

export default function DashboardLayout() {
  const { themeLayout } = useSettingsContext();
  const isDesktop = useResponsive("up", "lg");
  const [open, setOpen] = useState(false);
  const isNavHorizontal = themeLayout === "horizontal";
  const isNavMini = themeLayout === "mini";
  // const { pathname } = useLocation();
  // const navigate = useNavigate();

  // const { modulePermit } = useSelector((state) => state.menuPermission);

  // if (!Boolean(modulePermit?.path)) {
  //   navigate(PATH_DASHBOARD.app);
  // }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderNavVertical = (
    <NavVertical openNav={open} onCloseNav={handleClose} />
  );

  if (isNavHorizontal) {
    return (
      <>
        <Header onOpenNav={handleOpen} />
        {isDesktop ? <NavHorizontal /> : renderNavVertical}
        <Main>
          <Outlet />
        </Main>
      </>
    );
  }

  if (isNavMini) {
    return (
      <>
        <Header onOpenNav={handleOpen} />
        <Box
          sx={{
            display: { lg: "flex" },
            minHeight: { lg: 1 },
          }}
        >
          {isDesktop ? <NavMini /> : renderNavVertical}
          <Main>
            <Outlet />
          </Main>
        </Box>
      </>
    );
  }

  return (
    <>
      <Header onOpenNav={handleOpen} />
      <Box
        sx={{
          display: { lg: "flex" },
          minHeight: { lg: 1 },
        }}
      >
        {renderNavVertical}
        <Main>
          <Outlet />
        </Main>
      </Box>
    </>
  );
}
