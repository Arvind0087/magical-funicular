import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import VideoPlayer from "components/Player/VideoPlayer";

export default function DialogMui({ open, setOpen, urlVid, videoProvider }) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
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
        <DialogContent sx={{ paddingBottom: "25px" }}>
          <VideoPlayer src={urlVid} videoProvider={videoProvider} />
        </DialogContent>
      </Dialog>
    </>
  );
}
