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

import {
  updateBatchLanguageStatusAsync,
  getAllBatchLanguageAsync,
} from "redux/language/language.async";

import { emptybatch } from "redux/batchtype/batchtype.slice";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
import { emptylanguage } from "redux/language/language.slice";
const MenuPopupLanguage = ({ openPopover, handleClosePopover, batchinfo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { batchLoader, batches, getBatchStatus } = useSelector(
    (state) => state.batch
  );

  const { statusLoader, getStatus } = useSelector((state) => state.language);

  useEffect(() => {
    if (getStatus.status === 200) {
      toast.success(getStatus.message, toastoptions);
      dispatch(emptylanguage());
      dispatch(getAllBatchLanguageAsync({ page: 1, limit: 10, status: "all" }));
    }
  }, [getStatus]);

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
            navigate(`${PATH_DASHBOARD.editlanguage}/${batchinfo.id}`);
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
              LanguageId: batchinfo.id,
              status: batchinfo.status === 1 ? 0 : 1,
            };
            dispatch(updateBatchLanguageStatusAsync(payload));
          }}
        >
          <Iconify icon="eva:eye-fill" />
          {batchinfo?.status === 1 ? "Inactive" : "Active"}
        </MenuItem>
      </MenuPopover>
    </>
  );
};

export default MenuPopupLanguage;
