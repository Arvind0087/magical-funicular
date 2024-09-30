import React, { useState, useEffect } from "react";
import { Divider, MenuItem } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "routes/paths";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllVoucherAsync,
  updateVoucherStatusAsync,
} from "redux/voucher/voucher.async";
import { emptyVoucher } from "redux/voucher/voucher.slice";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";

const MenuPopupVoucher = ({ openPopover, handleClosePopover, voucherinfo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { getStatus, statusLoader } = useSelector((state) => state.voucher);

  useEffect(() => {
    if (getStatus?.status === 200) {
      toast.success(getStatus.message, toastoptions);
      dispatch(emptyVoucher());
      dispatch(getAllVoucherAsync({ page: 1, limit: 10, status: "all" }));
    }
  }, [getStatus]);

  console.log("voucherinfo?.status...", voucherinfo?.status);

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
            const payload = {
              Id: voucherinfo.id,
              status: voucherinfo.status === 1 ? 0 : 1,
            };
            dispatch(updateVoucherStatusAsync(payload));
          }}
        >
          <Iconify icon="eva:eye-fill" />
          {voucherinfo?.status === 1 ? "Inactive" : "Active"}
        </MenuItem>
        <Divider sx={{ borderStyle: "dashed" }} />
        <MenuItem
          onClick={() => {
            handleClosePopover();
            navigate(`${PATH_DASHBOARD.editvoucher}/${voucherinfo.id}`);
          }}
          disabled={
            voucherinfo?.status == 0 ? true : !Boolean(modulePermit?.edit)
          }
          // disabled={true}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
      </MenuPopover>
    </>
  );
};

export default MenuPopupVoucher;
