import React, { useState, useEffect } from "react";
import { MenuItem, Divider } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "routes/paths";

import { useDispatch, useSelector } from "react-redux";
import {
  getAllBatchTypes,
  getBatchStatusAsync,
} from "redux/batchtype/batchtype.async";
import { emptybatch } from "redux/batchtype/batchtype.slice";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
const MenuPopupBoard = ({ openPopover, handleClosePopover, batchinfo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { batchLoader, batches, getBatchStatus } = useSelector(
    (state) => state.batch
  );

  useEffect(() => {
    if (getBatchStatus.status === 200) {
      toast.success(getBatchStatus.message, toastoptions);
      dispatch(emptybatch());
      dispatch(getAllBatchTypes({ page: 1, limit: 10, status: "all" }));
    }
  }, [getBatchStatus]);

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
            navigate(`${PATH_DASHBOARD.editbatchtype}/${batchinfo.id}`);
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
              batchTypeId: batchinfo.id,
              status: batchinfo.status === 1 ? 0 : 1,
            };
            dispatch(getBatchStatusAsync(payload));
          }}
        >
          <Iconify icon="eva:eye-fill" />
          {batchinfo?.status === 1 ? "Inactive" : "Active"}
        </MenuItem>
      </MenuPopover>
    </>
  );
};

export default MenuPopupBoard;
