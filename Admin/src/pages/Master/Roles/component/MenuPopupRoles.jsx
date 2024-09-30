import { MenuItem } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { useSelector } from "react-redux";
import { PATH_DASHBOARD } from "routes/paths";
import { useNavigate } from "react-router";

const MenuPopupBoard = ({
  openPopover,
  handleClosePopover,
  InfoId,
  setActionModal,
  setIsFlagAction,
}) => {
  const navigate = useNavigate();
  const { modulePermit } = useSelector((state) => state.menuPermission);
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
            setActionModal(true);
            setIsFlagAction(true);
          }}
          disabled={!Boolean(modulePermit?.edit)}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClosePopover();
            navigate(`${PATH_DASHBOARD.permission}/${InfoId}`);
          }}
        >
          <Iconify icon="eva:eye-fill" />
          Permission
        </MenuItem>
      </MenuPopover>
    </>
  );
};

export default MenuPopupBoard;
