import React, { useState, useEffect } from "react";
import { Divider, MenuItem } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import MenuPopover from "components/menu-popover/MenuPopover";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "routes/paths";

import { useDispatch, useSelector } from "react-redux";
import {
  getcourseAsync,
  getCourseStatusAsync,
} from "redux/course/course.async";

import { emptycourse } from "../../../../redux/course/course.slice";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
const MenuPopupCourse = ({ openPopover, handleClosePopover, courseinfo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { courseLoader, course, getCourseStatus } = useSelector(
    (state) => state.course
  );

  useEffect(() => {
    if (getCourseStatus.status === 200) {
      toast.success(getCourseStatus.message, toastoptions);
      dispatch(emptycourse());
      dispatch(getcourseAsync({ page: 1, limit: 10, status: "all" }));
    }
  }, [getCourseStatus]);
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
            navigate(`${PATH_DASHBOARD.editcourse}/${courseinfo.id}`);
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
              courseId: courseinfo.id,
              status: courseinfo.status === 1 ? 0 : 1,
            };
            dispatch(getCourseStatusAsync(payload));
          }}
        >
          <Iconify icon="eva:eye-fill" />
          {courseinfo?.status === 1 ? "Inactive" : "Active"}
        </MenuItem>
      </MenuPopover>
    </>
  );
};

export default MenuPopupCourse;
