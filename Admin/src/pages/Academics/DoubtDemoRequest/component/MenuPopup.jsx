import { Divider, MenuItem } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
const MenuPopup = ({
  openPopover,
  handleClosePopover,
  setOpenConfirm,
  setActionModal
}) => {
  return (
    <>
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem      
           onClick={(e) =>{
            handleClosePopover();
            setActionModal(true)
           }
           
            }
        >
          <Iconify icon="eva:edit-fill" />
          Accept
        </MenuItem>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem
          onClick={() => {
            handleClosePopover();
            setOpenConfirm(true);
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Reject
        </MenuItem>
      </MenuPopover>
    </>
  );
};

export default MenuPopup;
