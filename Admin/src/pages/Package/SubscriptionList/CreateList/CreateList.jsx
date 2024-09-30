import { Helmet } from "react-helmet-async";
import { React, useState } from "react";
import { Card, Grid, MenuItem, TextField } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import { _initial, _validate, _batchValidate } from "./utils";
import { useFormik } from "formik";
import {
  addMultipleClassAsync,
  getBoardsByCourseIdAsync,
  getClassByBoardAndCourseIdAsync,
  getBatchByCourseBoardClassAsync,
  updateIndivisualPackageAsync,
  getClassDetailsByIdAsync,
  getSubscriptionByPackageIdAsync,
  getPackagesMonthAsync,
} from "redux/async.api";
import { getBatchDateByBatchTypeIdAsync } from "redux/batchdate/batchdate.async";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { emptypackageboard } from "redux/slices/packageboard.slice";
import moment from "moment/moment";
import { PATH_DASHBOARD } from "routes/paths";
import { getcourseAsync } from "redux/course/course.async";
import { useLocation } from "react-router";
import SelectMenuItem from "components/SelectMenuItem/index";
import _ from "lodash";

export default function CreateList() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const { courseLoader, course } = useSelector((state) => state.course);
  const { boardLoader, boardByCourse } = useSelector((state) => state.board);
  const { classLoader, classbycourseboard } = useSelector(
    (state) => state.class
  );
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const { masterLoader, master, getPackagesMonth } = useSelector(
    (state) => state.master
  );

  const {
    packageboardLoader,
    packageboardadd,
    classDetailsById,
    getsubscriptionbypackageId,
    updateIndivisualPackageId,
  } = useSelector((state) => state.packageboard);
  const { batchdateLoader, getBatchDateByBatchTypeId } = useSelector(
    (state) => state.batchdate
  );
  const { batchLoader, batchByCourseBoardClass } = useSelector(
    (state) => state.batch
  );
  const [getPackageType, setPackageType] = useState("");

  let monthInfo = getsubscriptionbypackageId?.data?.find((item) => {
    return item?.month;
  });

  useEffect(() => {
    dispatch(getPackagesMonthAsync({}));
    dispatch(getcourseAsync({}));
  }, []);

  const onSubmit = async (values) => {
    let payload = {
      id: Number(id),
      courseId: values.courseId,
      packageId: values.packageId,
      subscriptionId: values.subscriptionsId,
      boardId: values.boardId,
      classId: values.classId,
      monthlyPrice: values.monthlyPrice,
      monthlyDiscountedPrice: values.monthlyDiscountedPrice,
      realPrice: values.realPrice,
    };
    if (getPackageType?.packageType?.includes("Batch")) {
      payload = {
        ...payload,
        batchTypeId: values.batchTypeId,
        batchStartDateId: values.batchStartDateId,
      };
    }

    if (id) {
      dispatch(updateIndivisualPackageAsync(payload));
    } else {
      delete payload.id;
      dispatch(addMultipleClassAsync(payload));
    }
  };

  useEffect(() => {
    if (packageboardadd.status === 200) {
      toast.success(packageboardadd.message, toastoptions);
      dispatch(emptypackageboard()); // NEED TO CLEAR MESSAGE FROM STATE
      navigate(-1);
    }
    if (updateIndivisualPackageId.status === 200) {
      toast.success(updateIndivisualPackageId.message, toastoptions);
      formik.resetForm();
      dispatch(emptypackageboard()); // NEED TO CLEAR MESSAGE FROM STATE
      navigate(-1);
    }
  }, [packageboardadd, updateIndivisualPackageId]);

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: getPackageType?.packageType?.includes("Batch")
      ? _batchValidate
      : _validate,
  }); // FOMRIK

  useEffect(() => {
    let packageTypeInfo = getPackagesMonth?.data?.find((item) => {
      return item?.id == formik.values.packageId;
    });
    setPackageType(packageTypeInfo);
  }, [formik.values.packageId]);

  useEffect(() => {
    if (id) dispatch(getClassDetailsByIdAsync(id));
  }, [id]);

  useEffect(() => {
    if (id && classDetailsById) {
      // formik.setFieldValue("courseId", classDetailsById?.courseId);
      formik.setFieldValue("packageId", classDetailsById.packageId);
      formik.setFieldValue("subscriptionsId", classDetailsById.subscriptionId);
      formik.setFieldValue("boardId", classDetailsById.boardId);
      formik.setFieldValue("classId", classDetailsById.classId);
      formik.setFieldValue("monthlyPrice", classDetailsById.monthlyPrice);
      formik.setFieldValue(
        "monthlyDiscountedPrice",
        classDetailsById.monthlyDiscountedPrice
      );
      formik.setFieldValue("batchTypeId", classDetailsById?.batchTypeId);
      formik.setFieldValue(
        "batchStartDateId",
        classDetailsById?.batchStartDateId
      );
    }
  }, [id, classDetailsById]);

  useEffect(() => {
    if (formik.values.courseId) {
      dispatch(
        getBoardsByCourseIdAsync({
          courseId: formik.values.courseId,
        })
      );
    }
  }, [formik.values.courseId]);

  useEffect(() => {
    if (formik.values.boardId) {
      dispatch(
        getClassByBoardAndCourseIdAsync({
          courseId: formik.values.courseId,
          boardId: formik.values.boardId,
        })
      );
    }
  }, [formik.values.boardId]);

  useEffect(() => {
    if (formik.values.classId) {
      dispatch(
        getBatchByCourseBoardClassAsync({
          courseId: formik.values.courseId,
          boardId: formik.values.boardId,
          classId: formik.values.classId,
          batchTypeId: formik.values.batchTypeId,
        })
      );
    }
  }, [formik.values.classId]);

  useEffect(() => {
    if (formik.values.batchTypeId) {
      dispatch(
        getBatchDateByBatchTypeIdAsync({
          courseId: formik.values.courseId,
          boardId: formik.values.boardId,
          classId: formik.values.classId,
          batchTypeId: formik.values.batchTypeId,
        })
      );
    }
  }, [formik.values.batchTypeId]);

  useEffect(() => {
    if (formik.values.packageId) {
      const findCourseId = getPackagesMonth?.data?.find(
        (ev) => ev.id === formik.values.packageId
      );
      formik.setFieldValue("courseId", findCourseId.courseId || "");
      dispatch(
        getSubscriptionByPackageIdAsync({
          packageId: formik.values.packageId,
        })
      );
    }
  }, [formik.values.packageId]);

  useEffect(() => {
    if (
      (formik.values.monthlyDiscountedPrice &&
        formik.values.monthlyDiscountedPrice.length >= 0) ||
      id ||
      classDetailsById
    ) {
      let realPrice;
      if (id && classDetailsById && formik.values.monthlyDiscountedPrice) {
        realPrice =
          formik.values.monthlyDiscountedPrice * classDetailsById?.month;
        formik.setFieldValue(
          "realPrice",
          realPrice || classDetailsById?.realPrice
        );
      } else {
        realPrice = formik.values.monthlyDiscountedPrice * monthInfo?.month;
        formik.setFieldValue("realPrice", realPrice);
      }
    }
  }, [formik.values.monthlyDiscountedPrice, classDetailsById]);

  return (
    <>
      <Container maxWidth={themeStretch ? "lg" : false}>
        <Helmet>
          <title>Subscription Plan | {`${tabTitle}`}</title>
        </Helmet>
        <CustomBreadcrumbs
          // heading={id ? "Update Subscription Plan" : "Create Subscription Plan"}
          links={[
            { name: "Subscription", href: "" },
            {
              name: "Subscription Plan",
              href: `${PATH_DASHBOARD.SubscriptionList}`,
            },
            {
              name: id
                ? "Update Subscription Plan"
                : "Create Subscription Plan",
            },
          ]}
        />
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                  }}
                >
                  <SelectMenuItem
                    fullWidth
                    disabled={masterLoader}
                    error={formik.touched.packageId && formik.errors.packageId}
                    InputLabelLoader={masterLoader}
                    InputLabelLabel="Package"
                    InputLabelSize={20}
                    label="Package"
                    name="packageId"
                    {...formik.getFieldProps("packageId")}
                    onChange={formik.handleChange}
                    defaultItemLabel="Select Package"
                    data={_.map(getPackagesMonth?.data, (ev, index) => {
                      return (
                        <MenuItem value={ev.id} key={ev.index}>
                          {ev.name}
                        </MenuItem>
                      );
                    })}
                  />
                  <SelectMenuItem
                    fullWidth
                    disabled={packageboardLoader}
                    error={
                      formik.touched.subscriptionsId &&
                      formik.errors.subscriptionsId
                    }
                    InputLabelLoader={packageboardLoader}
                    InputLabelLabel="Subscription"
                    InputLabelSize={20}
                    label="Subscription"
                    name="subscriptionsId"
                    {...formik.getFieldProps("subscriptionsId")}
                    onChange={formik.handleChange}
                    defaultItemLabel="Select Subscription"
                    data={_.map(
                      getsubscriptionbypackageId?.data,
                      (ev, index) => {
                        return (
                          <MenuItem value={ev.id} key={ev.index}>
                            {ev.title}
                          </MenuItem>
                        );
                      }
                    )}
                  />
                  <SelectMenuItem
                    fullWidth
                    disabled={true}
                    error={formik.touched.courseId && formik.errors.courseId}
                    InputLabelLoader={courseLoader}
                    InputLabelLabel="Course"
                    InputLabelSize={20}
                    label="Course"
                    name="courseId"
                    {...formik.getFieldProps("courseId")}
                    onChange={formik.handleChange}
                    defaultItemLabel="Select Course"
                    data={_.map(course?.data, (ev, index) => {
                      return (
                        <MenuItem key={ev.index} value={ev.id}>
                          {ev.name}
                        </MenuItem>
                      );
                    })}
                  />
                  <SelectMenuItem
                    fullWidth
                    disabled={boardLoader}
                    error={formik.touched.boardId && formik.errors.boardId}
                    InputLabelLoader={boardLoader}
                    InputLabelLabel="Board"
                    InputLabelSize={20}
                    label="Board"
                    name="boardId"
                    {...formik.getFieldProps("boardId")}
                    onChange={formik.handleChange}
                    defaultItemLabel="Select Board"
                    data={_.map(boardByCourse, (ev, index) => {
                      return (
                        <MenuItem key={ev.index} value={ev.id}>
                          {ev.name}
                        </MenuItem>
                      );
                    })}
                  />
                  <SelectMenuItem
                    fullWidth
                    disabled={classLoader}
                    error={formik.touched.classId && formik.errors.classId}
                    InputLabelLoader={classLoader}
                    InputLabelLabel="Class"
                    InputLabelSize={20}
                    label="Class"
                    name="classId"
                    {...formik.getFieldProps("classId")}
                    onChange={formik.handleChange}
                    defaultItemLabel="Select Class"
                    data={_.map(classbycourseboard, (ev, index) => {
                      return (
                        <MenuItem key={ev.index} value={ev.id}>
                          {ev.name}
                        </MenuItem>
                      );
                    })}
                  />

                  {getPackageType?.packageType?.includes("Batch") && (
                    <>
                      <SelectMenuItem
                        fullWidth
                        disabled={batchLoader}
                        error={
                          formik.touched.batchTypeId &&
                          formik.errors.batchTypeId
                        }
                        InputLabelLoader={batchLoader}
                        InputLabelLabel="Batch Type"
                        InputLabelSize={20}
                        label="Batch Type"
                        name="batchTypeId"
                        {...formik.getFieldProps("batchTypeId")}
                        onChange={formik.handleChange}
                        defaultItemLabel="Select Batch Type"
                        data={_.map(batchByCourseBoardClass, (ev, index) => {
                          return (
                            <MenuItem value={ev.id} key={ev.index}>
                              {ev.name}
                            </MenuItem>
                          );
                        })}
                      />
                      <SelectMenuItem
                        fullWidth
                        disabled={batchdateLoader}
                        error={
                          formik.touched.batchStartDateId &&
                          formik.errors.batchStartDateId
                        }
                        InputLabelLoader={batchLoader}
                        InputLabelLabel="Batch Start Date"
                        InputLabelSize={20}
                        label="Batch Start Date"
                        name="batchStartDateId"
                        {...formik.getFieldProps("batchStartDateId")}
                        onChange={formik.handleChange}
                        defaultItemLabel="Select Batch Start Date"
                        data={_.map(
                          getBatchDateByBatchTypeId?.data,
                          (ev, index) => {
                            return (
                              <MenuItem value={ev.id} key={ev.index}>
                                {moment(ev.date).format("DD MMMM YYYY")}
                              </MenuItem>
                            );
                          }
                        )}
                      />
                    </>
                  )}
                  <TextField
                    type="number"
                    name="monthlyPrice"
                    label="Monthly price"
                    fullWidth
                    {...formik.getFieldProps("monthlyPrice")}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.monthlyPrice && formik.errors.monthlyPrice
                    }
                  />
                  <TextField
                    type="number"
                    name="monthlyDiscountedPrice"
                    label="Monthly Discounted Price"
                    fullWidth
                    {...formik.getFieldProps("monthlyDiscountedPrice")}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.monthlyDiscountedPrice &&
                      formik.errors.monthlyDiscountedPrice
                    }
                  />
                  <TextField
                    disabled
                    type="number"
                    name="realPrice"
                    label="Real Price"
                    fullWidth
                    {...formik.getFieldProps("realPrice")}
                    onChange={formik.handleChange}
                    error={formik.touched.realPrice && formik.errors.realPrice}
                  />
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  {formik.values.monthlyDiscountedPrice < 0 ? (
                    <LoadingButton
                      onClick={() =>
                        toast.error(
                          "Monthly Discount Price Can't Be Less Then 0 Rs.",
                          toastoptions
                        )
                      }
                      variant="contained"
                      loading={packageboardLoader}
                    >
                      {id
                        ? "Update Subscription Plan"
                        : "Create Subscription Plan"}
                    </LoadingButton>
                  ) : formik.values.monthlyDiscountedPrice >=
                    formik.values.monthlyPrice ? (
                    <LoadingButton
                      onClick={() =>
                        toast.error(
                          "Monthly Discount Price Can't Be Greater Then Or Equal To Monthly Price",
                          toastoptions
                        )
                      }
                      variant="contained"
                      loading={packageboardLoader}
                    >
                      {id
                        ? "Update Subscription Plan"
                        : "Create Subscription Plan"}
                    </LoadingButton>
                  ) : (
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={packageboardLoader}
                    >
                      {id
                        ? "Update Subscription Plan"
                        : "Create Subscription Plan"}
                    </LoadingButton>
                  )}
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
}
