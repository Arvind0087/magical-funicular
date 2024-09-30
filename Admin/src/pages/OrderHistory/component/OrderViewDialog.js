import React from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import { Grid } from "@mui/material";
import DisplayOrders from "./DisplayOrders";

function OrderViewDialog({ handleClose, openDialog, orderInfo }) {
  return (
    <div className="reportDialog">
      <Dialog
        fullWidth
        maxWidth="lg"
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{orderInfo?.userName}</DialogTitle>
        <Box>
          <Button
            onClick={handleClose}
            autoFocus
            color="error"
            style={{
              position: "absolute",
              top: 1,
              right: 1,
              borderRadius: "20px",
            }}
            variant="outlined"
          >
            <CloseIcon />
          </Button>
        </Box>

        <DialogContent style={{ display: "flex" }}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={12}>
              <DisplayOrders orderInfo={orderInfo} />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default OrderViewDialog;
