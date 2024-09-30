import { Divider, MenuItem } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "routes/paths";
import { useSelector } from "react-redux";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

const MenuPopup = ({ openPopover, handleClosePopover, teacherinfo, setActionModal }) => {
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
            navigate(`${PATH_DASHBOARD.editstaff}/${teacherinfo.id}`);
          }}
          disabled={!Boolean(modulePermit?.edit)}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClosePopover();
            navigate(`${PATH_DASHBOARD.staffattendance}/${teacherinfo?.id}`);
          }}
        >
          <EventAvailableIcon />
          Attendance
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClosePopover();
            setActionModal(true);
          }}
          disabled={Boolean(
            teacherinfo?.department !== "teacher"
            && teacherinfo?.department !== "Teacher"
            && teacherinfo?.department !== "mentor"
            && teacherinfo?.department !== "Mentor"
          )}
        >
          <Iconify icon="eva:edit-fill" />
          {teacherinfo?.batchType?.length ? "Update Batch" : "Add Batch"}
        </MenuItem>

      </MenuPopover>
    </>
  );
};

export default MenuPopup;
