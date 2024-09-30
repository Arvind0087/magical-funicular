import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Box,
  Grid,
  MenuItem,
  Checkbox,
  Typography,
  Card,
  TextField,
  FormControl,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { PATH_DASHBOARD } from "routes/paths";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import { useFormik } from "formik";
import { _initial, _validate, _time, _papertype } from "./utils";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createTestAsync } from "redux/slices/TestSlice/async.api";
import { emptytests } from "redux/slices/TestSlice/test.slice";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import DialogBox from "components/DialogBox/index";
import BoxGridTwo from "components/BoxGridTwo/BoxGridTwo";
import SelectMenuItem from "components/SelectMenuItem/index";
import TextFieldCustom from "components/TextFieldCustom/TextFieldCustom";
import Iconify from "components/iconify/Iconify";
import { useLocation } from "react-router-dom";
import { getAllQuestionAsync } from "redux/questionbank/questionbank.async";
import ReactHtmlParser from "react-html-parser";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import { getChapterByMultipleSubjectIdAsync } from "redux/assignment/assignment.async";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";
import _ from "lodash";
import { getSubjectByMultipleClassIdAsync } from "redux/staff/staff.async";
import moment from "moment";
import label from "components/label/index";

export default function Questions() {
  const { themeStretch } = useSettingsContext();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { staffLoader, getSubjectByMultipleClass } = useSelector(
    (state) => state.staff
  );

  const [actionModal, setActionModal] = useState(false);
  const { testLoader, createTest } = useSelector((state) => state.tests);
  const [InputSearchSubjectId, setInputSearchSubjectId] = useState([]);
  const [InputSearchchapterId, setInputSearchchapterId] = useState([]);
  const [questionInfo, setQuestionInfo] = useState([]);

  const { questionBankLoader, getAllquestions } = useSelector(
    (state) => state.questionbank
  );
  const { assignmentLoader, multipleChapler } = useSelector(
    (state) => state.assignment
  );

  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const onSubmit = async (values) => {
    const payload = {
      batchTypeIds: _.map(location.state.batch, (ev) => ev.id),
      batchStartDateIds: _.map(location.state.batchDate, (ev) => ev.id),
      category: values.papertype,
      title: values.papername,
      testTime: values.time,
      questionsId: questionInfo,
    };

    dispatch(createTestAsync(payload));
  };

  useEffect(() => {
    if (createTest.status === 200) {
      toast.success(createTest.message, toastoptions);
      dispatch(emptytests());
      formik.resetForm();
      navigate(PATH_DASHBOARD.testquestion);
    }
  }, [createTest]);

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate,
  });

  const InitialQuestion = () => {
    dispatch(
      getAllQuestionAsync({
        ...{
          subjectIds: [InputSearchSubjectId?.value],
        },
        ...(InputSearchchapterId.length > 0 && {
          subjectIds: [InputSearchSubjectId?.value],
          chapterIds: InputSearchchapterId.map((ev) => ev.value),
        }),
        batchTypeIds: _.map(location.state.batch, (ev) => ev.id),
      })
    );
  };

  useEffect(() => {
    InitialQuestion();
    dispatch(
      getSubjectByMultipleClassIdAsync({
        classId: [location.state.class.id],
        batchTypeIds: _.map(location.state.batch, (ev) => ev.id),
      })
    );
  }, []);

  useEffect(() => {
    if (InputSearchSubjectId) {
      dispatch(
        getChapterByMultipleSubjectIdAsync({
          // subjectId: _.map(InputSearchSubjectId, (ev) => ev.value),
          subjectId: [InputSearchSubjectId?.value],
        })
      );
    }
  }, [InputSearchSubjectId]);

  const Info = [
    {
      label: "Course",
      value: location.state?.course?.name,
    },
    {
      label: "Board",
      value: location.state?.board?.name,
    },
    {
      label: "Class",
      value: location.state?.class?.name,
    },
    {
      label: "Batch Type",
      value: _.map(location.state.batch, (ev) => ev.name).join(""),
    },
    {
      label: "Batch Start Date",
      value: _.map(location.state.batchDate, (ev) =>
        moment(ev.date).format("DD MMM YYYY")
      ).join(""),
    },
  ];

  const AutocompleteInfo = [
    // {
    //   loading: staffLoader,
    //   options: _.map(getSubjectByMultipleClass?.data, (ev) => {
    //     return { label: ev.subject, value: ev.id };
    //   }),
    //   value: InputSearchSubjectId,
    //   onChange: (event, value) => setInputSearchSubjectId(value),
    //   label: "Search By Subject",
    // },
    {
      loading: assignmentLoader,
      options: _.map(multipleChapler?.data, (ev) => {
        return { label: ev.name, value: ev.id };
      }),
      value: InputSearchchapterId,
      onChange: (event, value) => setInputSearchchapterId(value),
      label: "Search By Chapter",
    },
  ];

  const handleSelectQuestion = (ev) => {
    const findId = _.find(questionInfo, (evv) => evv === ev.id);
    if (!findId) {
      setQuestionInfo([...questionInfo, ev.id]);
    } else {
      const filterId = _.filter(questionInfo, (evv) => evv !== ev.id);
      setQuestionInfo(filterId);
    }
  };

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Test Questions | {`${tabTitle}`} </title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Questions"
        links={[
          { name: "Test" },
          { name: "Create Test", href: "/app/test/test-questions" },
          { name: "Questions" },
        ]}
        action={
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              onClick={() => setActionModal(true)}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              disabled={Boolean(questionInfo.length === 0)}
            >
              Final Submit
            </Button>
          </Box>
        }
      />
      <Box>
        <Box sx={{ mb: "20px", display: "flex" }}>
          {Info.map((ev, index) => {
            return (
              <TextFieldCustom
                sx={{
                  mr: 1,
                  mt: 2,
                  minWidth: "100px",
                }}
                label={ev.label}
                size="small"
                value={ev.value}
                inputProps={{ readOnly: true }}
              />
            );
          })}
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Box display="flex">
            <FormControl>
              <AutoCompleteCustom
                size="small"
                sx={{ width: 210, mr: 2, mb: { xs: 1, md: 0 } }}
                loading={staffLoader}
                options={_.map(getSubjectByMultipleClass?.data, (ev) => {
                  return {
                    label: ev.subject,
                    value: ev.id,
                  };
                })}
                value={InputSearchSubjectId}
                onChange={(event, value) => setInputSearchSubjectId(value)}
                label="Search By Subject"
              />
            </FormControl>

            {AutocompleteInfo.map((ev) => {
              return (
                <AutoCompleteCustom
                  multiple={true}
                  size="small"
                  sx={{ width: "450px", mr: 1 }}
                  loading={ev.loader}
                  options={ev.options}
                  value={ev.value}
                  onChange={ev.onChange}
                  label={ev.label}
                />
              );
            })}
            <Button
              variant="contained"
              sx={{
                ml: 0.5,
                mt: 0.25,
                borderRadius: "7px",
                height: "39px !important",
              }}
              onClick={() => {
                InitialQuestion();
              }}
            >
              Search
            </Button>
            <Button
              variant="contained"
              sx={{
                ml: 0.5,
                mt: 0.25,
                height: "39px !important",
                borderRadius: "7px",
              }}
              onClick={() => {
                let batchType = location.state.batch.map((ev) => ev.id);
                dispatch(
                  getAllQuestionAsync({
                    batchTypeIds: [],
                  })
                );
                setInputSearchSubjectId([]);
                setInputSearchchapterId([]);
                // setQuestionInfo([]);
              }}
            >
              Reset
            </Button>
          </Box>
          <Box>
            <TextField
              sx={{ width: 120 }}
              size="small"
              label="Question Count"
              inputProps={{ readOnly: true }}
              value={questionInfo.length}
            />
          </Box>
        </Box>
        {questionBankLoader ? (
          <Card
            sx={{ padding: "15px", mb: "10px", mt: "15px" }}
            style={{ borderRadius: "5px" }}
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ mb: "10px" }}
            >
              <CustomComponentLoader padding="0 0" size={20} />
            </Box>
          </Card>
        ) : (
          <>
            {getAllquestions?.data?.map((ev, index) => {
              return (
                <Box>
                  <Card
                    sx={{ padding: "15px", mb: "10px", mt: "15px" }}
                    style={{ borderRadius: "5px" }}
                  >
                    <Box display="flex" alignItems="center" sx={{ mb: "10px" }}>
                      <Checkbox
                        sx={{
                          p: 0,
                        }}
                        checked={Boolean(
                          _.find(questionInfo, (evv) => evv === ev.id)
                        )}
                        onChange={() => handleSelectQuestion(ev)}
                      />
                      <Typography
                        sx={{
                          ml: "10px",
                        }}
                      >
                        {ReactHtmlParser(ev.question)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          my: "8px",
                        }}
                      >
                        <Box
                          sx={{
                            backgroundColor: "#dff3ea",
                            width: "30px",
                            height: "30px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: "10px",
                          }}
                        >
                          A
                        </Box>
                        {ReactHtmlParser(ev.option1)}
                      </Typography>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          my: "8px",
                        }}
                      >
                        <Box
                          sx={{
                            backgroundColor: "#dff3ea",
                            width: "30px",
                            height: "30px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: "10px",
                          }}
                        >
                          B
                        </Box>
                        {ReactHtmlParser(ev.option2)}
                      </Typography>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          my: "8px",
                        }}
                      >
                        <Box
                          sx={{
                            backgroundColor: "#dff3ea",
                            width: "30px",
                            height: "30px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: "10px",
                          }}
                        >
                          C
                        </Box>
                        {ReactHtmlParser(ev.option3)}
                      </Typography>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          my: "8px",
                        }}
                      >
                        <Box
                          sx={{
                            backgroundColor: "#dff3ea",
                            width: "30px",
                            height: "30px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: "10px",
                          }}
                        >
                          D
                        </Box>
                        {ReactHtmlParser(ev.option4)}
                      </Typography>
                    </Box>
                  </Card>
                </Box>
              );
            })}
          </>
        )}
      </Box>

      <DialogBox
        open={actionModal}
        title="Create Test"
        onClose={() => setActionModal(false)}
      >
        <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
          <Grid
            container
            spacing={3}
            sx={{
              pt: "5px",
            }}
          >
            <Grid item xs={12} md={12}>
              <BoxGridTwo>
                <TextFieldCustom
                  name="papername"
                  label="Total Numbers of Questions"
                  fullWidth
                  shrink={false}
                  value={questionInfo?.length}
                  inputProps={{ readOnly: true }}
                />
                <SelectMenuItem
                  fullWidth
                  // size="small"
                  error={formik.touched.papertype && formik.errors.papertype}
                  InputLabelLabel="Paper Type"
                  InputLabelSize={20}
                  label="Paper Type"
                  name="papertype"
                  {...formik.getFieldProps("papertype")}
                  onChange={formik.handleChange}
                  defaultItemLabel="Select Paper Type"
                  data={_.map(_papertype, (ev, index) => {
                    return (
                      <MenuItem value={ev.value} key={index}>
                        {ev.label}
                      </MenuItem>
                    );
                  })}
                />

                <TextFieldCustom
                  name="papername"
                  label="Paper Name"
                  fullWidth
                  shrink={false}
                  error={formik.touched.papername && formik.errors.papername}
                  {...formik.getFieldProps("papername")}
                  onChange={formik.handleChange}
                />

                <SelectMenuItem
                  fullWidth
                  // size="small"
                  error={formik.touched.time && formik.errors.time}
                  InputLabelLabel="Time Duration (Min)"
                  InputLabelSize={20}
                  label="Time Duration (Min)"
                  name="time"
                  {...formik.getFieldProps("time")}
                  onChange={formik.handleChange}
                  defaultItemLabel="Select Time Duration (Min)"
                  data={_.map(_time, (ev, index) => {
                    return (
                      <MenuItem key={index} value={ev.value}>
                        {ev.label}
                      </MenuItem>
                    );
                  })}
                />
              </BoxGridTwo>
            </Grid>
          </Grid>
          <Box
            display="flex"
            flexDirection="row"
            columnGap={2}
            justifyContent="flex-end"
            sx={{ marginTop: "15px", marginBottom: "15px" }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              loading={testLoader}
            >
              Submit
            </LoadingButton>
            <Button type="reset" variant="contained">
              Reset
            </Button>
          </Box>
        </form>
      </DialogBox>
    </Container>
  );
}
