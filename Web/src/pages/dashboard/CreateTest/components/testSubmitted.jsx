import React from 'react';
import Dialog from '@mui/material/Dialog';
import { Box } from '@mui/system';
import { Button, DialogContent, Typography } from '@mui/material';
import TimeWarning from '../../../../assets/images/TimeWarning.svg';
import TestSubmitted from '../../../../assets/images/TestSubmitted.svg';

const objectZeroSecs = {
    image:TestSubmitted,
    description:'Your test has been automatically submitted because the validity period has ended.',
    title:'Test Submitted',
    btnText:'Ok, Got It'
}
const objectOneMinutes = {
    image:TimeWarning,
    description:'Kindly submit your test within 1 minute. Afterward, the system will auto-submit it for you.',
    title:'Only 1 Minute Left',
    btnText:'Ok, I will Remember'
}

const TestSubmittedPopover = (props) => {
    const { onClose, selectedValue, openSubmitPopOver, remainingTime,examSummaryNoHandler } = props;
    let image, description,title,btnText;
    if (remainingTime === 0) {
        image = objectZeroSecs.image;
        description=objectZeroSecs.description;
        title=objectZeroSecs.title;
        btnText=objectZeroSecs.btnText;

      } else if (remainingTime <= 61 && remainingTime>=59) {
        image = objectOneMinutes.image;
        description=objectOneMinutes.description;
        title=objectOneMinutes.title;
        btnText=objectOneMinutes.btnText;
      } else {
        // Handle other remainingTime values here
      }
  
    const handleClose = () => {
        if(remainingTime===0){
            onClose(selectedValue);
        }else if(remainingTime <= 61 && remainingTime>=59){
            examSummaryNoHandler()
        }
    };
    return (

        <Dialog open={openSubmitPopOver} fullWidth maxWidth="xs"
            PaperProps={{
                style: {
                    minHeight: '45%',
                    mt: 1,
                }
            }}>

            <DialogContent sx={{ display: 'block', paddingInline: '20px', height: '150px', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: "100px", width: '100px', borderRadius: '50%', backgroundColor: 'primary.main', mr: '0 !important' }}>
                        <img src={image} height='80px' width='80px' /></Box>
                </Box>

                <Box sx={{ paddingInline: '35px', textAlign: 'center', color: '#787A8D' }}>
                    <Typography variant="h5" >{title}</Typography>
                    <Typography variant="p">{description}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Button
                        variant="contained"
                        sx={{
                            height: "100%",
                            borderRadius: "12px",
                            height: "40px",
                            mt: 4,
                            width: "70%",
                            color: "white",
                            bgcolor: "primary.main",
                            paddingTop: "8px",
                        }}
                        onClick={handleClose}
                    >{btnText}</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}
export default TestSubmittedPopover;
