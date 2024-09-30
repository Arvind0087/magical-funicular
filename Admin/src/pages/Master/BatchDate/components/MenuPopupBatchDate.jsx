import React, { useState, useEffect } from "react";
import { Divider, MenuItem } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "routes/paths";

import { useDispatch, useSelector } from "react-redux";
import {
  getAllBatchDatesAsync,
  getBatchDateStatusAsync,
} from "redux/batchdate/batchdate.async";
import { emptybatchdate } from "redux/batchdate/batchdate.slice";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
const MenuPopupBatchDate = ({
  openPopover,
  handleClosePopover,
  batchdateinfo,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { batchdateLoader, batchdate, getBatchDateStatus } = useSelector(
    (state) => state.batchdate
  );
  useEffect(() => {
    if (getBatchDateStatus.status === 200) {
      toast.success(getBatchDateStatus.message, toastoptions);
      dispatch(emptybatchdate());
      dispatch(getAllBatchDatesAsync({ page: 1, limit: 10, status: "all" }));
    }
  }, [getBatchDateStatus]);

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
            navigate(`${PATH_DASHBOARD.editbatchdate}/${batchdateinfo.id}`);
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
              batchDateId: batchdateinfo.id,
              status: batchdateinfo.status === 1 ? 0 : 1,
            };
            dispatch(getBatchDateStatusAsync(payload));
          }}
        >
          <Iconify icon="eva:eye-fill" />
          {batchdateinfo?.status === 1 ? "Inactive" : "Active"}
        </MenuItem>
      </MenuPopover>
    </>
  );
};

export default MenuPopupBatchDate;
