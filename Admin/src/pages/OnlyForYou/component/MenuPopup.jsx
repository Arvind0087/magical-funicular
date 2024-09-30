import { Divider, MenuItem } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "routes/paths";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

const MenuPopup = ({
  openPopover,
  handleClosePopover,
  onlyinfo,
  setOpenConfirm,
  setStatus
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
            navigate(`${PATH_DASHBOARD.editonlyforyou}/${onlyinfo.id}`);
          }}
          disabled={!Boolean(modulePermit?.edit)}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <Divider sx={{ borderStyle: "dashed" }} />
        <MenuItem
          onClick={() => {
            handleClosePopover();
            setStatus(true);
          }}
        >
          <EventAvailableIcon />
          Change  Status
        </MenuItem>

        <Divider sx={{ borderStyle: "dashed" }} />
        <MenuItem
          onClick={() => {
            handleClosePopover();
            setOpenConfirm(true);
          }}
          sx={{ color: "error.main" }}
          disabled={!Boolean(modulePermit?.remove)}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>
    </>
  );
};

export default MenuPopup;
