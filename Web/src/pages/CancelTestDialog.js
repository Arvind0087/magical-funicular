import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Typography from "@mui/material/Typography";

const CancelTestDialog = ({ setDailogOpen, dialogOpen }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    setDailogOpen(false);
  };

  const handleCancelClick = () => {
    setDailogOpen(false);
    navigate("/");
  };

  return (
    <Dialog open={dialogOpen} fullWidth maxWidth="xs" minHeight="80vh">
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <DialogTitle id="dialog-title">
            <Typography variant="h4">Cancel the Test</Typography>
          </DialogTitle>
        </Box>
        <Box>
          <IconButton color="primary" size="large">
            <HighlightOffIcon onClick={handleClose} />
          </IconButton>
        </Box>
      </Box>
      <DialogContent
        sx={{
          display: "block",
          justifyContent: "center",
          paddingInline: "20px",
          paddingBottom: "35px",
          overflowY: "hidden !important",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          <Typography variant="h6">Are you want to cancel the test?</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          <Button
            variant="contained"
            sx={{
              height: "100%",
              borderRadius: "12px",
              height: "40px",
              mt: 6,
              width: "40%",
              color: "white",
              bgcolor: "primary.main",
              paddingTop: "8px",
            }}
            onClick={handleCancelClick}
          >
            Yes
          </Button>
          <Button
            variant="contained"
            sx={{
              height: "100%",
              borderRadius: "12px",
              height: "40px",
              mt: 6,
              width: "40%",
              color: "white",
              bgcolor: "primary.main",
              paddingTop: "8px",
            }}
            onClick={handleClose}
          >
            No
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
export default CancelTestDialog;
