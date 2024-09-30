import React, { useState, useEffect } from "react";
import { MenuItem, Divider } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "routes/paths";

import { getclassAsync, getClassStatusAsync } from "redux/class/class.async";
import { emptyclass } from "redux/class/class.slice";
import { useDispatch, useSelector } from "react-redux";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
const MenuPopupBoard = ({ openPopover, handleClosePopover, classinfo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { classLoader, classes, getClassStatus } = useSelector(
    (state) => state.class
  );
  const { modulePermit } = useSelector((state) => state.menuPermission);

  useEffect(() => {
    if (getClassStatus.status === 200) {
      toast.success(getClassStatus.message, toastoptions);
      dispatch(emptyclass());
      dispatch(getclassAsync({ page: 1, limit: 10, status: "all" }));
    }
  }, [getClassStatus]);

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
            navigate(`${PATH_DASHBOARD.editclass}/${classinfo.id}`);
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
              classId: classinfo.id,
              status: classinfo.status === 1 ? 0 : 1,
            };
            dispatch(getClassStatusAsync(payload));
          }}
        >
          <Iconify icon="eva:eye-fill" />
          {classinfo?.status === 1 ? "Inactive" : "Active"}
        </MenuItem>
      </MenuPopover>
    </>
  );
};

export default MenuPopupBoard;
