import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from "react-hot-toast";
import { toastoptions } from "../../../utils/toastoptions";
import { mentorAllocationAsync } from '../../../redux/mentorship/mentorshipHelp.async';
import { PATH_DASHBOARD } from '../../../routes/paths';

const SubscribePopover = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { onClose, selectedValue, open, setOpen, } = props;
    const { studentById } = useSelector((state) => state?.student)
    // state
    const handleClose = () => {
        onClose(selectedValue);
    };
    const Request = () => {
        dispatch(
            mentorAllocationAsync()
        ).then(res => {
            const { payload } = res || {};
            const { status, message } = payload || {};
            if (status === 200) {
                navigate(PATH_DASHBOARD.app)
                toast.success(message, toastoptions)
                setOpen(false)
            }
        })
    }

    return (
        <Dialog open={open} fullWidth maxWidth="xs" maxHeight='80vh'>
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Box>
                    <DialogTitle id="dialog-title">
                        Mentorship Session
                    </DialogTitle>
                </Box>
                <Box>
                    <IconButton color="primary" size="large">
                        <HighlightOffIcon
                            onClick={handleClose}
                        />
                    </IconButton>
                </Box>
            </Box>
            <DialogContent sx={{ display: 'block', justifyContent: 'center', paddingInline: '20px', height: '120px', overflowY: 'hidden !important' }}>
                <Box><Typography variant="h5" >Are you sure you want to Purchase this ?</Typography></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Button
                        variant="contained"
                        sx={{
                            height: "100%",
                            borderRadius: "12px",
                            height: "40px",
                            mt: 3,
                            width: "35%",
                            color: "white",
                            bgcolor: "primary.main",
                            paddingTop: "8px",
                        }}
                        onClick={Request}
                    >Yes</Button>
                    <Button
                        variant="contained"
                        sx={{
                            height: "100%",
                            borderRadius: "12px",
                            height: "40px",
                            mt: 3,
                            width: "35%",
                            color: "white",
                            bgcolor: "primary.main",
                            paddingTop: "8px",
                        }}
                        onClick={handleClose}
                    >No</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}
export default SubscribePopover;
