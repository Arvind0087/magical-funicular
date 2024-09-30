import { Divider, MenuItem } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "routes/paths";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { studentActiveStatusAsync } from "redux/studentStatus/sudentStatus.async";
import { useSelector, useDispatch } from "react-redux";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
import { useState } from "react";

const MenuPopup = ({ openPopover, handleClosePopover, studentInfo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const [studentStatus, setStudentStatus] = useState(false);

  const handleStudentStatus = () => {
    let payload = { id: studentInfo?.id };
    dispatch(studentActiveStatusAsync(payload)).then((res) => {
      if (res?.payload?.status === 200) {
        toast.success(res?.payload?.message, toastoptions);
        setStudentStatus(true);
      }
    });
    handleClosePopover();
  };

  return (
    <>
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        {/*<MenuItem
          onClick={() => {
            handleClosePopover();
            navigate(
              `${PATH_DASHBOARD.profileStudentDashboard}/${studentInfo?.id}`
            );
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View
        </MenuItem>

        studentInfo?.studentType === "Primary" ? (
          studentInfo?.status === "Inactive" ? studentStatus !== true && (
            <MenuItem
              onClick={() => {
                handleStudentStatus();
              }}
            >
              <Iconify icon="eva:eye-fill" />
              "Inactive"
            </MenuItem>
          ) : (
            ""
          )
        ) : (
          ""
        ) */}
      </MenuPopover>
    </>
  );
};

export default MenuPopup;
