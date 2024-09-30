import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import useOffSetTop from "hooks/useOffSetTop";
import useResponsive from "hooks/useResponsive";
import { HEADER, NAV } from "config";
import Logo from "components/logo";
import Iconify from "components/iconify";
import { useSettingsContext } from "components/settings";
import AccountPopover from "./AccountPopover";
import NotificationsPopover from "./NotificationsPopover";
import { getAllCoursesForWebAppAsync } from "../../../redux/async.api";
import Card from "@mui/material/Card";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CourseSwitch from "./CourseSwitch";
import Avatar from "@mui/material/Avatar";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function Header({ onOpenNav }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { studentById } = useSelector((state) => state?.student);
  const { allCoursesLoader, allCourses = [] } = useSelector(
    (state) => state.completeProfile
  );
  const [activeCourse, setActiveCourse] = useState({});
  const [courseDialog, setCourseDialog] = useState(false);

  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const { name } = studentById;
  const { themeLayout } = useSettingsContext();

  const isNavHorizontal = themeLayout === "horizontal";

  const isNavMini = themeLayout === "mini";

  const isDesktop = useResponsive("up", "lg");

  const isOffset = useOffSetTop(HEADER.H_DASHBOARD_DESKTOP) && !isNavHorizontal;

  useEffect(() => {
    dispatch(getAllCoursesForWebAppAsync());
  }, []);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const filterCourse = allCourses?.filter(
    (item) => studentById?.courseId == item?.id
  );

  const renderContent = (
    <>
      {isDesktop && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}

      {!isDesktop && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1, color: "text.primary" }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      )}
      {/*studentById?.courseId !== 7 && (
        <Typography
          sx={{
            fontFamily: "sans-serif",
            color: "black",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          Hello, {name}
        </Typography>
      )*/}

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={{ xs: 0.5, sm: 1.5 }}
      >
        <Box
          sx={{
            padding: "5px 10px",
            borderRadius: "5px",
            boxShadow: "0px 2px 10px 0px rgba(0, 0, 0, 0.25)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
          onClick={toggleDrawer("right", true)}
        >
          <Avatar
            alt="avatar"
            src={filterCourse[0]?.image}
            sx={{ width: 25, height: 25 }}
          />
          <Typography
            sx={{
              fontFamily: "sans-serif",
              color: "black",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            {studentById?.courseName}
          </Typography>
          <ChevronRightIcon sx={{ color: "black" }} />
        </Box>

        <CourseSwitch
          toggleDrawer={toggleDrawer}
          setState={setState}
          state={state}
          allCoursesLoader={allCoursesLoader}
          allCourses={allCourses}
          setActiveCourse={setActiveCourse}
          activeCourse={activeCourse}
          setCourseDialog={setCourseDialog}
          courseDialog={courseDialog}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "sans-serif",
              color: "black",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            Hello, {name}{" "}
            {studentById.course_type == "Subscription" && (
              <span style={{ fontSize: "90%", fontWeight: 500 }}>
                ({studentById?.batchTypeName})
              </span>
            )}
          </Typography>
          {/*studentById?.courseId == 7 && (
            <Typography
              sx={{
                fontFamily: "sans-serif",
                color: "black",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Hello, {name}
            </Typography>
          )*/}
          <NotificationsPopover sx={{ mr: 2 }} />
          <AccountPopover />
        </Box>
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        // bgcolor: "primary.main",
        // background: "linear-gradient(to right, #098A4E, #9ADD00)",
        backgroundColor: "#fff",
        boxShadow: "none",
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        borderBottom: "1px dashed #ccc",
        transition: theme.transitions.create(["height"], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(isDesktop && {
          width: `calc(100% - ${NAV.W_DASHBOARD + 1}px)`,
          height: HEADER.H_DASHBOARD_DESKTOP,
          ...(isOffset && {
            height: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: "background.default",
            height: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
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
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}
