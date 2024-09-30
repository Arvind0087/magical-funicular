import React, { useState, useEffect } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from "formik";
import * as yup from 'yup';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { toast } from 'react-hot-toast';
import {  applyScholarshipAsync } from '../../../redux/async.api';
import { toastoptions } from "../../../utils/toastoptions";
import { getAllStateAsync, getAllCityByStateIdAsync } from "../../../redux/cityAndState/cityAndState.async";
const RegisterScholarship = (props) => {
    const { onClose, selectedValue, open,handleappliedForScholarship,scholarshipId} = props;
    const dispatch = useDispatch();
    const { studentById } = useSelector((state) => state?.student);
    const { id, name, city, state, className } = studentById;
    const { getAllStateBy = [], AllCityByStateId = [] } = useSelector((state) => state?.StateAndCity);
    const [personsState, setPersonsState] = useState(state)
    useEffect(() => {
        if (personsState) {
            dispatch(
                getAllCityByStateIdAsync({
                    id: personsState
                })
            )
        }
    }, [personsState]);

    useEffect(() => {
        dispatch(
            getAllStateAsync()
        );
    }, [])

    const _initialValues = {
        name: name,
        className: className,
        state: state,
        city: city
    }
    const validate = yup.object().shape({
        name: yup
            .string()
            .required("Message is required"),
        className: yup
            .string()
            .required("Message is required"),
        city: yup
            .number()
            .required("Message is required"),
        state: yup
            .number()
            .required("Message is required"),
    });


    const handleClose = () => {
        onClose(selectedValue);
    };
  

    const onSubmit = (value) => {
        if (id) {
            dispatch(
                applyScholarshipAsync({
                    userId: id,
                    stateId: value.state,
                    cityId: value.city,
                    scholarshipId:scholarshipId
                })
            ).then(res => {
                if (res?.payload?.status === 200) {
                  toast.success(res?.payload?.message, toastoptions);
                  handleappliedForScholarship(true)
                  onClose(selectedValue)
                //   formik.resetForm();
                }
            })   
        }
    }

    const formik = useFormik({
        initialValues: _initialValues,
        onSubmit,
        validationSchema: validate,
    }); // FOMRIK

    return (
        <>
            <Dialog open={open} fullWidth maxWidth="xs" minHeight='80vh'>
                <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Box>
                        <DialogTitle id="dialog-title">
                            Register for Scholarship
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
                <DialogContent sx={{ display: 'block', justifyContent: 'center', paddingInline: '20px', height: '385px', overflowY: 'hidden !important' }}>
                    <form onSubmit={formik.handleSubmit}>
                        <TextField label="Name" id="outlined-size-normal"
                            sx={{ mb: 2, mt: 2, width: "100%" }}
                            disabled={true}
                            {...formik.getFieldProps("name")}
                        onChange={(event) => {
                            formik.handleChange(event);
                        }}
                        error={
                            formik.touched.name &&
                            Boolean(formik.errors.name)
                        }
                        />
                        <TextField label="Class" id="outlined-size-normal"
                            sx={{ mb: 2, width: "100%" }}
                            disabled={true}
                            {...formik.getFieldProps("className")}
                        onChange={(event) => {
                            formik.handleChange(event);
                        }}
                        error={
                            formik.touched.className &&
                            Boolean(formik.errors.className)
                        }
                        />
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="demo-simple-select-label">State</InputLabel>
                            <Select
                                fullWidth
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="subject"
                                defaultValue={''}
                                {...formik.getFieldProps("state")}
                                onChange={(event) => {
                                    formik.handleChange(event);
                                    setPersonsState(event.target.value)
                                }}
                                error={
                                    formik.touched.state &&
                                    Boolean(formik.errors.state)
                                }
                                sx={{ width: '100%' }}
                            >
                                <MenuItem value={''}>Select State</MenuItem>
                                {
                                    getAllStateBy && getAllStateBy?.map((item, index) => (
                                        <MenuItem value={item.id} key={index}>{item.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>

                        <FormControl sx={{ width: '100%', mt: 2 }}>
                            <InputLabel id="demo-simple-select-label">City</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Teacher"
                                defaultValue={''}
                                {...formik.getFieldProps("city")}
                                onChange={(event) => {
                                    formik.handleChange(event)
                                }}
                                error={
                                    formik.touched.city &&
                                    Boolean(formik.errors.city)
                                }
                            >
                                <MenuItem value={''}>Select City</MenuItem>
                                {
                                    AllCityByStateId && AllCityByStateId?.map((item, index) => (
                                        <MenuItem value={item.id} key={index}>{item.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <Box sx={{ display: 'flex', justifyContent: 'space-around',mt:-2 }}>
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
                            >Submit</Button>
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
        </>
    )
}
export default RegisterScholarship;
