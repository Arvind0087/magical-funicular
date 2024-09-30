import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import { LoadingButton } from "@mui/lab";
import { PATH_DASHBOARD, PATH_AUTH } from "routes/paths";
import { CustomAvatar } from "components/custom-avatar";
import { useSnackbar } from "components/snackbar";
import MenuPopover from "components/menu-popover";
import { IconButtonAnimate } from "components/animate";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
import ConfirmDialog from "components/confirm-dialog/ConfirmDialog";
import NotificationsIcon from "@mui/icons-material/Notifications";
import RateUs from "pages/dashboard/RateUs/RateUs";
import { addUserSpendTimeAsync } from "redux/async.api";
import NavAccount from "./NavAccount";
import NavVertical from "./NavVertical";

const OPTIONS = [
  {
    label: "Home",
    linkTo: "/",
  },
  {
    label: "Help & Support",
    linkTo: PATH_DASHBOARD.helpAndSupport,
  },
  {
    label: "Profile",
    linkTo: PATH_DASHBOARD.UpdateProfile,
  },
  {
    label: "Subscription",
    linkTo: PATH_DASHBOARD.subscription,
  },
  {
    label: "Refer & Earn",
    linkTo: PATH_DASHBOARD.referearn,
  },
  // {
  //   label: "My Learning Reports",
  //   linkTo: PATH_DASHBOARD.myLearningReports,
  // },
  {
    label: "Recent Activity",
    linkTo: PATH_DASHBOARD.recentActivity,
  },
];

export default function AccountPopover() {
  const navigate = useNavigate();
  const user = {};
  const { studentById } = useSelector((state) => state?.student);
  const { avatar, name, course_type } = studentById;
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  // const filteredOptions = OPTIONS.filter((option) => {
  //   if (course_type == "Subscription") {
  //     return option;
  //   } else {
  //     return option.label !== "Subscription";
  //   }
  // });

  const filteredOptions = OPTIONS.filter((option) => {
    return !(course_type !== "Subscription" && option.label === "Subscription");
  });

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleLogout = async () => {
    try {
      handleClosePopover();
      dispatch(
        addUserSpendTimeAsync({
          status: "close",
        })
      );
      dispatch({ type: "LOGOUT" }); // define code in store in action.type === 'LOGOUT'
      toast.success("Logged out Successfully");
    } catch (error) {
      enqueueSnackbar("Unable to logout!", { variant: "error" });
    }
  };

  const handleClickItem = (path) => {
    handleClosePopover();
    navigate(path);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* <NotificationsIcon sx={{fontSize:'28px', mr:2}}/> */}
      <IconButtonAnimate
        onClick={handleOpenPopover}
        sx={{
          p: 0,
          ...(openPopover && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <CustomAvatar src={avatar} alt={name} name={name} />
      </IconButtonAnimate>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        sx={{ width: 250, p: 0 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.displayName}
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <NavAccount isOpen={isOpen} setIsOpen={setIsOpen} />
        <NavVertical openNav={isOpen} onCloseNav={handleClose} />

        <Stack sx={{ p: 1 }}>
          {filteredOptions?.map((option) => (
            <MenuItem
              key={option.label}
              onClick={() => handleClickItem(option.linkTo, option.label)}
            >
              {option.label}
            </MenuItem>
          ))}
          <MenuItem onClick={handleOpen}>Rate Us</MenuItem>
        </Stack>
        {/* <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem> */}
        <MenuItem
          onClick={() => {
            handleClosePopover();
            setOpenConfirm(true);
          }}
          sx={{ m: 1 }}
        >
          Logout
        </MenuItem>
      </MenuPopover>
      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="Logout"
        content="Are you sure want to Logout?"
        action={
          <LoadingButton
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{ m: 1 }}
          >
            Yes
          </LoadingButton>
        }
      />
      <RateUs open={open} setOpen={setOpen} />
    </>
  );
}
