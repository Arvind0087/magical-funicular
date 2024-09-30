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
import { updateStudentByIdAsync, getstudentbyidAsync } from "redux/async.api";
import { emptyStudent } from "redux/slices/student.slice";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { getStudentAsync, bulkSubscriptionChangeAsync } from "redux/async.api";

export default function SubscriptionChange({
  setSubscription,
  studentInfo,
  searchStudent,
  searchClass,
  getSubscription,
  getCheckedValue,
  setCheckedValue,
  setCheckedAll,
}) {
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { studentLoader, studentById, studentupdate, bulkSubscription } =
    useSelector((state) => state.student);
  // Bulk Subscription Change
  const studentSubscriptionType = getCheckedValue.map(
    (ev) => JSON.parse(ev).type
  );
  const isSubscriptionType = studentSubscriptionType[0];
  const bulkStudentIds = getCheckedValue.map((ev) => JSON.parse(ev).id);

  // PAGINATION
  const handlePageChange = (page) => {
    setPaginationpage(page);
  };
  const handlePerRowsChange = async (newPerPage, page) => {
    setperPageNumber(newPerPage);
  };

  const onSubmit = async (values) => {
    if (studentInfo) {
      let payload = {
        users: [studentInfo.id],
        type: values.SubscriptionType,
        month: values.month,
      };
      if (studentInfo?.subscriptionType === "Premium") {
        delete payload.validityDay;
      }
      dispatch(bulkSubscriptionChangeAsync(payload));
    }
    if (getCheckedValue.length > 0) {
      let payload = {
        users: bulkStudentIds,
        month: values.month,
        type: values.SubscriptionType,
      };
      dispatch(bulkSubscriptionChangeAsync(payload));
      return;
    }
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
    // Single Change
    if (studentById?.id) {
      formik.setFieldValue(
        "SubscriptionType",
        studentById?.subscriptionType === "Free" ? "Premium" : "Free"
      );
    }
    // Bulk Change
    if (getCheckedValue.length > 0) {
      formik.setFieldValue(
        "SubscriptionType",
        isSubscriptionType === "Free" ? "Premium" : "Free"
      );
    }
  }, [studentById, getCheckedValue, isSubscriptionType]);

  useEffect(() => {
    if (studentupdate.status === 200) {
      toast.success(studentupdate.message, toastoptions);
      formik.resetForm();
      dispatch(emptyStudent());
      setSubscription(false);
      dispatch(
        getStudentAsync({
          page: paginationpage,
          limit: perPageNumber,
          classes: searchClass,
          search: searchStudent,
          type: getSubscription,
        })
      );
    }
    if (bulkSubscription.status === 200) {
      toast.success(bulkSubscription.message, toastoptions);
      formik.resetForm();
      dispatch(emptyStudent());
      setSubscription(false);
      setCheckedValue([]);
      setCheckedAll(false);
      dispatch(
        getStudentAsync({
          page: paginationpage,
          limit: perPageNumber,
          classes: searchClass,
          search: searchStudent,
          type: getSubscription,
        })
      );
    }
  }, [studentupdate, bulkSubscription]);

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
              {(studentInfo?.subscriptionType || isSubscriptionType) && (
                <>
                  <FormControl fullWidth>
                    <TextField
                      name="SubscriptionType"
                      label="Subscription Type"
                      {...formik.getFieldProps("SubscriptionType")}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.SubscriptionType &&
                        formik.errors.SubscriptionType
                      }
                      disabled={Boolean(formik?.values?.SubscriptionType)}
                    />
                  </FormControl>
                  {formik?.values?.SubscriptionType === "Premium" && (
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <TextField
                        type="number"
                        name="month"
                        label="Months"
                        loading={studentLoader}
                        {...formik.getFieldProps("month")}
                        onChange={(e) => {
                          const { value } = e.target;
                          if (value.length <= 2) {
                            formik.handleChange(e);
                          }
                        }}
                        error={formik.touched.month && formik.errors.month}
                      />
                    </FormControl>
                  )}
                </>
              )}
            </Grid>
          </Grid>
          <Stack alignItems="flex-end" sx={{ my: 3 }}>
            <Box sx={{ display: "flex" }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={studentLoader}
              >
                Accept
              </LoadingButton>
              <LoadingButton
                sx={{ ml: 1 }}
                variant="outlined"
                color="inherit"
                onClick={(e) => setSubscription(false)}
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
