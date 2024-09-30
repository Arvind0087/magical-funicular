import React, { useState, useEffect } from "react";
import { Divider, MenuItem } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "routes/paths";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePyqsAsync,
  getAllPyqsAsync,
} from "redux/freeResource/freeresource.async";
import { emptyfreeresourceSlice } from "redux/freeResource/freeresource.slice";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
export default function MenuPopupPyqs({
  openPopover,
  handleClosePopover,
  pyqsinfo,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { allPyqsLoader, allPyqs, deletePyqsLoader, deletePyqs } = useSelector(
    (state) => state.freeresource
  );

  useEffect(() => {
    if (deletePyqs.status === 200) {
      toast.success(deletePyqs.message, toastoptions);
      dispatch(emptyfreeresourceSlice());
      dispatch(getAllPyqsAsync({ page: 1, limit: 10, year: "" }));
    }
  }, [deletePyqs]);

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
            navigate(`${PATH_DASHBOARD.editpyqs}/${pyqsinfo?.id}`);
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
            const payload = {
              id: pyqsinfo.id,
            };
            dispatch(deletePyqsAsync(payload));
          }}
        >
          <DeleteIcon />
          Delete
        </MenuItem>
      </MenuPopover>
    </>
  );
}
