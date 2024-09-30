import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Grid, MenuItem, Button, useTheme, FormControl, InputLabel, Select, Checkbox, ListItemText, Box } from "@mui/material";
import * as yup from 'yup';
import { useFormik } from "formik";
import { getSelectedSubjectsAsync } from "../../../../redux/async.api";
import SelectTestChapters from "../selectChapters";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const CreateTests = (props) => {
    const { QuentionsNo, Time, levels, setOpenChapter, openChapter } = props;
    const dispatch = useDispatch();
    const theme = useTheme();
    const { subjectBy } = useSelector(state => state?.subject)

    // states
    const [selectedSubjects, setSelectedSubjects] = useState([])
    const [value, setValue] = useState({})

    const _initialValues = {
        subjects: [],
        levelss: [],
        time: '',
        noOfQue: ''
    };
    const validation = yup.object().shape({
        subjects: yup.array().min(1, "required"),
        levelss: yup.array().min(1, "required"),
        time: yup.string()
            .required("required"),
        noOfQue: yup.string()
            .required("required"),
    });

    const onSubmit = (value) => {
        setValue(value)
        dispatch(
            getSelectedSubjectsAsync({
                "subjectId": value?.subjects?.map((item) => {
                    return item.id
                })
            })
        ).then((res) => {
            const { payload } = res || {};
            const { status,  getChapter } = payload || {};
            if (status === 200) {
                setSelectedSubjects(getChapter)
                setOpenChapter(true)
            }
        })
    }

    const formik = useFormik({
        initialValues: _initialValues,
        onSubmit,
        validationSchema: validation,
    }); // FOMRIK

    return (
        <>

            <form onSubmit={formik.handleSubmit}>
                <Box sx={{ mt: 1 }}><Typography variant="h5">Create Test</Typography></Box>
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Subject</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Chapter"
                                // value={subject}
                                sx={{ borderRadius: '30px' }}
                                {...formik.getFieldProps("subjects")}
                                onChange={(e) => {
                                    formik.handleChange(e);

                                }}
                                error={
                                    formik.touched.subjects &&
                                    Boolean(formik.errors.subjects)
                                }
                                multiple
                                renderValue={(selected) => selected.map(i => i.name).join(', ')}
                            >
                                {subjectBy && subjectBy.filter(item => item.isAllSubject === false).map((item, key) => (
                                    <MenuItem value={item} key={key}>
                                        <Checkbox {...label} checked={formik?.values?.subjects?.indexOf(item) > -1} />
                                        <ListItemText primary={item.name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Select Level</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Select Level"
                                // value={subject}
                                sx={{ borderRadius: '30px' }}
                                {...formik.getFieldProps("levelss")}
                                onChange={(e) => {
                                    formik.handleChange(e);

                                }}
                                error={
                                    formik.touched.levelss &&
                                    Boolean(formik.errors.levelss)
                                }
                                multiple
                                renderValue={(selected) => selected.map(i => i.level).join(', ')}
                            >

                                {levels && levels.map((item, key) => (
                                    <MenuItem value={item} key={key}>
                                        <Checkbox {...label} checked={formik?.values?.levelss?.indexOf(item) > -1} />
                                        <ListItemText primary={item.level} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Select Time</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Select Time"
                                sx={{ borderRadius: '30px' }}
                                error={
                                    formik.touched.time &&
                                    Boolean(formik.errors.time)
                                }
                                {...formik.getFieldProps("time")}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                }}
                            >
                                {Time.map((item) => (
                                    <MenuItem value={item.id}>{item.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Number of Questions</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Number of Questions"
                                sx={{ borderRadius: '30px' }}
                                error={
                                    formik.touched.noOfQue &&
                                    Boolean(formik.errors.noOfQue)
                                }
                                {...formik.getFieldProps("noOfQue")}
                                onChange={(e) => {
                                    formik.handleChange(e);

                                }}

                            >
                                {QuentionsNo.map((item) => (
                                    <MenuItem value={item.number}>{item.number}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button
                            sx={{
                                borderRadius: '60px',
                                color: '#ffff',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '55px',
                                width: '100%',
                                [theme.breakpoints.down('md')]: {
                                    width: '100%',
                                    marginTop: '50px'
                                },
                            }}
                            type="submit"
                            className='OTP-button'
                            variant="contained"
                        >
                            Next
                        </Button>
                    </Grid>
                </Grid>
            </form>
            {
                openChapter &&
                <SelectTestChapters selectedSubjects={selectedSubjects} value={value} />
            }
        </>
    )
}
export default CreateTests;
