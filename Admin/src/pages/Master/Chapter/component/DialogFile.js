import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch, useSelector } from "react-redux";
import { FormControl, Button } from "@mui/material";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { updateChapterAsync } from "redux/chapter/chapter.async";

function DialogFile({
  handleClosePopover,
  open,
  setOpen,
  chapterinfo,
  orderSeq,
}) {
  const dispatch = useDispatch();
  const { updateSeqData, chapterSeq } = useSelector((state) => state.syllabus);

  const [seqVal, setSeqVal] = useState(orderSeq == "N/A" ? 0 : orderSeq);

  const setValue = (e) => {
    setSeqVal(e.target.value);
  };

  const handleClose = () => {
    setOpen(false);
    handleClosePopover();
  };

  const addSequence = () => {
    const videSequence = seqVal == "" ? 0 : seqVal;
    const payload = {
      chapterId: chapterinfo?.id,
      courseId: chapterinfo?.courseId,
      boardId: chapterinfo?.boardId,
      classId: chapterinfo?.classId,
      batchTypeId: chapterinfo?.batchTypeId,
      subjectId: chapterinfo?.subjectId,
      name: chapterinfo?.chapterName,
      ORDERSEQ: parseInt(videSequence),
    };

    if ((seqVal >= 0 && seqVal <= 1000) || seqVal == "" || seqVal == null) {
      dispatch(updateChapterAsync(payload)).then((res) => {
        if (res.payload.status) {
          toast.success(res.payload.message, toastoptions);
          setOpen(false);
        }
      });
    } else {
      toast.error("Please enter numbers between 0-1000", toastoptions);
      setOpen(true);
    }
  };

  return (
    <form>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Chapter Sequence</DialogTitle>
        <DialogContent>
          <DialogContentText>
            *Please add chapter sequence number to rearrange the chapters
            <br />
            *Add 0 to reset the sequence
          </DialogContentText>
          <FormControl fullWidth>
            <TextField
              autoFocus
              margin="dense"
              name="videoSeq"
              label="Add Sequence"
              type="number"
              fullWidth
              variant="standard"
              value={seqVal}
              onChange={(e) => {
                setValue(e);
              }}
              error={seqVal < 0 || seqVal > 1000 || seqVal == null}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={addSequence}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}

export default DialogFile;
