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
  Typography,
  InputAdornment,
  IconButton,
  Checkbox,
  ListItemText,
} from "@mui/material";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { _initial, _validate } from "./utils";
import { useDispatch, useSelector } from "react-redux";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import moment from "moment";
import { getcourseAsync } from "redux/course/course.async";
import { getBoardsByCourseIdAsync } from "redux/board/board.async";
import { getClassByBoardAndCourseIdAsync } from "redux/class/class.async";
import { getBatchByCourseBoardClassAsync } from "redux/batchtype/batchtype.async";
import {
  createCoursePackageAsync,
  coursePackageByIdAsync,
  updateCoursePackageByIdAsync,
} from "redux/productPackage/productPackage.async";
import { getAllStaffsAsync } from "redux/staff/staff.async";
import { PATH_DASHBOARD } from "routes/paths";
import UploadBox from "components/CustomUploads/UploadBox";
import { GenerateBase64 } from "utils/convertToBase64";
import Iconify from "components/iconify/Iconify";
import { Add, Remove } from "@mui/icons-material";
import { isJson } from "utils/isJson";
import BackupIcon from "@mui/icons-material/Backup";

function CreatePackage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { courseLoader, course } = useSelector((state) => state.course);
  const { boardLoader, boardByCourse, boardadd, boardId, updateId } =
    useSelector((state) => state.board);
  const { classLoader, classbycourseboard } = useSelector(
    (state) => state.class
  );
  const { batchLoader, batchByCourseBoardClass } = useSelector(
    (state) => state.batch
  );
  const { staffLoader, staffs, staffAttendance, staffAttendanceLoader } =
    useSelector((state) => state.staff);
  const {
    createPackageLoader,
    packagePostData,
    getPackByIdLoade,
    getPackByIdData,
    updatePackage,
    updatePackageLoader,
  } = useSelector((state) => state.package);

  const [selectedStaffs, setSelectedStaffs] = useState([]);

  const [formFields, setFormFields] = useState([
    { thumbnail: "", thumbnailOriginal: "", url: "", video_title: "" },
  ]);

  const [formProdFields, setFormProdFields] = useState([
    { thumbnail: "", thumbnailOriginal: "", name: "" },
  ]);

  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);

  const handleAddFields = () => {
    setFormFields([
      ...formFields,
      { thumbnail: "", thumbnailOriginal: "", url: "", video_title: "" },
    ]);
  };

  const handleRemoveFields = (index) => {
    const values = [...formFields];
    values.splice(index, 1);
    setFormFields(values);
  };

  const handleDemoTitleChange = (index, event) => {
    const values = [...formFields];
    values[index][event.target.name] = event.target.value;
    setFormFields(values);
  };

  const handleInputChange = (index, event) => {
    const values = [...formFields];
    values[index][event.target.name] = event.target.value;
    setFormFields(values);
  };

  const handleProdAddFields = () => {
    setFormProdFields([
      ...formProdFields,
      { thumbnail: "", thumbnailOriginal: "", name: "" },
    ]);
  };

  const handleProdRemoveFields = (index) => {
    const values = [...formProdFields];
    values.splice(index, 1);
    setFormProdFields(values);
  };

  const handleProdInputChange = (index, event) => {
    const values = [...formProdFields];
    values[index][event.target.name] = event.target.value;
    setFormProdFields(values);
  };

  const handleAddFaqFields = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const handleRemoveFaqFields = (index) => {
    const values = [...faqs];
    values.splice(index, 1);
    setFaqs(values);
  };

  const handleInputFaqChange = (index, event) => {
    const values = [...faqs];
    values[index][event.target.name] = event.target.value;
    setFaqs(values);
  };

  const getCourseAsync = () => {
    dispatch(getcourseAsync({}));
  };

  useEffect(() => {
    getCourseAsync();
    dispatch(
      getAllStaffsAsync({
        page: "",
        limit: "",
        search: "",
        department: 4,
        classes: "",
      })
    );
  }, []);

  useEffect(() => {
    if (formFields?.length == 0) {
      setFormFields([
        { thumbnail: "", thumbnailOriginal: "", url: "", video_title: "" },
      ]);
    } else if (formProdFields?.length == 0) {
      setFormProdFields([{ thumbnail: "", thumbnailOriginal: "", name: "" }]);
    } else if (faqs?.length == 0) {
      setFaqs([{ question: "", answer: "" }]);
    }
  }, [formFields, formProdFields, setFaqs]);

  const onSubmit = async (values) => {
    const thumbnailBase64 = await GenerateBase64(values.thumbnail[0]);
    let brochureBase64 = " ";
    if (values.brochure[0] !== null) {
      brochureBase64 = await GenerateBase64(values.brochure[0]);
    } else {
      brochureBase64 = "";
    }

    const listinfo = [];
    for (let value of values?.list) {
      if (value.list !== "") {
        listinfo.push(value.list);
      }
    }

    let formFieldsUpdate = formFields?.map(
      ({ thumbnail, url, video_title }) => ({
        thumbnail: thumbnail ? thumbnail : "",
        url,
        video_title,
      })
    );

    let formProdFieldsUpdate = formProdFields?.map(({ thumbnail, name }) => ({
      thumbnail: thumbnail ? thumbnail : "",
      name,
    }));

    const payload = {
      Id: parseInt(id),
      courseId: values.course,
      boardId: values.boards,
      classId: values.class,
      batchTypeId: values.batch,
      package_title: values.packageTitle,
      package_thumbnail: thumbnailBase64,
      package_duration: values.packageduration,
      package_start_date: values.sod,
      package_end_date: values.type == "Live" ? values.eod : "",
      package_type: values.type,
      package_price: values.price,
      package_selling_price: values.sprice,
      package_description: JSON.stringify(listinfo),
      package_brochure: brochureBase64,
      demoVideo: formFieldsUpdate,
      prodOffering: formProdFieldsUpdate,
      faq: faqs,
      addressForm: values?.addressForm == "Yes" ? true : false,
      teacher: selectedStaffs?.length > 0 ? selectedStaffs : [],
      invoice_title: values?.invoiceTitle,
      delivery_charge: values?.delivery,
      // video_title: values?.videoTitle,
    };

    if (id) {
      dispatch(updateCoursePackageByIdAsync(payload)).then((res) => {
        if (res?.payload?.status === 200) {
          formik.setFieldValue("course", "");
          formik.setFieldValue("boards", "");
          formik.setFieldValue("class", "");
          formik.setFieldValue("batch", "");
          formik.setFieldValue("packageTitle", "");
          formik.setFieldValue("thumbnail", "");
          formik.setFieldValue("packageduration", "");
          formik.setFieldValue("sod", "");
          formik.setFieldValue("eod", "");
          formik.setFieldValue("type", "");
          formik.setFieldValue("price", "");
          formik.setFieldValue("sprice", "");
          formik.setFieldValue("list", "");
          formik.setFieldValue("brochure", "");
          formik.setFieldValue("invoiceTitle", "");
          formik.setFieldValue("delivery", "");
          toast.success(res?.payload?.message, toastoptions);
          navigate(PATH_DASHBOARD.productpackage);
        }
      });
    } else {
      delete payload.Id;
      dispatch(createCoursePackageAsync(payload)).then((res) => {
        if (res?.payload?.status === 200) {
          formik.setFieldValue("course", "");
          formik.setFieldValue("boards", "");
          formik.setFieldValue("class", "");
          formik.setFieldValue("batch", "");
          formik.setFieldValue("packageTitle", "");
          formik.setFieldValue("thumbnail", "");
          formik.setFieldValue("packageduration", "");
          formik.setFieldValue("sod", "");
          formik.setFieldValue("eod", "");
          formik.setFieldValue("type", "");
          formik.setFieldValue("price", "");
          formik.setFieldValue("sprice", "");
          formik.setFieldValue("list", "");
          formik.setFieldValue("brochure", "");
          formik.setFieldValue("invoiceTitle", "");
          formik.setFieldValue("delivery", "");
          toast.success(res?.payload?.message, toastoptions);
          navigate(PATH_DASHBOARD.productpackage);
        }
      });
    }
  };

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate,
  });

  useEffect(() => {
    if (id && getPackByIdData?.data) {
      formik.setFieldValue("course", getPackByIdData?.data?.courseId);
      formik.setFieldValue("boards", getPackByIdData?.data?.boardId);
      formik.setFieldValue("class", getPackByIdData?.data?.classId);
      formik.setFieldValue("batch", getPackByIdData?.data?.batchTypeId);
      formik.setFieldValue("delivery", getPackByIdData?.data?.delivery_charge);
      formik.setFieldValue(
        "invoiceTitle",
        getPackByIdData?.data?.invoice_title
      );
      formik.setFieldValue(
        "packageTitle",
        getPackByIdData?.data?.package_title
      );
      formik.setFieldValue("thumbnail", [
        getPackByIdData?.data?.package_thumbnail,
      ]);
      formik.setFieldValue(
        "packageduration",
        getPackByIdData?.data?.package_duration
      );
      formik.setFieldValue(
        "sod",
        moment(getPackByIdData?.data?.package_start_date).format("YYYY-MM-DD")
      );
      formik.setFieldValue(
        "eod",
        moment(getPackByIdData?.data?.package_end_date).format("YYYY-MM-DD")
      );
      formik.setFieldValue("type", getPackByIdData?.data?.package_type);
      formik.setFieldValue("price", getPackByIdData?.data?.package_price);
      formik.setFieldValue(
        "sprice",
        getPackByIdData?.data?.package_selling_price
      );

      if (isJson(getPackByIdData?.data?.package_description)) {
        const maplist = JSON.parse(
          getPackByIdData?.data?.package_description
        ).map((ev) => {
          return {
            list: ev,
          };
        });

        formik.setFieldValue(
          "addressForm",
          getPackByIdData?.data?.addressForm == 1 ? "Yes" : "No"
        );

        formik.setFieldValue("list", maplist);
        let newArray = getPackByIdData?.data?.teacher
          ? getPackByIdData.data.teacher.map((teacher) => teacher.teacherId)
          : [];
        setSelectedStaffs(newArray);
      }

      const updatedVideo =
        getPackByIdData?.data?.demoVideo &&
        getPackByIdData?.data?.demoVideo?.map((item) => {
          return {
            ...item,
            thumbnailOriginal: item?.thumbnail,
          };
        });

      setFormFields(updatedVideo);

      const updatedProdOffer =
        getPackByIdData?.data?.prodOffers &&
        getPackByIdData?.data?.prodOffers?.map((item) => {
          return {
            ...item,
            thumbnailOriginal: item?.thumbnail,
          };
        });
      setFormProdFields(updatedProdOffer);

      const faqData =
        getPackByIdData?.data?.faq &&
        getPackByIdData?.data?.faq.map((item) => ({ ...item }));

      setFaqs(faqData);

      formik.setFieldValue("brochure", [
        getPackByIdData?.data?.package_brochure,
      ]);
    }
  }, [getPackByIdData?.data, id]);

  useEffect(() => {
    if (formik.values.course) {
      dispatch(
        getBoardsByCourseIdAsync({
          courseId: formik.values.course,
        })
      );
    }
  }, [formik.values.course]);

  useEffect(() => {
    if (formik.values.boards) {
      dispatch(
        getClassByBoardAndCourseIdAsync({
          courseId: formik.values.course,
          boardId: formik.values.boards,
        })
      );
    }
  }, [formik.values.boards]);

  useEffect(() => {
    if (formik.values.class) {
      dispatch(
        getBatchByCourseBoardClassAsync({
          courseId: formik.values.course,
          boardId: formik.values.boards,
          classId: formik.values.class,
        })
      );
    }
  }, [formik.values.class]);

  useEffect(() => {
    if (id) {
      const payload = {
        id: id,
      };
      dispatch(coursePackageByIdAsync(payload));
    }
  }, [id]);

  const types = [
    { value: "Navodaya_Kit", name: "Navodaya Kit" },
    { value: "Recorded", name: "Recorded" },
    { value: "Live", name: "Live" },
    { value: "Physical_Product", name: "Physical Product" },
  ];

  const formShow = [
    { value: "Yes", name: "Yes" },
    { value: "No", name: "No" },
  ];

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const filesName = file.path.includes(".pdf");

    if (file.size > 5 * 1024 * 1024) {
      toast.error("The file size should not exceed 5 MB.", toastoptions);
      return false;
    }

    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    if (file) {
      if (filesName == true) {
        formik.setFieldValue("brochure", [newFile]);
      } else {
        formik.setFieldValue("thumbnail", [newFile]);
      }
    }
  };

  const handleThumbnailDrop = async (acceptedFiles, index) => {
    const file = acceptedFiles[0];

    if (file.size > 5 * 1024 * 1024) {
      toast.error("The file size should not exceed 5 MB.", toastoptions);
      return false;
    }

    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    const thumbnailBase64 = await GenerateBase64(newFile);

    if (file) {
      const updatedFormFields = [...formFields];
      updatedFormFields[index].thumbnailOriginal = newFile;
      updatedFormFields[index].thumbnail = thumbnailBase64;
      setFormFields(updatedFormFields);
    }
  };

  const handleProdThumbnailDrop = async (acceptedFiles, index) => {
    const file = acceptedFiles[0];

    if (file.size > 5 * 1024 * 1024) {
      toast.error("The file size should not exceed 5 MB.", toastoptions);
      return false;
    }

    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    const thumbnailBase64 = await GenerateBase64(newFile);

    if (file) {
      const updatedFormFields = [...formProdFields];
      updatedFormFields[index].thumbnailOriginal = newFile;
      updatedFormFields[index].thumbnail = thumbnailBase64;
      setFormProdFields(updatedFormFields);
    }
  };

  const handleStaffChange = (event) => {
    const value = event.target.value;
    if (value.includes(0)) {
      if (selectedStaffs.length === staffs?.data?.length) {
        setSelectedStaffs([]);
      } else {
        setSelectedStaffs(staffs?.data?.map((staff) => staff.id));
      }
    } else {
      setSelectedStaffs(value);
    }
  };

  return (
    <>
      <Container maxWidth={themeStretch ? "lg" : false}>
        <CustomBreadcrumbs
          links={[
            { name: "Master", href: "" },
            {
              name: "Package",
              href: PATH_DASHBOARD.productpackage,
            },
            {
              name: id ? "Update Package" : "Create Package",
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
                  <FormControl
                    fullWidth
                    disabled={courseLoader}
                    error={Boolean(
                      formik.touched.course && formik.errors.course
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
                      name="course"
                      {...formik.getFieldProps("course")}
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

                  <FormControl
                    fullWidth
                    disabled={boardLoader}
                    error={Boolean(
                      formik.touched.boards && formik.errors.boards
                    )}
                  >
                    <InputLabel id="demo-simple-select-label">
                      {boardLoader ? (
                        <CustomComponentLoader padding="0 0" size={20} />
                      ) : (
                        "Boards"
                      )}
                    </InputLabel>
                    <Select
                      label="Boards"
                      name="boards"
                      {...formik.getFieldProps("boards")}
                      onChange={formik.handleChange}
                    >
                      <MenuItem defaultValue value="">
                        Select Board
                      </MenuItem>
                      {boardByCourse?.map((ev, index) => {
                        return (
                          <MenuItem value={ev.id} key={ev.index}>
                            {ev.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <FormControl
                    fullWidth
                    disabled={classLoader}
                    error={Boolean(formik.touched.class && formik.errors.class)}
                  >
                    <InputLabel id="demo-simple-select-label">
                      {classLoader ? (
                        <CustomComponentLoader padding="0 0" size={20} />
                      ) : (
                        "Classes"
                      )}
                    </InputLabel>
                    <Select
                      label="Classes"
                      name="class"
                      {...formik.getFieldProps("class")}
                      onChange={formik.handleChange}
                    >
                      <MenuItem defaultValue value="">
                        Select Class
                      </MenuItem>
                      {classbycourseboard?.map((ev, index) => {
                        return (
                          <MenuItem value={ev.id} key={ev.index}>
                            {ev.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <FormControl
                    fullWidth
                    disabled={batchLoader}
                    error={Boolean(formik.touched.batch && formik.errors.batch)}
                  >
                    <InputLabel id="demo-simple-select-label">
                      {batchLoader ? (
                        <CustomComponentLoader padding="0 0" size={20} />
                      ) : (
                        "Batch Types"
                      )}
                    </InputLabel>
                    <Select
                      label="Batch Types"
                      name="batch"
                      {...formik.getFieldProps("batch")}
                      onChange={formik.handleChange}
                    >
                      <MenuItem defaultValue value="">
                        Select Batch Type
                      </MenuItem>
                      {batchByCourseBoardClass?.map((ev, index) => {
                        return (
                          <MenuItem value={ev.id} key={ev.index}>
                            {ev.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <Box sx={{ mb: "15px" }}>
                    <UploadBox
                      height={58}
                      name="thumbnail"
                      label="Thumbnail"
                      accept={{
                        "image/*": [],
                      }}
                      onDrop={handleDrop}
                      file={formik.values.thumbnail[0]}
                      error={Boolean(
                        formik.touched.thumbnail && formik.errors.thumbnail
                      )}
                    />
                  </Box>
                  <FormControl fullWidth>
                    <TextField
                      name="packageTitle"
                      label="Package Title"
                      {...formik.getFieldProps("packageTitle")}
                      onChange={formik.handleChange}
                      fullWidth
                      error={
                        formik.touched.packageTitle &&
                        formik.errors.packageTitle
                      }
                      inputProps={{ sx: { height: "23px" } }}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField
                      name="invoiceTitle"
                      label="Invoice Title"
                      {...formik.getFieldProps("invoiceTitle")}
                      onChange={formik.handleChange}
                      fullWidth
                      // error={
                      //   formik.touched.invoiceTitle &&
                      //   formik.errors.invoiceTitle
                      // }
                      inputProps={{ sx: { height: "23px" } }}
                    />
                  </FormControl>

                  <FormControl
                    fullWidth
                    // disabled={courseLoader}
                    error={Boolean(formik.touched.type && formik.errors.type)}
                  >
                    <InputLabel>Type</InputLabel>
                    <Select
                      label="Type"
                      name="type"
                      {...formik.getFieldProps("type")}
                      onChange={formik.handleChange}
                    >
                      <MenuItem defaultValue value="">
                        Select Type
                      </MenuItem>
                      {types?.map((ev, index) => {
                        return (
                          <MenuItem value={ev.value} key={ev.index}>
                            {ev.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <TextField
                      name="packageduration"
                      type="number"
                      maxLength={10}
                      label="Package Duration (in months)"
                      {...formik.getFieldProps("packageduration")}
                      onChange={formik.handleChange}
                      fullWidth
                      error={
                        formik.touched.packageduration &&
                        formik.errors.packageduration
                      }
                    />
                  </FormControl>

                  <FormControl fullWidth>
                    <TextField
                      // disabled={id ? true : false}
                      InputLabelProps={{ shrink: true }}
                      type="date"
                      name="sod"
                      label="Start Date"
                      style={{ color: id ? "white !important" : null }}
                      fullWidth
                      inputProps={
                        {
                          // max: new Date().toISOString().split("T")[0],
                        }
                      }
                      {...formik.getFieldProps("sod")}
                      onChange={formik.handleChange}
                      error={formik.touched.sod && formik.errors.sod}
                    />
                  </FormControl>

                  {formik.values.type == "Live" && (
                    <FormControl fullWidth>
                      <TextField
                        // disabled={id ? true : false}
                        InputLabelProps={{ shrink: true }}
                        type="date"
                        name="eod"
                        label="End Date"
                        style={{ color: id ? "white !important" : null }}
                        fullWidth
                        inputProps={{
                          min: formik.values.sod,
                        }}
                        {...formik.getFieldProps("eod")}
                        onChange={formik.handleChange}
                        error={formik.touched.eod && formik.errors.eod}
                      />
                    </FormControl>
                  )}

                  <FormControl fullWidth>
                    <TextField
                      name="price"
                      // type="number"
                      fullWidth
                      minLength={20}
                      inputProps={{ maxLength: 10, sx: { height: "23px" } }}
                      // disabled={Boolean(id) && studentById?.price}
                      label={"Price"}
                      {...formik.getFieldProps("price")}
                      onChange={formik.handleChange}
                      error={Boolean(
                        formik.touched.price && formik.errors.price
                      )}
                    />
                  </FormControl>

                  <FormControl fullWidth>
                    <TextField
                      name="sprice"
                      // type="number"
                      fullWidth
                      minLength={20}
                      // inputProps={{ minLength: 10 }}
                      inputProps={{ maxLength: 10 }}
                      // disabled={Boolean(id) && studentById?.sprice}
                      label={"Selling Price"}
                      {...formik.getFieldProps("sprice")}
                      onChange={formik.handleChange}
                      error={Boolean(
                        formik.touched.sprice && formik.errors.sprice
                      )}
                    />
                  </FormControl>
                  <Box sx={{ mb: "0px" }}>
                    <UploadBox
                      height={58}
                      name="brochure"
                      label="Brochure"
                      accept={{
                        "pdf/*": [],
                      }}
                      onDrop={handleDrop}
                      file={formik.values.brochure[0]}
                      // error={Boolean(
                      //   formik.touched.brochure && formik.errors.brochure
                      // )}
                    />
                  </Box>

                  <FormControl fullWidth>
                    <InputLabel id="demo-multiple-checkbox-label">
                      Assign Teacher
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      value={selectedStaffs}
                      onChange={handleStaffChange}
                      renderValue={(selected) => "Teachers Selected..."}
                      // renderValue={(selected) => {
                      //   let selectedNames = selectedStaffs
                      //     ?.filter((item) => staffs?.data?.includes(item.id))
                      //     .map((item) => item?.teacherName)
                      //     .join(", ");
                      //   return selectedNames
                      //     ? selectedNames
                      //     : "No Teachers Selected";
                      // }}
                    >
                      <MenuItem key={0} value={0}>
                        <Checkbox
                          checked={
                            selectedStaffs.length === staffs?.data?.length
                          }
                        />
                        <ListItemText primary="Select All" />
                      </MenuItem>
                      {staffs?.data?.map((staff) => (
                        <MenuItem key={staff.id} value={staff.id}>
                          <Checkbox
                            checked={selectedStaffs.indexOf(staff.id) > -1}
                          />
                          <ListItemText
                            primary={
                              `(${staff.name})` +
                              " " +
                              `(${staff.phone ? staff.phone : ""})`
                            }
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl
                    fullWidth
                    // disabled={courseLoader}
                    // error={Boolean(
                    //   formik.touched.addressForm && formik.errors.addressForm
                    // )}
                  >
                    <InputLabel>Show Address Form</InputLabel>
                    <Select
                      label="Show Address Form"
                      name="addressForm"
                      {...formik.getFieldProps("addressForm")}
                      value={formik?.values?.addressForm}
                      onChange={formik.handleChange}
                    >
                      <MenuItem defaultValue value="">
                        Show Address Form
                      </MenuItem>
                      {formShow?.map((ev, index) => {
                        return (
                          <MenuItem value={ev.value} key={ev.index}>
                            {ev.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField
                      name="delivery"
                      label="Shipping Price"
                      {...formik.getFieldProps("delivery")}
                      onChange={formik.handleChange}
                      fullWidth
                      // error={
                      //   formik.touched.delivery &&
                      //   formik.errors.delivery
                      // }
                      inputProps={{ sx: { height: "23px" } }}
                    />
                  </FormControl>
                </Box>

                <Grid item xs={12} md={12} mt="20px">
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "text.secondary", mb: "10px" }}
                  >
                    Package Description
                  </Typography>

                  {formik.values.list.map((listI, index) => (
                    <Box key={index} sx={{ mb: "15px" }}>
                      <Grid item xs={12} md={12}>
                        <FormControl fullWidth disabled={courseLoader}>
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
                                              formik.values.list.splice(
                                                index,
                                                1
                                              );
                                              formik.setFieldValue(
                                                "list",
                                                formik.values.list
                                              );
                                            }
                                          }}
                                          style={{
                                            cursor: "pointer",
                                            marginRight: "10px",
                                          }}
                                        />
                                      ) : null}
                                      {formik.values.list.length - 1 ===
                                        index && (
                                        <Iconify
                                          icon="eva:plus-fill"
                                          onClick={() => {
                                            formik.setFieldValue("list", [
                                              ...formik.values.list,
                                              { list: "" },
                                            ]);
                                          }}
                                          style={{
                                            cursor: "pointer",
                                          }}
                                        />
                                      )}
                                    </div>
                                  )}
                                </InputAdornment>
                              ),
                            }}
                            fullWidth
                            label={
                              courseLoader ? (
                                <CustomComponentLoader
                                  padding="0 0"
                                  size={20}
                                />
                              ) : (
                                "List*"
                              )
                            }
                            sx={{ background: "#F9F9F9" }}
                            name="list"
                            type="text"
                            value={listI.list}
                            onChange={(e) => {
                              formik.values.list[index][e.target.name] =
                                e.target.value;
                              formik.setFieldValue("list", formik.values.list);
                            }}
                            // error={Boolean(
                            //   formik.touched.list && formik.errors.list
                            // )}
                          />
                        </FormControl>
                      </Grid>
                    </Box>
                  ))}

                  <Typography variant="h5" sx={{ mt: 10 }}>
                    Watch Demo Class
                  </Typography>

                  <Grid item xs={12} md={12}>
                    {formFields?.map((field, index) => (
                      <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        gap="15px"
                        sx={{ width: "100%", margin: "15px auto" }}
                      >
                        <FormControl
                          fullWidth
                          sx={{ width: "25%", mb: "15px" }}
                        >
                          {/*<TextField
                            name="videoTitle"
                            fullWidth
                            // minLength={20}
                            inputProps={{ sx: { height: "23px" } }}
                            // disabled={Boolean(id) && studentById?.videoTitle}
                            label={"Demo Title"}
                            {...formik.getFieldProps("videoTitle")}
                            onChange={formik.handleChange}
                          /> */}
                          <TextField
                            name="video_title"
                            fullWidth
                            value={field?.video_title}
                            onChange={(event) =>
                              handleDemoTitleChange(index, event)
                            }
                            label="Demo Title"
                            variant="outlined"
                            inputProps={{ sx: { height: "23px" } }}
                          />
                        </FormControl>
                        <Box sx={{ mb: "15px", width: "48%" }}>
                          <UploadBox
                            height={58}
                            name="thumbnaildemo"
                            label="Thumbnail"
                            accept={{
                              "image/*": [],
                            }}
                            onDrop={(acceptedFiles) =>
                              handleThumbnailDrop(acceptedFiles, index)
                            }
                            file={field.thumbnailOriginal}
                            type="upload"
                          />
                        </Box>

                        <TextField
                          name="url"
                          fullWidth
                          value={field.url}
                          onChange={(event) => handleInputChange(index, event)}
                          label="Url"
                          variant="outlined"
                          sx={{ width: "45%", marginBottom: "20px" }}
                          inputProps={{ sx: { height: "23px" } }}
                        />
                        {index === formFields.length - 1 ? (
                          <>
                            {formFields.length > 1 &&
                              index === formFields.length - 1 && (
                                <IconButton
                                  onClick={() => handleRemoveFields(index)}
                                  sx={{ marginBottom: "20px" }}
                                >
                                  <Remove />
                                </IconButton>
                              )}
                            <IconButton
                              onClick={handleAddFields}
                              sx={{ marginBottom: "20px" }}
                            >
                              <Add />
                            </IconButton>
                          </>
                        ) : (
                          <IconButton
                            onClick={() => handleRemoveFields(index)}
                            sx={{ marginBottom: "20px" }}
                          >
                            <Remove />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                  </Grid>

                  <Typography variant="h5" sx={{ mt: 4 }}>
                    Product Offering
                  </Typography>
                  <Grid item xs={12} md={12}>
                    {formProdFields?.map((field, index) => (
                      <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        gap="15px"
                        sx={{ width: "100%", margin: "15px auto" }}
                      >
                        <Box sx={{ mb: "15px", width: "48%" }}>
                          <UploadBox
                            height={58}
                            name="thumbnailProd"
                            label="Thumbnail"
                            accept={{
                              "image/*": [],
                            }}
                            onDrop={(acceptedFiles) =>
                              handleProdThumbnailDrop(acceptedFiles, index)
                            }
                            file={field.thumbnailOriginal}
                            type="upload"
                          />
                        </Box>

                        <TextField
                          name="name"
                          value={field.name}
                          fullWidth
                          onChange={(event) =>
                            handleProdInputChange(index, event)
                          }
                          label="Texts"
                          variant="outlined"
                          sx={{ width: "45%", marginBottom: "20px" }}
                          inputProps={{ sx: { height: "23px" } }}
                        />
                        {index === formProdFields?.length - 1 ? (
                          <>
                            {formProdFields?.length > 1 &&
                              index === formProdFields?.length - 1 && (
                                <IconButton
                                  onClick={() => handleProdRemoveFields(index)}
                                  sx={{ marginBottom: "20px" }}
                                >
                                  <Remove />
                                </IconButton>
                              )}
                            <IconButton
                              onClick={handleProdAddFields}
                              sx={{ marginBottom: "20px" }}
                            >
                              <Add />
                            </IconButton>
                          </>
                        ) : (
                          <IconButton
                            onClick={() => handleProdRemoveFields(index)}
                            sx={{ marginBottom: "20px" }}
                          >
                            <Remove />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                  </Grid>

                  <Typography variant="h5" sx={{ mt: 4 }}>
                    FAQ
                  </Typography>
                  <Grid item xs={12} md={12}>
                    {faqs?.map((field, index) => (
                      <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        gap="15px"
                        sx={{ width: "100%", margin: "15px auto" }}
                      >
                        <TextField
                          name="question"
                          multiline
                          rows={4}
                          value={field.question}
                          onChange={(event) =>
                            handleInputFaqChange(index, event)
                          }
                          label="Question"
                          variant="outlined"
                          sx={{ width: "48%", marginBottom: "20px" }}
                        />

                        <TextField
                          name="answer"
                          multiline
                          rows={4}
                          value={field.answer}
                          onChange={(event) =>
                            handleInputFaqChange(index, event)
                          }
                          label="Answer"
                          variant="outlined"
                          sx={{ width: "45%", marginBottom: "20px" }}
                        />
                        {index === faqs.length - 1 ? (
                          <>
                            {faqs.length > 1 && index === faqs.length - 1 && (
                              <IconButton
                                onClick={() => handleRemoveFaqFields(index)}
                                sx={{ marginBottom: "20px" }}
                              >
                                <Remove />
                              </IconButton>
                            )}
                            <IconButton
                              onClick={handleAddFaqFields}
                              sx={{ marginBottom: "20px" }}
                            >
                              <Add />
                            </IconButton>
                          </>
                        ) : (
                          <IconButton
                            onClick={() => handleRemoveFaqFields(index)}
                            sx={{ marginBottom: "20px" }}
                          >
                            <Remove />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                  </Grid>
                </Grid>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={boardLoader}
                  >
                    {id ? "Update Package" : "Create Package"}
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

export default CreatePackage;
