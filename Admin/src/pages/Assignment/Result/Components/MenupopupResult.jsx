import { Divider, MenuItem } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { PATH_DASHBOARD } from "routes/paths";
import { useNavigate } from "react-router";

const MenuPopupAssignment = ({
  openPopover,
  handleClosePopover,
  assignmentInfo
}) => {
  const navigate = useNavigate();
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
            if (assignmentInfo?.mode == "online") {
              navigate(`${PATH_DASHBOARD.onlinemode}/${assignmentInfo?.id}`, {
                state: {
                  id: assignmentInfo
                }
              });
            } else {
              // navigate(`${PATH_DASHBOARD.offlinemode}/${assignmentInfo?.id}`);
              navigate(`${PATH_DASHBOARD.offlinemode}/${assignmentInfo?.id}`, {
                state: {
                  id: assignmentInfo
                }
              });
            }

            // navigate(`${PATH_DASHBOARD.offlinemode}/${assignmentInfo?.id}`,{state:{
            //     id:assignmentInfo
            //   }});
          }}
        >
          <Iconify icon="eva:edit-fill" />
          View
        </MenuItem>
      </MenuPopover>
    </>
  );
};

export default MenuPopupAssignment;
