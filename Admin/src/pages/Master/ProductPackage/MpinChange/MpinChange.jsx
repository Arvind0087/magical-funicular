import React, { useEffect, useState } from "react";
import {
  MenuItem,
  TextField,
  Stack,
  Container,
  Card,
  FormControl,
  Grid,
  Typography,
  InputLabel,
  Select,
} from "@mui/material";
import { Box } from "@mui/system";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { _validation, _initial, _validationNan } from "./utils";
import { getstudentbyidAsync, updateUserMPinByIdAsync } from "redux/async.api";
import { emptyStudent } from "redux/slices/student.slice";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { getStudentAsync } from "redux/async.api";

export default function MpinChange({ studentInfo, setMpin }) {
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { studentLoader, studentById, updateUserMPin } = useSelector(
    (state) => state.student
  );

  // PAGINATION
  const handlePageChange = (page) => {
    setPaginationpage(page);
  };
  const handlePerRowsChange = async (newPerPage, page) => {
    setperPageNumber(newPerPage);
  };

  const onSubmit = async (values) => {
    let payload = {
      id: studentInfo.id,
      mPin: String(values.mpin),
    };
    dispatch(updateUserMPinByIdAsync(payload));
  };

  useEffect(() => {
    if (studentInfo?.id) {
      const payload = {
        userId: studentInfo?.id,
        batchTypeId: "",
      };
      dispatch(getstudentbyidAsync(payload));
    }
  }, [studentInfo]);

  useEffect(() => {
    if (updateUserMPin.status === 200) {
      toast.success(updateUserMPin.message, toastoptions);
      formik.resetForm();
      dispatch(emptyStudent());
      setMpin(false);
      dispatch(
        getStudentAsync({
          page: paginationpage,
          limit: perPageNumber,
        })
      );
    }
  }, [updateUserMPin]);

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validation,
  });

  return (
    <Container>
      <form onSubmit={formik.handleSubmit}>
        <Card sx={{ pt: 5, pb: 3, px: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <>
                <FormControl fullWidth>
                  <TextField
                    type="number"
                    name="mpin"
                    label="New M-Pin"
                    {...formik.getFieldProps("mpin")}
                    onChange={(e) => {
                      if (String(e.target.value).length <= 4) {
                        formik.handleChange(e);
                      }
                    }}
                    error={formik.touched.mpin && formik.errors.mpin}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <TextField
                    type="number"
                    name="confirmMpin"
                    label="Confirm M-Pin"
                    loading={studentLoader}
                    {...formik.getFieldProps("confirmMpin")}
                    onChange={(e) => {
                      if (String(e.target.value).length <= 4) {
                        formik.handleChange(e);
                      }
                    }}
                    error={
                      formik.touched.confirmMpin && formik.errors.confirmMpin
                    }
                  />
                </FormControl>
                {formik.touched.mpin && formik.errors.mpin ? (
                  <Typography
                    variant="boy1"
                    sx={{
                      color: "red",
                      fontSize: "12px",
                    }}
                  >
                    {formik.errors.mpin}
                  </Typography>
                ) : formik.touched.confirmMpin && formik.errors.confirmMpin ? (
                  <Typography
                    variant="boy1"
                    sx={{
                      color: "red",
                      fontSize: "12px",
                    }}
                  >
                    {formik.errors.confirmMpin}
                  </Typography>
                ) : null}
              </>
            </Grid>
          </Grid>
          <Stack alignItems="flex-end" sx={{ my: 3 }}>
            <Box sx={{ display: "flex" }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={studentLoader}
              >
                Change M-Pin
              </LoadingButton>
              <LoadingButton
                sx={{ ml: 1 }}
                variant="outlined"
                color="inherit"
                onClick={(e) => setMpin(false)}
              >
                Cancel
              </LoadingButton>
            </Box>
          </Stack>
        </Card>
      </form>
    </Container>
  );
}
