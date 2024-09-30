
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/material';
import  Box from "@mui/material/Box";
import  Button from "@mui/material/Button";
import  Card from "@mui/material/Card";
import  Grid from "@mui/material/Grid";
import  Typography from "@mui/material/Typography";
import session from '../../../../assets/images/session.svg';
import calender from '../../../../assets/images/calender.svg';
import { getSubjectByBatchTypeIdAsync } from '../../../../redux/async.api';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import DoubtPopover from './DoubtPopover';

const BookEvent = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const dispatch = useDispatch();
    const { studentById } = useSelector(state => state?.student)
    const { courseId, boardId, classId, batchTypeId, subscriptionType } = studentById;
    const { subjectBy } = useSelector(state => state?.subject)
    // states...
    const [open, setOpen] = useState(false);

    const [selectedValue, setSelectedValue] = useState([]);
    const handleClickOpen = () => {
        setOpen(true);
        if (courseId) {
            dispatch(
                getSubjectByBatchTypeIdAsync({
                    courseId: courseId,
                    boardId: boardId,
                    classId: classId,
                    batchTypeId: batchTypeId,
                })
            );
        }
    };

    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
    };
    //NOTE: navigate to demo calender page
    const handleDemoCalenderPage = () =>{
        navigate(PATH_DASHBOARD.demoCalender)
      }
    return (
        <>
            <Grid container spacing={3}>
                {
                    (studentById?.subscriptionType === 'Premium') ?
                        <Grid item xs={12} md={6} >
                            <Card
                                sx={{
                                    width: '100%',
                                    height: 150,
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    p: '20px 17px',
                                    mt: '30px',
                                    display: 'flex',
                                    flexDirection: "row",
                                    backgroundColor: '#FFF2F7',
                                }}
                            >
                                <Grid item xs={3}><img src={calender} height='100px' width='100px' /></Grid>
                                <Grid item xs={8}>
                                    <Box sx={{ display: 'block' }}>
                                        <Typography variant='h5'>Request a Doubt Session</Typography>
                                        <Button
                                            onClick={handleClickOpen}
                                            sx={{
                                                borderRadius: '60px',
                                                color: '#ffff',
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: '35px',
                                                width: '50%',
                                                mt: 2,
                                                backgroundColor: '#FF0059',
                                                [theme.breakpoints.down('md')]: {
                                                    width: '100%',
                                                },
                                            }}
                                            type="submit"
                                            className='OTP-button'
                                            variant="contained"
                                        >
                                            View Slots
                                        </Button>
                                    </Box>
                                </Grid>
                            </Card>
                        </Grid> : null
                }
                {
                    (studentById?.subscriptionType === 'Free') ?
                        <Grid item xs={12} md={6}>
                            <Card
                                sx={{
                                    width: '100%',
                                    height: 150,
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    p: '20px 17px',
                                    mt: '30px',
                                    display: 'flex',
                                    flexDirection: "row",
                                    backgroundColor: '#F2F9FF',
                                }}
                            >
                                <Grid item xs={3}><img src={session} height='100px' width='100px' /></Grid>
                                <Grid item xs={8}>
                                    <Box sx={{ display: 'block' }}>
                                        <Typography variant='h5'>Request a Demo Session</Typography>
                                        <Button
                                            onClick={handleDemoCalenderPage}
                                            sx={{
                                                borderRadius: '60px',
                                                color: '#ffff',
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: '35px',
                                                width: '50%',
                                                mt: 2,
                                                backgroundColor: '#68B1FC',
                                                [theme.breakpoints.down('md')]: {
                                                    width: '100%',
                                                },
                                            }}
                                            type="submit"
                                            className='OTP-button'
                                            variant="contained"
                                        >
                                            View Slots
                                        </Button>
                                    </Box>


                                </Grid>
                            </Card>
                        </Grid> : null
                }

            </Grid>

            <DoubtPopover
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
                subjectBy={subjectBy}
            />

        </>
    )
}

export default BookEvent;
