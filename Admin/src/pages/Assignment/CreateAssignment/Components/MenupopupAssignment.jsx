import { Divider, MenuItem } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { PATH_DASHBOARD } from "routes/paths";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const MenuPopupAssignment = ({
  openPopover,
  handleClosePopover,
  assignmentInfo,
}) => {
 const navigate = useNavigate()
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
            navigate(`${PATH_DASHBOARD.editassignment}/${assignmentInfo?.id}`);
          }}
          disabled={!Boolean(modulePermit?.edit)}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
      </MenuPopover>
    </>
  );
};

export default MenuPopupAssignment;
