import { MenuItem } from "@mui/material";
import { useState } from "react";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import OrderViewDialog from "./OrderViewDialog";
import { PATH_DASHBOARD } from "routes/paths";

const MenuPopupOrder = ({ openPopover, handleClosePopover, orderInfo }) => {
  const navigate = useNavigate();
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const [openDialog, setOpenDialog] = useState(false);

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            handleClosePopover();
            setOpenDialog(true);
          }}
        >
          <VisibilityIcon icon="eva:edit-fill" />
          View
        </MenuItem>
      </MenuPopover>
      <OrderViewDialog
        openDialog={openDialog}
        handleClose={handleClose}
        orderInfo={orderInfo}
      />
    </>
  );
};

export default MenuPopupOrder;
