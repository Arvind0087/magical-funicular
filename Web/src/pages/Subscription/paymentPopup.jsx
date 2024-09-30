import PropTypes from "prop-types";
// @mui
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

// ----------------------------------------------------------------------

ConfirmDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.node,
  action: PropTypes.node,
  content: PropTypes.node,
  onClose: PropTypes.func,
};

export default function ConfirmDialog({
  title,
  content,
  content2,
  action,
  open,
  onClose,
  ...other
}) {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

     <Box sx={{display:'flex'}}>
      
     {content && (
        
        <Typography sx={{ fontSize:'16px' , fontWeight:'600' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {content} &nbsp;&nbsp;&nbsp;&nbsp;</Typography>
      )}
     </Box>

      <DialogActions>
        {action}

        {/* <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button> */}
      </DialogActions>
    </Dialog>
  );
}
