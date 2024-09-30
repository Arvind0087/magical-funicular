import { MenuItem } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { PATH_DASHBOARD } from "routes/paths";

const MenuPopupSub = ({
  openPopover,
  handleClosePopover,
  reportInfo
}) => {
  const navigate = useNavigate();
  const { modulePermit } = useSelector((state) => state.menuPermission);
  return (
    <>
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 180 }}
      >
        <MenuItem
          onClick={() => {
            handleClosePopover();
            navigate(
              `${PATH_DASHBOARD.scholarshiptestreport}/${reportInfo?.id}`
              
            );
          }}
          
        >
          <Iconify icon="eva:eye-fill" />
          View Scholorship<br/>Test Report
        </MenuItem>
      </MenuPopover>
    </>
  );
};

export default MenuPopupSub;
