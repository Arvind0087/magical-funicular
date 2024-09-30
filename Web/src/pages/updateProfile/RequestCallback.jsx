import React from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import PhoneInput from 'react-phone-input-2';
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as yup from 'yup';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { toastoptions } from "../../utils/toastoptions";
import { createRequestCallAsync } from "../../redux/async.api";
import { emptyRequestCallback } from "../../redux/slices/requestCallback.slice";
import DialogTitle from '@mui/material/DialogTitle';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: "primary.main",
    boxShadow: 24,
    p: 4,
    textAlign: "center",
    alignItem: "center",
    borderRadius: "8px"
};
function RequestCallback(props) {
    const dispatch = useDispatch();
    const { open, phone, setOpen, id } = props;
    const userPhone = "+91" + phone;

    const _initialValues = {
        message: "",
    }

    const classValidate = yup.object().shape({
        message: yup
            .string()
            .required("Message is required"),
    });

    const onSubmit = (value) => {
        dispatch(createRequestCallAsync({
            userId: id,
            message: value.message,
        })).then(res => {
            const { payload } = res || {};
            const { status, message } = payload || {};
            if (status === 200) {
                toast.success(message, toastoptions);
                formik.resetForm();
                dispatch(emptyRequestCallback())
            }
            else if (status === 500) {
                formik.resetForm();
                dispatch(emptyRequestCallback())
            }
        });
        setOpen(false)
    }

    const formik = useFormik({
        initialValues: _initialValues,
        onSubmit,
        validationSchema: classValidate,
    }); // FOMRIK

    function handleClose() {
        dispatch(emptyRequestCallback())
        setOpen(false)
    }

    return (
        <>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="center"
                        color="primary.main"
                    >
                        <Box sx={{ width: "80%" }}>
                            <DialogTitle id="dialog-title">
                                Make A Request
                            </DialogTitle>
                        </Box>
                        <Box>
                            <HighlightOffIcon
                                sx={{ color: "primary.main" }}
                                onClick={handleClose}
                            />
                        </Box>
                    </Box>
                    <PhoneInput
                        specialLabel={""}
                        country={"in"}
                        value={userPhone}
                        disabled={true}
                        maxLength={13}
                        inputStyle={{
                            height: "56px",
                            width: "100%",
                            color: "rgb(145,158,171)"
                        }}
                    />
                    <form onSubmit={formik.handleSubmit}>
                        <Box sx={{ mt: 2, width: "100% !important" }}>
                            <TextField id="outlined-basic" label="Request A Callback" variant="outlined"
                                multiline rows={1}
                                sx={{ width: '100%' }}
                                inputProps={{ style: { width: "100%", height: "100px" } }}
                                {...formik.getFieldProps("message")}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                }}
                                error={
                                    formik.touched.message &&
                                    Boolean(formik.errors.message)
                                }
                            />
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    height: "100%",
                                    borderRadius: "12px",
                                    height: "40px",
                                    mt: 2,
                                    width: "40%",
                                    color: "white",
                                    bgcolor: "primary.main",
                                    paddingTop: "8px",
                                }}
                            >Send</Button>
                            <Button
                                variant="contained"
                                sx={{
                                    height: "100%",
                                    borderRadius: "12px",
                                    height: "40px",
                                    mt: 2,
                                    width: "40%",
                                    color: "white",
                                    bgcolor: "primary.main",
                                    paddingTop: "8px",
                                }}
                                onClick={handleClose}
                            >Cancel</Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </>
    );
}

export default RequestCallback;