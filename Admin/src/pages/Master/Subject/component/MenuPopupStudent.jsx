import React, { useState, useEffect } from "react";
import { Divider, MenuItem } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "routes/paths";

import { useDispatch, useSelector } from "react-redux";
import {
  getAllSubjectsAsync,
  getSubjectStatusAsync,
} from "redux/subject/subject.async";
import { emptysubject } from "redux/subject/subject.slice";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";

const MenuPopupStudent = ({ openPopover, handleClosePopover, subjectinfo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { subjectLoader, subject, getSubjectStatus } = useSelector(
    (state) => state.subject
  );
  useEffect(() => {
    if (getSubjectStatus.status === 200) {
      toast.success(getSubjectStatus.message, toastoptions);
      dispatch(emptysubject());
      dispatch(getAllSubjectsAsync({ page: 1, limit: 10, status: "all" }));
    }
  }, [getSubjectStatus]);

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
            navigate(`${PATH_DASHBOARD.editsubject}/${subjectinfo.id}`);
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
              subjectId: subjectinfo.id,
              status: subjectinfo.status === 1 ? 0 : 1,
            };
            dispatch(getSubjectStatusAsync(payload));
          }}
        >
          <Iconify icon="eva:eye-fill" />
          {subjectinfo?.status === 1 ? "Inactive" : "Active"}
        </MenuItem>
      </MenuPopover>
    </>
  );
};

export default MenuPopupStudent;
