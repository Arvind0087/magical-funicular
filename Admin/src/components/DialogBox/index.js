import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function DialogBox({
  title,
  content,
  action,
  open,
  onClose,
  children,
  ...other
}) {
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onClose();
        }
      }}
      {...other}
      disableBackdropClick={true}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            style={{
              fontWeight: 800,
              fontSize: "20px",
            }}
          >
            {title}
          </Typography>
          <IconButton color="primary" size="large" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent> {children}</DialogContent>
    </Dialog>
  );
}
