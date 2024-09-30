import { MenuItem } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { PATH_DASHBOARD } from "routes/paths";

const MenuPopupSub = ({
  openPopover,
  handleClosePopover,
  subscriptioninfo,
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
            navigate(
              `${PATH_DASHBOARD.editpackagesubscription}/${subscriptioninfo.id}`
            );
          }}

          disabled={!Boolean(modulePermit?.edit)}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            handleClosePopover();
            navigate(
              `${PATH_DASHBOARD.packagesubscription}/${subscriptioninfo.id}`
            );
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View
        </MenuItem> */}
      </MenuPopover>
    </>
  );
};

export default MenuPopupSub;
