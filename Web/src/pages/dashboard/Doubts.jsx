import { useState, useRef } from "react";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase from "@mui/material/InputBase";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { toast } from "react-hot-toast";
import { alpha } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import SearchIcon from "@material-ui/icons/Search";
import { useSettingsContext } from "../../components/settings";
import {
  createDoubtAsync,
  getDoubtByStudentIdAsync,
  getSubjectByBatchTypeIdAsync,
  getAllDoubtOfStudentsAsync,
  getSubjectsByStudentAsync,
} from "../../redux/async.api";
import { emptydoubt } from "../../redux/slices/doubt.slice";
import { toastoptions } from "../../utils/toastoptions";
import { getChaptersByIdAsync } from "../../redux/chapter/chapter.async";
import MyDoubtsCard from "./MyDoubtsCard";
import { RHFUploadAvatar } from "../../components/hook-form";
import { fData } from "../../utils/formatNumber";
import { UploadAvatar, UploadBox } from "../../components/upload";
import { current } from "@reduxjs/toolkit";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { PATH_DASHBOARD } from "routes/paths";
import NoVideo from "../../assets/images/NoVideos.svg";

function Doubts() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState("My Doubts");
  const TABS = [
    {
      value: "My Doubts",
      label: "My Doubts",

      component: <MyDoubts />,
    },
    {
      value: "Ask  A Doubt",
      label: "Ask  A Doubt",
      component: <AskDoubt />,
    },
    {
      value: "Search Doubt",
      label: "Search Doubt",
      component: <SearchDoubt />,
    },
  ];

  return (
    <Container>
      {/* <Helmet>
        <title>Lecture Dekho | Doubts </title>
      </Helmet> */}

      <CustomBreadcrumbs
        heading="Ask A Doubt"
        links={[
          { name: "Dashboard", href: PATH_DASHBOARD.root },
          { name: "Doubts" },
        ]}
      />
      <Stack maxWidth={themeStretch ? false : "xl"}>
        <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Box>
        {TABS.map(
          (tab) =>
            tab.value === currentTab && (
              <Box key={tab.value} sx={{ mt: 5 }}>
                {tab.component}
              </Box>
            )
        )}
      </Stack>
    </Container>
  );
}

export default Doubts;

// --------------------MyDoubts-------------------

function MyDoubts() {
  const dispatch = useDispatch();
  const { studentById } = useSelector((state) => state?.student);
  const { myDoubtList, allDoubts } = useSelector((state) => state?.doubt);

  useEffect(() => {
    const payload = {
      page: "",
      limit: "",
    };
    dispatch(getAllDoubtOfStudentsAsync(payload));
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        {allDoubts?.data?.length > 0 ? (
          allDoubts?.data?.map((item, index) => (
            <Grid item xs={12} md={4} lg={4} key={index}>
              <MyDoubtsCard
                id={item?.id}
                posted_time={item?.createdAt}
                question={item?.question}
                profile_img={item?.image}
              />
            </Grid>
          ))
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img src={NoVideo} alt="" width="250px" />
              <Typography sx={{ fontWeight: 600, mt: 1 }}>
                No Doubt Found!
              </Typography>
            </Box>
          </>
        )}
      </Grid>
    </>
  );
}

// --------------------AskDoubt-------------------

function AskDoubt() {
  const fileInputRef = useRef();
  const dispatch = useDispatch();
  const { subjectCourseBoardClassBatch } = useSelector(
    (state) => state?.subject
  );
  const { studentById } = useSelector((state) => state?.student);
  const { boardId, classId, courseId, batchTypeId } = studentById;
  const { doubt } = useSelector((state) => state?.doubt);
  const { chaptersAsync } = useSelector((state) => state.chapterAsy);
  const { subjectBy } = useSelector((state) => state?.subject);
  const subjectByStudentId = subjectBy;

  const [errorhandle, setErrorhandle] = useState({
    image: false,
    title: false,
    link: false,
    type: false,
  });
  const [imageupload, seImageUpload] = useState();
  useEffect(() => {
    const payload = {
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      batchTypeId: batchTypeId,
    };
    dispatch(getSubjectsByStudentAsync(payload));
  }, []);

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const _initialValues = {
    studentId: studentById?.id,
    subjectId: "",
    chapterId: "",
    question: "",
    image: "",
  };

  const askValidate = yup.object().shape({
    studentId: yup.string().required("Student id is required"),
    subjectId: yup.string().required("Subject Is Required"),
    chapterId: yup.string().required("Chapter Is Required"),
    question: yup.string().required("Ask A Doubt Is Required"),
    image: yup.string(),
    // .required("Question is required")
  });
  const onSubmit = (values) => {
    dispatch(createDoubtAsync(values)).then((res) => {});
  };

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: askValidate,
  });
  useEffect(() => {
    if (doubt.status === 200) {
      toast.success(doubt.message, toastoptions);
      formik.resetForm();
      dispatch(emptydoubt());
    }
    if (doubt.status === 500) {
      toast.error(doubt.message, toastoptions);
      dispatch(emptydoubt());
    }
  }, [doubt]);

  const chepterHandler = (selectsubject) => {
    dispatch(
      getChaptersByIdAsync({
        courseId: courseId,
        boardId: boardId,
        classId: classId,
        batchTypeId: batchTypeId,
        subjectId: selectsubject,
      })
    );
  };
  const handleDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    const base64 = await convertBase64(file);
    formik.setFieldValue("image", base64);
    if (file) {
      // SET FILE IN STATE
      seImageUpload(newFile);
      setErrorhandle({
        ...errorhandle,
        image: false,
      });
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <FormControl fullWidth sx={{ mr: 1 }}>
            <InputLabel id="demo-simple-select-label-Subject">
              Subject
            </InputLabel>
            <Select
              labelId="demo-simple-select-label-Subject"
              id="demo-simple-select-Subject"
              label="Subject"
              name="subjectId"
              {...formik.getFieldProps("subjectId")}
              onChange={(e) => {
                formik.handleChange(e);
                chepterHandler(e.target.value);
              }}
            >
              {subjectByStudentId &&
                subjectByStudentId
                  .filter((item) => item.isAllSubject === false)
                  .map((item) => (
                    <MenuItem value={item.id}>{item.name}</MenuItem>
                  ))}
            </Select>
            {formik.touched.subjectId && formik.errors.subjectId && (
              <Typography color="error" fontSize="15px">
                {formik.errors.subjectId}
              </Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Chapter</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Chapter"
              name="chapterId"
              {...formik.getFieldProps("chapterId")}
              onChange={(e) => {
                formik.handleChange(e);
              }}
            >
              {chaptersAsync &&
                chaptersAsync?.map((item) => (
                  <MenuItem value={item.id}>{item.name}</MenuItem>
                ))}
            </Select>
            {formik.touched.chapterId && formik.errors.chapterId && (
              <Typography color="error" fontSize="15px">
                {formik.errors.chapterId}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <Box>
            <Typography sx={{ fontWeight: "500" }}>Your Doubt Here</Typography>
            <InputBase
              multiline
              fullWidth
              rows={9}
              placeholder="Ask A Doubt"
              name="question"
              sx={{
                p: 2,
                mt: 1,
                borderRadius: 2,
                border: (theme) =>
                  `solid 1px ${alpha(theme.palette.grey[500], 0.32)}`,
              }}
              {...formik.getFieldProps("question")}
              onChange={formik.handleChange}
            />
            {formik.touched.question && formik.errors.question && (
              <Typography color="error" fontSize="15px">
                {formik.errors.question}
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box sx={{ mt: 5 }}>
            <UploadAvatar
              name="image"
              accept={{
                "image/*": [],
              }}
              file={imageupload}
              error={errorhandle.image}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: "auto",
                    display: "block",
                    textAlign: "center",
                    color: errorhandle.image ? "red" : "text.secondary",
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of
                </Typography>
              }
            />
          </Box>
        </Grid>
      </Grid>

      <Stack alignItems="flex-end" mt={5}>
        <Button type="submit" variant="contained">
          POST
        </Button>
      </Stack>
    </form>
  );
}

// --------------------SearchDoubt----------------------------------------------

function SearchDoubt() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [resetFields, setResetFields] = useState(false);
  const { studentById } = useSelector((state) => state?.student);
  const { subjectCourseBoardClassBatch } = useSelector(
    (state) => state?.subject
  );
  const { myDoubtList } = useSelector((state) => state?.doubt);
  const { chaptersAsync } = useSelector((state) => state.chapterAsy);
  const { boardId, classId, courseId, batchTypeId } = studentById;

  useEffect(() => {
    const payload = {
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      batchTypeId: batchTypeId,
    };
    dispatch(getSubjectByBatchTypeIdAsync(payload));
  }, []);

  const _initialValues = {
    studentId: studentById?.id,
    subjectId: "",
    chapterId: "",
    question: "",
    image: "",
    search: "",
  };

  const askValidate = yup.object().shape({
    subjectId: yup.string(),
    chapterId: yup.string(),
    search: yup.string(),
  });

  const onSubmit = (values) => {
    const payload = {
      id: studentById?.id,
      subjectId: values.subjectId,
      chapterId: values.chapterId,
      search: values.search,
    };
    if (
      payload.subjectId !== "" ||
      payload.chapterId !== "" ||
      payload.search !== ""
    ) {
      dispatch(getDoubtByStudentIdAsync(payload));
    }
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: askValidate,
  });

  const chepterHandler = (selectsubject) => {
    dispatch(
      getChaptersByIdAsync({
        courseId: studentById.courseId,
        boardId: studentById.boardId,
        classId: studentById.classId,
        batchTypeId: studentById.batchTypeId,
        subjectId: selectsubject,
      })
    );
  };

  return (
    <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <FormControl fullWidth sx={{ mr: 1 }}>
            <InputLabel id="demo-simple-select-label-Subject">
              Subject
            </InputLabel>
            <Select
              labelId="demo-simple-select-label-Subject"
              id="demo-simple-select-Subject"
              label="Subject"
              name="subjectId"
              {...formik.getFieldProps("subjectId")}
              onChange={(e) => {
                formik.handleChange(e);
                chepterHandler(e.target.value);
              }}
            >
              {subjectCourseBoardClassBatch &&
                subjectCourseBoardClassBatch?.map((item) => (
                  <MenuItem value={item.id}>{item.name}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Chapter</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Chapter"
              name="chapterId"
              {...formik.getFieldProps("chapterId")}
              onChange={(e) => {
                formik.handleChange(e);
              }}
            >
              {chaptersAsync &&
                chaptersAsync?.map((item) => (
                  <MenuItem value={item.id}>{item.name}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search"
            name="search"
            {...formik.getFieldProps("search")}
            onChange={formik.handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={1}>
            <Grid item xs={6} md={6}>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  color: "#fff",
                  borderRadius: "60px",
                  px: 7,
                  py: 1.7,
                  mb: 2,
                  width: "100%",
                }}
              >
                Search
              </Button>
            </Grid>
            <Grid item xs={6} md={6}>
              <Button
                onClick={() => setResetFields((current) => !current)}
                variant="contained"
                type="submit"
                sx={{
                  color: "#fff",
                  borderRadius: "60px",
                  px: 7,
                  py: 1.7,
                  mb: 2,
                  width: "100%",
                }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2} mt={2}>
        {myDoubtList &&
          myDoubtList?.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
              <MyDoubtsCard
                id={item?.id}
                posted_time={item.createdAt}
                question={item.question}
                profile_img={item.image}
              />
            </Grid>
          ))}
      </Grid>
    </form>
  );
}
