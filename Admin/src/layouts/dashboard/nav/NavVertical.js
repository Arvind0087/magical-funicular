import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Stack, Drawer } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import useResponsive from "hooks/useResponsive";
import { NAV } from "config";
import Logo from "components/logo";
import Scrollbar from "components/scrollbar";
import { NavSectionVertical } from "components/nav-section";

export default function NavVertical({ openNav, onCloseNav }) {
  const { pathname } = useLocation();
  // const dispatch = useDispatch();
  const isDesktop = useResponsive("up", "lg");
  // const { userinfo } = useSelector((state) => state.userinfo);
  const { permissionMenu } = useSelector((state) => state.menuPermission);

  console.log("permissionMenu...", permissionMenu);

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          pt: 0,
          pb: 1,
          px: 2.5,
          flexShrink: 0,
        }}
      >
        <Logo />
      </Stack>
      {permissionMenu.length > 0 && (
        <NavSectionVertical data={permissionMenu} />
      )}

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <>
      <Box
        component="nav"
        sx={{
          flexShrink: { lg: 0 },
          width: { lg: NAV.W_DASHBOARD },
        }}
      >
        {isDesktop ? (
          <Drawer
            open
            variant="permanent"
            PaperProps={{
              sx: {
                width: NAV.W_DASHBOARD,
                bgcolor: "transparent",
                borderRightStyle: "dashed",
              },
            }}
          >
            {renderContent}
          </Drawer>
        ) : (
          <Drawer
            open={openNav}
            onClose={onCloseNav}
            ModalProps={{
              keepMounted: true,
            }}
            PaperProps={{
              sx: {
                width: NAV.W_DASHBOARD,
              },
            }}
          >
            {renderContent}
          </Drawer>
        )}
      </Box>
    </>
  );
}
