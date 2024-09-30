import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import {
  Card,
  FormControl,
  Grid,
  MenuItem,
  TextField,
  InputAdornment,
  Box,
  Container,
  Stack
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import CustomComponentLoader from "components/CustomComponentLoader";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import { _initialValues, _packagetype, _validation } from "./utils";
import { useFormik } from "formik";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import Iconify from "components/iconify/Iconify";
import {
  addPackageAsync,
  getpackageByIdAsync,
  updatePackageByIdAsync
} from "redux/async.api";
import { emptypackage } from "redux/slices/packagemaster.slice";
import { isJson } from "utils/isJson";
import { getcourseAsync } from "redux/course/course.async";
import { PATH_DASHBOARD } from "routes/paths";
import SelectMenuItem from "components/SelectMenuItem/index";
import _ from "lodash";

function AddPackage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();

  const { courseLoader, course } = useSelector((state) => state.course);
  const { boardLoader } = useSelector((state) => state.board);
  const { masterLoader, packageadd, packageupdateId, packageId } = useSelector(
    (state) => state.master
  );
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  useEffect(() => {
    dispatch(getcourseAsync({}));
  }, []);

  const onSubmit = (values) => {
    const listinfo = [];
    for (let value of values.list) {
      if (value.list !== "") {
        listinfo.push(value.list);
      }
    }
    const payload = {
      id: id,
      courseId: values.courseId,
      name: values.name,
      tag: values.tag,
      startingPrice: values.startingPrice,
      packageType: values.packageType,
      list: JSON.stringify(listinfo)
    };

    if (id) {
      dispatch(updatePackageByIdAsync(payload));
    } else {
      delete payload.id;
      dispatch(addPackageAsync(payload));
    }
  };

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: _validation
  }); // FOMRIK

  useEffect(() => {
    if (id) {
      dispatch(getpackageByIdAsync(id));
    }
  }, [id]);

  useEffect(() => {
    if (id && packageId) {
      formik.setFieldValue("courseId", packageId.courseId);
      formik.setFieldValue("name", packageId.name);
      formik.setFieldValue("tag", packageId.tag);
      formik.setFieldValue("startingPrice", packageId.startingPrice);
      formik.setFieldValue("packageType", packageId.packageType);

      if (packageId.list) {
        if (isJson(packageId.list)) {
          formik.setFieldValue(
            "list",
            JSON.parse(packageId.list).map((res) => {
              return { list: res };
            })
          );
        }
      }
    }
  }, [id, packageId]);

  useEffect(() => {
    if (packageadd.status === 200) {
      toast.success(packageadd.message, toastoptions);
      formik.resetForm();
      dispatch(emptypackage());
      navigate(PATH_DASHBOARD.package);
    }
    if (packageupdateId.status === 200) {
      toast.success(packageupdateId.message, toastoptions);
      formik.resetForm();
      dispatch(emptypackage());
      navigate(PATH_DASHBOARD.package);
    }
  }, [packageadd, packageupdateId]);

  return (
    <>
      <Helmet>
        <title>Packages Master | {`${tabTitle}`}</title>
      </Helmet>
      <Container maxWidth={themeStretch ? "lg" : false}>
        <CustomBreadcrumbs
          // heading={Boolean(id) ? "Update Package Master " : "Create Package Master"}
          links={[
            { name: "Subscription", href: "" },
            {
              name: "Package Master",
              href: PATH_DASHBOARD.package
            },
            {
              name: Boolean(id)
                ? "Update Package Master"
                : "Create Package Master"
            }
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
                    sm: "repeat(2, 1fr)"
                  }}
                >
                  <SelectMenuItem
                    fullWidth
                    error={
                      formik.touched.packageType && formik.errors.packageType
                    }
                    InputLabelLabel="Package Type"
                    InputLabelSize={20}
                    label="Package Type"
                    name="packageType"
                    {...formik.getFieldProps("packageType")}
                    onChange={formik.handleChange}
                    defaultItemLabel="Select Package Type"
                    data={_.map(_packagetype, (ev, index) => {
                      return (
                        <MenuItem value={ev.value} key={index}>
                          {ev.label}
                        </MenuItem>
                      );
                    })}
                  />
                  <SelectMenuItem
                    fullWidth
                    disabled={courseLoader}
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
                        <MenuItem value={ev.id} key={ev.index}>
                          {ev.name}
                        </MenuItem>
                      );
                    })}
                  />
                  <TextField
                    name="name"
                    label="Package Name"
                    {...formik.getFieldProps("name")}
                    onChange={formik.handleChange}
                    fullWidth
                    error={formik.touched.name && formik.errors.name}
                  />
                  <TextField
                    name="tag"
                    label="Tag"
                    {...formik.getFieldProps("tag")}
                    onChange={formik.handleChange}
                    fullWidth
                    error={formik.touched.tag && formik.errors.tag}
                  />

                  <TextField
                    type="number"
                    name="startingPrice"
                    label="Starting Price"
                    {...formik.getFieldProps("startingPrice")}
                    onChange={formik.handleChange}
                    fullWidth
                    error={
                      formik.touched.startingPrice &&
                      formik.errors.startingPrice
                    }
                  />

                  {formik.values.list.map((listI, index) => (
                    <FormControl fullWidth key={index}>
                      <TextField
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {formik.values.list.length !== 0 && (
                                <div>
                                  {index !== 0 ||
                                  formik.values.list.length > 1 ? (
                                    <Iconify
                                      icon="eva:trash-2-outline"
                                      onClick={() => {
                                        if (formik.values.list.length > 1) {
                                          formik.values.list.splice(index, 1);
                                          formik.setFieldValue(
                                            "list",
                                            formik.values.list
                                          );
                                        }
                                      }}
                                      style={{
                                        cursor: "pointer",
                                        marginRight: "10px"
                                      }}
                                    />
                                  ) : null}
                                  {formik.values.list.length - 1 === index && (
                                    <Iconify
                                      icon="eva:plus-fill"
                                      onClick={() =>
                                        formik.setFieldValue("list", [
                                          ...formik.values.list,
                                          { list: "" }
                                        ])
                                      }
                                      style={{
                                        cursor: "pointer"
                                      }}
                                    />
                                  )}
                                </div>
                              )}
                            </InputAdornment>
                          )
                        }}
                        fullWidth
                        label={
                          courseLoader ? (
                            <CustomComponentLoader padding="0 0" size={20} />
                          ) : (
                            "List*"
                          )
                        }
                        sx={{ background: "#F9F9F9" }}
                        name="list"
                        type="text"
                        id="list"
                        value={listI.list}
                        onChange={(e) => {
                          formik.values.list[index][e.target.name] =
                            e.target.value;
                          formik.setFieldValue("list", formik.values.list);
                        }}
                        error={formik.touched.list && formik.errors.list}
                      />
                    </FormControl>
                  ))}
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={masterLoader}
                  >
                    {id ? "Update Package Master " : "Create Package Master"}
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
}

export default AddPackage;
