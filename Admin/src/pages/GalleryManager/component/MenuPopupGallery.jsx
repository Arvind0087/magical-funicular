import { Divider, MenuItem } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { PATH_DASHBOARD } from "routes/paths";

const MenuPopup = ({
  openPopover,
  handleClosePopover,
  galleryinfo,
  setOpenConfirm,
  setopenView,
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
            // setopenView(true);
            window.open(galleryinfo.url, "_blank", "noreferrer");
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View
        </MenuItem>
        {/* <Divider sx={{ borderStyle: "dashed" }} /> */}

        {/* <MenuItem
          onClick={() => {
            handleClosePopover();
            navigate(`${PATH_DASHBOARD.editgallery}/${galleryinfo.id}`);
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem> */}

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
