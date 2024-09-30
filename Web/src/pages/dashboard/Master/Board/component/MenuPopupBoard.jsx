import { Divider, MenuItem } from "@mui/material";
import MenuPopover from "../../../../../components/menu-popover/MenuPopover";
import Iconify from "../../../../../components/iconify/Iconify";
import { useNavigate } from "react-router";

const MenuPopupBoard = ({ openPopover, handleClosePopover, boardinfo }) => {
  const navigate = useNavigate();
  return (
    <>
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        {/* <MenuItem
          onClick={() => {
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View
        </MenuItem> */}

        <MenuItem
          onClick={() => {
            handleClosePopover();
            navigate(`/app/master/board/update/${boardinfo.id}`);
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        {/* <Divider sx={{ borderStyle: "dashed" }} /> */}

        {/* <MenuItem
          onClick={() => {
            handleClosePopover();
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem> */}
      </MenuPopover>
    </>
  );
};

export default MenuPopupBoard;
