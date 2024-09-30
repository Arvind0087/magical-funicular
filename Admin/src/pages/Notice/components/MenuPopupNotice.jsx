import { Divider, MenuItem } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import ConfirmDialog from "./DeleteNotice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import {getAllNoticeAsync, deleteNoticeAsync } from 'redux/async.api'

const MenuPopupChapter = ({
  openPopover,
  handleClosePopover,
  noticeInfo,
  perPageNumber,
  paginationpage,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notices, noticeLoader, deleteNotice } = useSelector(
    (state) => state.notice
  );
  const [openConfirm, setOpenConfirm] = useState(false);
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };
  const deleteButton = () => {
    dispatch(deleteNoticeAsync(noticeInfo.id));
  };
  useEffect(() => {
    if (deleteNotice.status === 200) {
      handleCloseConfirm();
    }
  }, [deleteNotice]);
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
            loading={noticeLoader}
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
