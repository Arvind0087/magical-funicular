import React, { useState, useEffect } from "react";
import { Divider, MenuItem } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "routes/paths";

import { useDispatch, useSelector } from "react-redux";
import {
  getAllSyllabusTopicAsync,
  getsyllabusTopicStatusAsync,
} from "redux/syllabuus/syllabus.async";
import { emptysyllabusTopic } from "redux/syllabuus/syllabus.slice";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
export default function MenuPopupChapter({
  openPopover,
  handleClosePopover,
  syllabusinfo,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { syllabusLoader, syllabustopic, getsyllabusTopicStatus } = useSelector(
    (state) => state.syllabus
  );

  useEffect(() => {
    if (getsyllabusTopicStatus.status === 200) {
      toast.success(getsyllabusTopicStatus.message, toastoptions);
      dispatch(emptysyllabusTopic());
      dispatch(getAllSyllabusTopicAsync({ page: 1, limit: 10, status: "all" }));
    }
  }, [getsyllabusTopicStatus]);
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
            navigate(`${PATH_DASHBOARD.edittopic}/${syllabusinfo?.id}`);
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
              topicId: syllabusinfo.id,
              status: syllabusinfo.status === 1 ? 0 : 1,
            };
            dispatch(getsyllabusTopicStatusAsync(payload));
          }}
        >
          <Iconify icon="eva:eye-fill" />
          {syllabusinfo?.status === 1 ? "Inactive" : "Active"}
        </MenuItem>
      </MenuPopover>
    </>
  );
}
