import { Helmet } from "react-helmet-async";
import React, { useEffect, useState } from "react";
import {
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
  Container,
  Stack,
  Checkbox,
  Typography,
} from "@mui/material";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import { _initial, _validate } from "./utils";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { useNavigate, useParams } from "react-router";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import { GenerateBase64 } from "utils/convertToBase64";
import { getcourseAsync } from "redux/course/course.async";
import {
  addVoucherAsync,
  getVoucherByIdAsync,
  updateVoucherByIdAsync,
} from "redux/voucher/voucher.async";
import { allCoursePackagesAsync } from "redux/productPackage/productPackage.async";
import { getBoardsByCourseIdAsync } from "redux/board/board.async";
import { getClassByBoardAndCourseIdAsync } from "redux/class/class.async";
import { getBatchByCourseBoardClassAsync } from "redux/batchtype/batchtype.async";
import { emptyVoucher } from "redux/voucher/voucher.slice";
import { PATH_DASHBOARD } from "routes/paths";

export default function CreateSubject() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { boardLoader, boardByCourse } = useSelector((state) => state.board);
  const { courseLoader, course } = useSelector((state) => state.course);
  const { subjectLoader, subjectadd, subjectById, subjectupdate } = useSelector(
    (state) => state.subject
  );
  const { classLoader, classbycourseboard } = useSelector(
    (state) => state.class
  );
  const { batchLoader, batchByCourseBoardClass } = useSelector(
    (state) => state.batch
  );
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const { getPackageLoader, getAllPackage } = useSelector(
    (state) => state.package
  );

  const {
    voucherLoader,
    addVoucher,
    getVoucherByIdLoader,
    getVoucherById,
    allVoucherLoader,
    getAllVoucher,
    updateLoader,
    updateVoucher,
  } = useSelector((state) => state.voucher);

  const getCourseAsync = () => {
    dispatch(
      getcourseAsync({
        page: "",
        limit: "",
      })
    );
  };

  const onSubmit = async (values) => {
    const payload = {
      Id: Number(id),
      courseId: values.courseId,
      packageId: values?.package,
      // boardId: values.boardId,
      // classId: values.classId,
      // batchTypeId: values.batchTypeId,
      voucher_key: values.name,
      voucher_type: values?.voucherType,
      voucher_description: values.description,
      voucher_discount: values.discount,
      startDate: values?.startDate,
      endDate: values?.endDate,
      show_voucher: values?.showVoucher == "yes" ? 1 : 0,
    };
    if (id) {
      if (formik?.values?.voucherType == "Course") {
        delete payload?.packageId;
      }
      dispatch(updateVoucherByIdAsync(payload));
    } else {
      delete payload.Id;
      if (formik?.values?.voucherType == "Course") {
        delete payload?.packageId;
      }
      dispatch(addVoucherAsync(payload));
    }
  };

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate,
  });

  useEffect(() => {
    getCourseAsync();
    dispatch(
      allCoursePackagesAsync({
        page: "",
        limit: "",
      })
    );
  }, []);

  useEffect(() => {
    if (id) dispatch(getVoucherByIdAsync(id));
  }, [id]);

  useEffect(() => {
    if (id && getVoucherById) {
      formik.setFieldValue("voucherType", getVoucherById?.data?.voucher_type);
      formik.setFieldValue("courseId", getVoucherById?.data?.courseId);
      formik.setFieldValue("boardId", getVoucherById?.data?.boardId);
      formik.setFieldValue("classId", getVoucherById?.data?.classId);
      formik.setFieldValue("batchTypeId", getVoucherById?.data?.batchTypeId);
      formik.setFieldValue(
        "showVoucher",
        getVoucherById?.data?.show_voucher == 1 ? "yes" : "no"
      );

      getVoucherById?.data?.packageId &&
        formik.setFieldValue("package", getVoucherById?.data?.packageId);

      formik.setFieldValue("name", getVoucherById?.data?.voucher_code);
      formik.setFieldValue(
        "description",
        getVoucherById?.data?.voucher_description
      );
      formik.setFieldValue("discount", getVoucherById?.data?.voucher_discount);
      formik.setFieldValue(
        "startDate",
        getVoucherById?.data?.startDate?.split("T")[0]
      );
      formik.setFieldValue(
        "endDate",
        getVoucherById?.data?.endDate?.split("T")[0]
      );
    }
  }, [getVoucherById, id]);

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
        })
      );
    }
  }, [formik.values.classId]);

  useEffect(() => {
    if (addVoucher?.status === 200) {
      toast.success(addVoucher.message, toastoptions);
      formik.setFieldValue("name", "");
      formik.setFieldValue("description", "");
      formik.setFieldValue("discount", "");
      dispatch(emptyVoucher());
      navigate(PATH_DASHBOARD.voucher);
    }

    if (updateVoucher.status === 200) {
      toast.success(updateVoucher.message, toastoptions);
      formik.resetForm();
      dispatch(emptyVoucher());
      navigate(PATH_DASHBOARD.voucher);
    }
  }, [addVoucher, updateVoucher]);

  const voucherData = [
    { id: 1, name: "Course" },
    { id: 2, name: "Package" },
  ];

  const showVoucher = [
    { value: "yes", name: "Yes" },
    { value: "no", name: "No" },
  ];

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Voucher | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        links={[
          { name: "Master", href: "" },
          {
            name: "Voucher",
            href: `${PATH_DASHBOARD.voucher}`,
          },
          {
            name: id ? "Update Voucher" : "Create Voucher",
          },
        ]}
      />
      <form onSubmit={formik.handleSubmit}>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                }}
              >
                <FormControl
                  fullWidth
                  disabled={courseLoader}
                  error={Boolean(
                    formik.touched.voucherType && formik.errors.voucherType
                  )}
                >
                  <InputLabel>Voucher Type</InputLabel>
                  <Select
                    label="Course"
                    name="voucherType"
                    {...formik.getFieldProps("voucherType")}
                    onChange={formik.handleChange}
                  >
                    <MenuItem defaultValue value="">
                      Select Type
                    </MenuItem>
                    {voucherData?.map((ev, index) => {
                      return (
                        <MenuItem value={ev.name} key={ev.index}>
                          {ev.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl
                  fullWidth
                  disabled={courseLoader}
                  error={Boolean(
                    formik.touched.courseId && formik.errors.courseId
                  )}
                >
                  <InputLabel>
                    {courseLoader ? (
                      <CustomComponentLoader padding="0 0" size={20} />
                    ) : (
                      "Courses"
                    )}
                  </InputLabel>
                  <Select
                    label="Course"
                    name="courseId"
                    {...formik.getFieldProps("courseId")}
                    onChange={formik.handleChange}
                  >
                    <MenuItem defaultValue value="">
                      Select Course
                    </MenuItem>
                    {course?.data?.map((ev, index) => {
                      return (
                        <MenuItem value={ev.id} key={ev.index}>
                          {ev.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                {formik?.values?.voucherType == "Package" && (
                  <FormControl
                    fullWidth
                    disabled={getPackageLoader}
                    error={Boolean(
                      formik.touched.package && formik.errors.package
                    )}
                  >
                    <InputLabel>
                      {courseLoader ? (
                        <CustomComponentLoader padding="0 0" size={20} />
                      ) : (
                        "Package"
                      )}
                    </InputLabel>
                    <Select
                      label="Package"
                      name="package"
                      {...formik.getFieldProps("package")}
                      onChange={formik.handleChange}
                    >
                      <MenuItem defaultValue value="">
                        Select Package
                      </MenuItem>
                      {getAllPackage?.data?.map((ev, index) => {
                        return (
                          <MenuItem value={ev.id} key={ev.id}>
                            {ev.package_title}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}

                <FormControl fullWidth>
                  <TextField
                    name="description"
                    label="Description"
                    fullWidth
                    {...formik.getFieldProps("description")}
                    onChange={formik.handleChange}
                    error={Boolean(
                      formik.touched.description && formik.errors.description
                    )}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    name="name"
                    label="Coupon Code"
                    fullWidth
                    {...formik.getFieldProps("name")}
                    inputProps={{ maxLength: 20 }}
                    onChange={(e) => {
                      if (String(e.target.value).length <= 20) {
                        formik.handleChange(e);
                      }
                    }}
                    error={Boolean(formik.touched.name && formik.errors.name)}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    name="discount"
                    type="number"
                    fullWidth
                    inputProps={{ maxLength: 5 }}
                    // disabled={Boolean(id) && studentById?.phone}
                    label="Discount in (%)"
                    {...formik.getFieldProps("discount")}
                    onChange={(e) => {
                      if (String(e.target.value).length <= 5) {
                        formik.handleChange(e);
                      }
                    }}
                    error={Boolean(
                      formik.touched.discount && formik.errors.discount
                    )}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    type="date"
                    name="startDate"
                    label="Start Date"
                    inputProps={{
                      // min: new Date().toISOString().slice(0, 10),
                      max: "9999-12-31T23:59",
                    }}
                    style={{ color: id ? "white !important" : null }}
                    fullWidth
                    {...formik.getFieldProps("startDate")}
                    onChange={formik.handleChange}
                    error={Boolean(
                      formik.touched.startDate && formik.errors.startDate
                    )}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    type="date"
                    name="endDate"
                    label="End Date"
                    inputProps={{
                      min: formik?.values?.startDate
                        ? formik?.values?.startDate
                        : new Date().toISOString().slice(0, 10),
                      max: "9999-12-31T23:59",
                    }}
                    style={{ color: id ? "white !important" : null }}
                    fullWidth
                    {...formik.getFieldProps("endDate")}
                    onChange={formik.handleChange}
                    error={Boolean(
                      formik.touched.endDate && formik.errors.endDate
                    )}
                  />
                </FormControl>

                <FormControl
                  fullWidth
                  // disabled={courseLoader}
                  error={Boolean(
                    formik.touched.showVoucher && formik.errors.showVoucher
                  )}
                >
                  <InputLabel>Show Voucher</InputLabel>
                  <Select
                    label="Show Voucher"
                    name="showVoucher"
                    {...formik.getFieldProps("showVoucher")}
                    onChange={formik.handleChange}
                  >
                    <MenuItem defaultValue value="">
                      Show Voucher
                    </MenuItem>
                    {showVoucher?.map((ev, index) => {
                      return (
                        <MenuItem value={ev.value} key={ev.index}>
                          {ev.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12} md={12}>
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={subjectLoader}
                >
                  {id
                    ? "Update Voucher"
                    : voucherLoader
                    ? "Working..."
                    : "Create Voucher"}
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </form>
    </Container>
  );
}
