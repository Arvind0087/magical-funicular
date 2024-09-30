import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import { Box, Divider, Typography, Stack, MenuItem } from "@mui/material";
import { PATH_DASHBOARD, PATH_AUTH } from "routes/paths";
import { CustomAvatar } from "components/custom-avatar";
import { useSnackbar } from "components/snackbar";
import MenuPopover from "components/menu-popover";
import { IconButtonAnimate } from "components/animate";
import { useDispatch, useSelector } from "react-redux";
import { emptyMenu } from "redux/slices/permission/permission.slice";
import ConfirmDialog from "components/confirm-dialog/ConfirmDialog";
import { capitalize } from "lodash";

const OPTIONS = [
  {
    label: "Home",
    linkTo: "/",
  },
  {
    label: "Change Password",
    linkTo: PATH_DASHBOARD.changePassword,
  },
];

export default function AccountPopover() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userinfo } = useSelector((state) => state.userinfo);

  const { enqueueSnackbar } = useSnackbar();

  const [openPopover, setOpenPopover] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("auth");
      dispatch(emptyMenu());
      navigate(PATH_AUTH.login, { replace: true });
      handleClosePopover();
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Unable to logout!", { variant: "error" });
    }
  };

  const handleClickItem = (path) => {
    handleClosePopover();
    navigate(path);
  };

  return (
    <>
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
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <CustomAvatar
          src={userinfo?.avatar}
          alt={userinfo?.name}
          name={userinfo?.name}
        />
      </IconButtonAnimate>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        sx={{ width: 200, p: 0 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {userinfo?.name} ({capitalize(userinfo?.userType)})
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {userinfo?.email}
          </Typography>
        </Box>
        <Divider sx={{ borderStyle: "dashed" }} />
        <Stack sx={{ p: 1 }}>
          {OPTIONS.map((option) => (
            <MenuItem
              key={option.label}
              onClick={() => handleClickItem(option.linkTo)}
            >
              {option.label}
            </MenuItem>
          ))}
        </Stack>
        <Divider sx={{ borderStyle: "dashed" }} />
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
    </>
  );
}
