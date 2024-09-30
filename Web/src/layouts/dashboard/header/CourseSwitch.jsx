import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SelectClassBatchDialog from "./SelectClassBatchDialog";

export default function CourseSwitch({
  toggleDrawer,
  setState,
  state,
  allCoursesLoader,
  allCourses,
  setActiveCourse,
  setCourseDialog,
  courseDialog,
  activeCourse,
}) {
  const list = (anchor) => (
    <Box
      sx={{ width: { xs: "300px", sm: "450px" } }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Typography
        sx={{ fontSize: "18px", fontWeight: 600, ml: 1, mt: 2, mb: 2 }}
      >
        What do you want to study?
      </Typography>
      <List>
        {allCoursesLoader
          ? "Loading...."
          : allCourses?.length > 0 &&
            allCourses?.map((text, index) => (
              <Box
                sx={{
                  boxShadow: "0px 2px 5px 0px rgba(0, 0, 0, 0.25)",
                  // padding: "15px 10px",
                  mb: 3,
                  ml: 2,
                  mr: 2,
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
                onClick={(event) => {
                  // event.stopPropagation();
                  setActiveCourse(text);
                  setCourseDialog(true);
                }}
              >
                <ListItem key={text} disablePadding>
                  <ListItemButton
                    onClick={(event) => {
                      // event.stopPropagation();
                      // setActiveCourse(text);
                      // setCourseDialog(true);
                    }}
                    sx={{ padding: "20px 15px" }}
                  >
                    <ListItemIcon>
                      <Avatar
                        alt="avatar"
                        src={text?.image}
                        sx={{ width: 30, height: 30 }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={text?.name} />
                    <ListItemIcon>
                      <ChevronRightIcon />
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem>
              </Box>
            ))}
      </List>
    </Box>
  );

  return (
    <div>
      {["left", "right", "top", "bottom"].map((anchor) => (
        <React.Fragment key={anchor}>
          {/*<Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button> */}
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            // onClose={(event) => {
            //   event.stopPropagation();
            // }
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}

      <SelectClassBatchDialog
        courseDialog={courseDialog}
        setCourseDialog={setCourseDialog}
        setActiveCourse={setActiveCourse}
        activeCourse={activeCourse}
      />
    </div>
  );
}
