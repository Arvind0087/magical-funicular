import React, { useState, useEffect } from "react";
import { Divider, MenuItem } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "routes/paths";
import AnimationOutlinedIcon from "@mui/icons-material/AnimationOutlined";
import DialogFile from "./DialogFile";

import { useDispatch, useSelector } from "react-redux";
import {
  getAllChaptersAsync,
  getChapterStatusAsync,
} from "redux/chapter/chapter.async";
import { emptychapter } from "redux/chapter/chapter.slice";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
const MenuPopupChapter = ({ openPopover, handleClosePopover, chapterinfo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { chapterLoader, chapter, getChapterStatus } = useSelector(
    (state) => state.chapter
  );
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (getChapterStatus.status === 200) {
      toast.success(getChapterStatus.message, toastoptions);
      dispatch(emptychapter());
      dispatch(getAllChaptersAsync({ page: 1, limit: 10, status: "all" }));
    }
  }, [getChapterStatus]);

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
            navigate(`${PATH_DASHBOARD.editchapter}/${chapterinfo.id}`);
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
              chapterId: chapterinfo.id,
              status: chapterinfo.status === 1 ? 0 : 1,
            };
            dispatch(getChapterStatusAsync(payload));
          }}
        >
          <Iconify icon="eva:eye-fill" />
          {chapterinfo?.status === 1 ? "Inactive" : "Active"}
        </MenuItem>
        <Divider sx={{ borderStyle: "dashed" }} />
        <MenuItem
          onClick={() => {
            // handleClosePopover();
            handleClickOpen();
          }}
        >
          <AnimationOutlinedIcon />
          Chapter Seq
        </MenuItem>
        {open && (
          <DialogFile
            open={open}
            setOpen={setOpen}
            chapterinfo={chapterinfo}
            orderSeq={chapterinfo && chapterinfo?.ORDERSEQ}
            handleClosePopover={handleClosePopover}
          />
        )}
      </MenuPopover>
    </>
  );
};

export default MenuPopupChapter;
