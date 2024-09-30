import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import SelectClassBatch from "./SelectClassBatch";

function SelectClassBatchDialog({
  courseDialog,
  setCourseDialog,
  activeCourse,
}) {
  const handleClose = () => {
    setCourseDialog(false);
  };

  return (
    <Dialog
      open={courseDialog}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      // fullScreen
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          cursor: "pointer",
        }}
        onClick={handleClose}
      >
        <CloseIcon />
      </DialogTitle>
      <SelectClassBatch
        activeCourse={activeCourse}
        setCourseDialog={setCourseDialog}
      />
      {/*<DialogContent sx={{ paddingBottom: "25px" }}></DialogContent>*/}
    </Dialog>
  );
}

export default SelectClassBatchDialog;
