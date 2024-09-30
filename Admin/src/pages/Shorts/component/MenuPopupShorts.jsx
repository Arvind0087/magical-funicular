import { Divider, MenuItem } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import ConfirmDialog from "./DeleteShorts";
import { useDispatch } from "react-redux";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { emptyshorts } from "redux/slices/shorts.slice";
import { PATH_DASHBOARD } from "routes/paths";

const MenuPopupChapter = ({
  openPopover,
  handleClosePopover,
  shortsinfo,
  deleteShortAsync,
  getAllShortsAsync,
  perPageNumber,
  paginationpage,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { shorts, shortsLoader, shortsdelete } = useSelector(
    (state) => state.shorts
  );
  const [openConfirm, setOpenConfirm] = useState(false);
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };
  const deleteButton = () => {
    dispatch(deleteShortAsync(shortsinfo.id));
  };
  useEffect(() => {
    if (shortsdelete.status === 200) {
      toast.success(shortsdelete.message, toastoptions);
      handleCloseConfirm();
      dispatch(
        getAllShortsAsync({
          page: paginationpage,
          limit: perPageNumber,
        })
      );
      dispatch(emptyshorts());
    }
  }, [shortsdelete]);
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
            navigate(`${PATH_DASHBOARD.editshort}/${shortsinfo?.id}`);
          }}
          disabled={!Boolean(modulePermit?.edit)}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: "error.main" }}
          disabled={!Boolean(modulePermit?.remove)}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={shortsLoader}
            onClick={deleteButton}
          >
            Delete
          </LoadingButton>
        }
      />
    </>
  );
};

export default MenuPopupChapter;
