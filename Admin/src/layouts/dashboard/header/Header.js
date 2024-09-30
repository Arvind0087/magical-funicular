import { useTheme } from "@mui/material/styles";
import { Stack, AppBar, Toolbar, IconButton } from "@mui/material";
import useOffSetTop from "hooks/useOffSetTop";
import useResponsive from "hooks/useResponsive";
import { HEADER, NAV } from "config";
import Logo from "components/logo";
import Iconify from "components/iconify";
import { useSettingsContext } from "components/settings";
import { useSelector } from "react-redux";
import AccountPopover from "./AccountPopover";
import Typography from "theme/overrides/Typography";

export default function Header({ onOpenNav }) {
  const theme = useTheme();
  const { themeLayout } = useSettingsContext();
  const isNavHorizontal = themeLayout === "horizontal";
  const isNavMini = themeLayout === "mini";
  const isDesktop = useResponsive("up", "lg");
  const isOffset = useOffSetTop(HEADER.H_DASHBOARD_DESKTOP) && !isNavHorizontal;
  const { userinfo } = useSelector((state) => state.userinfo);

  const renderContent = (
    <>
      {isDesktop && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}

      {!isDesktop && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1, color: "text.primary" }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      )}

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1.5 }}
      >
        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        boxShadow: "none",
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        // ...bgBlur({
        //   color: theme.palette.background.default,
        // }),
        transition: theme.transitions.create(["height"], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(isDesktop && {
          width: `calc(100% - ${NAV.W_DASHBOARD + 1}px)`,
          // height: HEADER.H_DASHBOARD_DESKTOP,
          height:'60px',

          ...(isOffset && {
            // height: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
            height:'60px'
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: "background.default",
            // height: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
            height:'60px',
            borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_DASHBOARD_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
          fontSize: "20px",
          fontWeight: 600,
        }}
      >
        Hello, {userinfo?.name}
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}
