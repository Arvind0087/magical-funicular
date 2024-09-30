import PropTypes from "prop-types";
import { noCase } from "change-case";
import { useState, useEffect } from "react";
// @mui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
// utils
import { fToNow } from "../../../utils/formatTime";
// _mock_
import { _notifications } from "../../../_mock/arrays";
// components
import Iconify from "../../../components/iconify";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import Scrollbar from "../../../components/scrollbar";
import MenuPopover from "../../../components/menu-popover";
import { IconButtonAnimate } from "../../../components/animate";
import {
  getStudentLatestNoticeAsync,
  getAllNoticeByStudentIdAsync,
} from "redux/async.api";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { PATH_DASHBOARD } from "routes/paths";
import CustomComponentLoader from "components/CustomComponentLoader";
import { CustomAvatar } from "components/custom-avatar";
// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { latestNotification, latestNotificationLoader } = useSelector(
    (state) => state?.notification
  );

  const [openPopover, setOpenPopover] = useState(null);

  const [notifications, setNotifications] = useState(_notifications);

  const totalUnRead = notifications.filter(
    (item) => item.isUnRead === true
  ).length;

  const { studentById } = useSelector((state) => state?.student);

  const { notification } = useSelector((state) => state);
  const { allNotification, allNotificationLoader } = notification;

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    );
  };

  useEffect(() => {
    dispatch(getStudentLatestNoticeAsync());
  }, []);

  useEffect(() => {
    dispatch(
      getAllNoticeByStudentIdAsync({
        studentId: studentById?.id,
      })
    );
  }, [studentById?.id]);

  const goToAllNotifications = () => {
    navigate(PATH_DASHBOARD.viewAllNotifications);
    handleClosePopover();
  };
  return (
    <>
      <IconButtonAnimate
        color={openPopover ? "primary" : "default"}
        onClick={handleOpenPopover}
        sx={{ width: 40, height: 40, mr: 2, fontSize: "28px" }}
      >
        <Badge
        //  badgeContent={totalUnRead} color="error"
        >
          <Iconify
            icon="eva:bell-fill"
            sx={{ color: "#fdd33f", width: 25, height: 25 }}
          />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        sx={{ width: 360, p: 0 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>

            {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography> */}
          </Box>

          {/* {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )} */}
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Scrollbar sx={{ height: { xs: 340, sm: "auto" } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader
                disableSticky
                sx={{ py: 1, px: 2.5, typography: "overline" }}
              >
                New
              </ListSubheader>
            }
          >
            {latestNotificationLoader ? (
              <>
                <Box
                  sx={{
                    width: "100%",
                    mt: 20,
                    display: "flex",
                    justifyContent: "center",
                    color: "primary.main",
                  }}
                >
                  <CustomComponentLoader padding="0" size={50} />
                </Box>
              </>
            ) : (
              <>
                {latestNotification?.length > 0 ? (
                  latestNotification.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      latestNotificationLoader={latestNotificationLoader}
                    />
                  ))
                ) : (
                  <Typography variant="h6" sx={{ textAlign: "center", pb: 1 }}>
                    No latest notification
                  </Typography>
                )}
              </>
            )}
          </List>
        </Scrollbar>
        <Box sx={{ display: allNotification.length > 0 ? "block" : "none" }}>
          <Divider sx={{ borderStyle: "dashed" }} />

          <Box sx={{ p: 1 }}>
            <Button fullWidth disableRipple onClick={goToAllNotifications}>
              View All
            </Button>
          </Box>
        </Box>
      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.string,
    avatar: PropTypes.node,
    type: PropTypes.string,
    title: PropTypes.string,
    isUnRead: PropTypes.bool,
    description: PropTypes.string,
    createdAt: PropTypes.instanceOf(Date),
  }),
};

function NotificationItem({ notification, latestNotificationLoader }) {
  const { avatar, title } = renderContent(notification);

  //NOTE: navigate to notification page
  const handleNotificationClick = (webBackLink, otherLink) => {
    if (otherLink === null) {
      return window.location.replace(webBackLink);
    } else {
      const newWindow = window.open(otherLink, "_blank");
      return (newWindow.opener = null);
    }
  };

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: "1px",
        ...(notification.isUnRead && {
          bgcolor: "action.selected",
        }),
      }}
      onClick={() => {
        handleNotificationClick(
          notification?.webBackLink,
          notification?.otherLink
        );
      }}
    >
      <ListItemAvatar>
        {notification.image != null ? (
          <CustomAvatar src={notification?.image} alt={""} name={""} />
        ) : (
          <Avatar>
            <DoneAllIcon sx={{ color: "primary.main" }} />
          </Avatar>
        )}
      </ListItemAvatar>

      <ListItemText
        disableTypography
        primary={title}
        secondary={
          <Stack
            direction="row"
            sx={{ mt: 0.5, typography: "caption", color: "text.disabled" }}
          >
            <Iconify icon="eva:clock-fill" width={16} sx={{ mr: 0.5 }} />
            <Typography variant="caption">
              {fToNow(notification.createdAt)}
            </Typography>
          </Stack>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography
        component="span"
        variant="body2"
        sx={{
          color: "text.secondary",
          "& p": {
            // Custom style for p tag
            margin: 0, // Remove margin
          },
        }}
        dangerouslySetInnerHTML={{ __html: notification.description }}
      ></Typography>
    </Typography>
  );

  if (notification.type === "order_placed") {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="/assets/icons/notification/ic_package.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === "order_shipped") {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="/assets/icons/notification/ic_shipping.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === "mail") {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="/assets/icons/notification/ic_mail.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === "chat_message") {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="/assets/icons/notification/ic_chat.svg"
        />
      ),
      title,
    };
  }
  return {
    avatar: notification.avatar ? (
      <img alt={notification.title} src={notification.avatar} />
    ) : null,
    title,
  };
}
