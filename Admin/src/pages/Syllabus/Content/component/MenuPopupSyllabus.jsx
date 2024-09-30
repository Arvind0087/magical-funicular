import React, { useState } from "react";
import { Divider, MenuItem } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { PATH_DASHBOARD } from "routes/paths";
import DialogFile from "./DialogFile";
import AnimationOutlinedIcon from "@mui/icons-material/AnimationOutlined";

export default function MenuPopupChapter({
  openPopover,
  handleClosePopover,
  syllabusinfo,
  setOpenConfirm,
}) {
  const navigate = useNavigate();
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

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
            navigate(`${PATH_DASHBOARD.editcontent}/${syllabusinfo?.id}`);
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
            setOpenConfirm(true);
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
        <Divider sx={{ borderStyle: "dashed" }} />
        <MenuItem
          onClick={() => {
            // handleClosePopover();
            handleClickOpen();
          }}
        >
          <AnimationOutlinedIcon />
          Video Seq
        </MenuItem>

        <DialogFile
          open={open}
          setOpen={setOpen}
          syllabusId={syllabusinfo?.id}
          subjectId={syllabusinfo && syllabusinfo?.subject[0]?.subjectId}
          chapterId={syllabusinfo && syllabusinfo?.chapter[0]?.chapterId}
          topicId={syllabusinfo && syllabusinfo?.topic[0]?.topicId}
          orderSeq={syllabusinfo && syllabusinfo?.ORDERSEQ}
          handleClosePopover={handleClosePopover}
        />
      </MenuPopover>
    </>
  );
}
