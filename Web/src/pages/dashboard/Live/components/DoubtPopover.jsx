import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useFormik } from "formik";
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import  Box from "@mui/material/Box";
import * as yup from 'yup';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { getAllScheduleOfMonthByTeacherIdAsync, getAllStaffDetailsBySubjectIdAsync } from '../../../../redux/async.api';
import { emptyteacher } from '../../../../redux/slices/teacher.slice';
import { PATH_DASHBOARD } from '../../../../routes/paths';

const DoubtPopover = (props) => {
    const { onClose, selectedValue, open, subjectBy } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { getAllStaffDetailsBySubjectId } = useSelector(state => state?.teachers)
    // state
    const [subjectId, setSubjectId] = useState();

    const _initialValues = {
        subjectId: null,
        teacherId: null
    }
    const validate = yup.object().shape({
        subjectId: yup
            .number()
            .required("Message is required"),
        teacherId: yup
            .number()
            .required("Message is required"),
    });


    const handleClose = () => {
        dispatch(emptyteacher())
        onClose(selectedValue);
    };
    useEffect(() => {
        if (subjectId) {
            dispatch(
                getAllStaffDetailsBySubjectIdAsync({
                    subjectId: subjectId
                })
            )
        }
    }, [subjectId])

    useEffect(() => {
        dispatch(emptyteacher())
    }, [])


    const onSubmit = (value) => {
        console.log('value', value)
        navigate(PATH_DASHBOARD.calender)
        if (value.teacherId) {
            dispatch(
                getAllScheduleOfMonthByTeacherIdAsync({
                    teacherId: value.teacherId
                })
            )
        }
    }

    const formik = useFormik({
        initialValues: _initialValues,
        onSubmit,
        validationSchema: validate,
    }); // FOMRIK

    return (
        <Dialog open={open} fullWidth maxWidth="xs" minHeight='80vh'>
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Box>
                    <DialogTitle id="dialog-title">
                        Request a Doubt Session
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
            <DialogContent sx={{ display: 'block', justifyContent: 'center', paddingInline: '20px', height: '250px', overflowY: 'hidden !important' }}>
                <form onSubmit={formik.handleSubmit}>
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel id="demo-simple-select-label">Subject</InputLabel>
                        <Select
                            fullWidth
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="subject"
                            // value={selectedSubjects}
                            defaultValue={''}
                            {...formik.getFieldProps("subjectId")}
                            onChange={(event) => {
                                formik.handleChange(event);
                                setSubjectId(event.target.value)
                            }}
                            error={
                                formik.touched.subjectId &&
                                Boolean(formik.errors.subjectId)
                            }
                            sx={{ width: '100%' }}
                        >
                            <MenuItem value={''}>Select Subject</MenuItem>
                            {
                                subjectBy && subjectBy?.map((item, index) => (
                                    <MenuItem value={item.id} key={index}>{item.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>

                    <FormControl sx={{ width: '100%', mt: 2 }}>
                        <InputLabel id="demo-simple-select-label">Teacher</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Teacher"
                            // value={}
                            defaultValue={''}
                            {...formik.getFieldProps("teacherId")}
                            onChange={(event) => {
                                formik.handleChange(event)
                            }}
                            error={
                                formik.touched.teacherId &&
                                Boolean(formik.errors.teacherId)
                            }
                        >
                            <MenuItem value={''}>Select Teacher</MenuItem>
                            {
                                getAllStaffDetailsBySubjectId?.data && getAllStaffDetailsBySubjectId?.data?.map((item, index) => (
                                    <MenuItem value={item.id} key={index}>{item.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
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
                            type="submit"
                        >Request</Button>
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
                        >Cancel</Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    )
}
export default DoubtPopover;
