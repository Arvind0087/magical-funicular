import { Dialog, DialogTitle } from "@mui/material";
import React from "react";

const Index = ({ children, openModal, closeModal, title, size }) => {
  return (
    <Dialog fullWidth maxWidth={size} open={openModal} onClose={closeModal}>
      <DialogTitle>{title}</DialogTitle>
      {children}
    </Dialog>
  );
};

export default Index;
