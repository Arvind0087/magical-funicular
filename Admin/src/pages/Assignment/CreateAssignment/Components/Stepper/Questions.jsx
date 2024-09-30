import React, { useEffect, useState } from "react";
import { Autocomplete } from "@mui/lab";
import {
  Box,
  TextField,
  Card,
  Checkbox,
  Typography,
  Button,
  FormControl,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getAllQuestionAsync } from "redux/questionbank/questionbank.async";
import ReactHtmlParser from "react-html-parser";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import { getChapterByMultipleSubjectIdAsync } from "redux/assignment/assignment.async";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";

const Questions = ({ formik }) => {
  const dispatch = useDispatch();
  const [InputSearchSubjectId, setInputSearchSubjectId] = useState([
    { label: "", value: "" },
  ]);
  const [InputSearchchapterId, setInputSearchchapterId] = useState([]);

  const { questionBankLoader, getAllquestions } = useSelector(
    (state) => state.questionbank
  );
  const { subjectLoader, subjectCourseBoardClassBatch } = useSelector(
    (state) => state.subject
  );
  const { assignmentLoader, multipleChapler } = useSelector(
    (state) => state.assignment
  );
  const { batchByCourseBoardClass } = useSelector((state) => state.batch);

  const InitialQuestion = () => {
    if (
      InputSearchSubjectId?.length == 0 &&
      InputSearchchapterId?.length == 0
    ) {
      dispatch(
        getAllQuestionAsync({
          batchTypeIds: [],
        })
      );
    } else {
      dispatch(
        getAllQuestionAsync({
          ...(InputSearchSubjectId.length > 0 && {
            subjectIds: InputSearchSubjectId.map((ev) => ev.value),
          }),
          ...(InputSearchchapterId.length > 0 && {
            chapterIds: InputSearchchapterId.map((ev) => ev.value),
            subjectIds: InputSearchSubjectId.map((ev) => ev.value),
          }),
          batchTypeIds: [formik.values.batchId],
        })
      );
    }
  };

  // useEffect(() => {
  //   if (!InputSearchSubjectId) {
  //     InitialQuestion();
  //   }
  // }, [InputSearchSubjectId]);

  useEffect(() => {
    dispatch(
      getAllQuestionAsync({
        batchTypeIds: [],
      })
    );
  }, []);

  const AutocompleteInfo = [
    // {
    //   name: "subjectId",
    //   options:
    //     subjectCourseBoardClassBatch?.map((ev) => {
    //       return { label: ev.name, value: ev.id };
    //     }) || [],
    //   onChange: (e, ev, reason) => {
    //     setInputSearchSubjectId(ev);
    //   },
    //   label: "Select Subject",
    //   loading: subjectLoader,
    //   value: InputSearchSubjectId,
    // },
    {
      name: "chapterId",
      options:
        multipleChapler?.data?.map((ev) => {
          return { label: ev.name, value: ev.id };
        }) || [],
      onChange: (e, ev, reason) => {
        setInputSearchchapterId(ev);
      },
      label: "Select Chapter",
      loading: assignmentLoader,
      value: InputSearchchapterId,
    },
  ];

  useEffect(() => {
    if (InputSearchSubjectId) {
      dispatch(
        getChapterByMultipleSubjectIdAsync({
          subjectId: InputSearchSubjectId.map((ev) => ev.value),
        })
      );
    }
  }, [InputSearchSubjectId]);

  // useEffect(() => {
  //   InitialQuestion();
  // }, []);

  console.log("InputSearchSubjectId...", InputSearchSubjectId);

  const handleSelectQuestion = (ev) => {
    const findId = formik.values.questions.find((evv) => evv === ev.id);
    if (!findId) {
      formik.setFieldValue("questions", [...formik.values.questions, ev.id]);
    } else {
      const filterId = formik.values.questions.filter((evv) => evv !== ev.id);
      formik.setFieldValue("questions", filterId);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <FormControl>
            <AutoCompleteCustom
              size="small"
              sx={{ width: 210, mr: 2, mb: { xs: 1, md: 0 } }}
              loading={subjectLoader}
              options={_.map(subjectCourseBoardClassBatch, (ev) => {
                return {
                  label: ev.name,
                  value: ev.id,
                };
              })}
              value={InputSearchSubjectId?.label}
              // onChange={(event, value) => setInputSearchSubjectId(value)}
              onChange={(event, value) => {
                const newValue = [{ label: value?.label, value: value?.value }];
                setInputSearchSubjectId(newValue);
              }}
              label="Search By Subject"
            />
          </FormControl>

          {AutocompleteInfo.map((ev) => {
            return (
              <Autocomplete
                loading={ev.loading}
                multiple
                disablePortal
                name={ev.name}
                options={ev.options}
                value={ev.value}
                sx={{ width: 350, mr: 2 }}
                size="small"
                onChange={ev.onChange}
                renderInput={(params) => (
                  <TextField {...params} label={ev.label} />
                )}
              />
            );
          })}
          <Button
            variant="contained"
            sx={{ ml: 0.5, mt: 0.25, borderRadius: "7px" }}
            onClick={() => InitialQuestion()}
          >
            Search
          </Button>
          <Button
            variant="contained"
            sx={{ ml: 0.5, mt: 0.25, borderRadius: "7px" }}
            onClick={() => {
              dispatch(
                getAllQuestionAsync({
                  batchTypeIds: [],
                })
              );
              setInputSearchSubjectId([{ label: "", value: "" }]);
              setInputSearchchapterId([]);
              // formik.setFieldValue("questions", []);
            }}
          >
            Reset
          </Button>
        </Box>
        <Box>
          <TextField
            sx={{ width: 100 }}
            size="small"
            disabled={true}
            value={formik?.values?.questions?.length}
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
                {questionBankLoader ? (
                  <CustomComponentLoader padding="0 0" size={20} />
                ) : (
                  <Card
                    onClick={() => handleSelectQuestion(ev)}
                    sx={{ padding: "15px", mb: "10px", mt: "15px" }}
                    style={{ borderRadius: "5px" }}
                  >
                    <Box
                      onClick={() => handleSelectQuestion(ev)}
                      display="flex"
                      alignItems="center"
                      sx={{ mb: "10px" }}
                    >
                      <Checkbox
                        sx={{
                          p: 0,
                        }}
                        checked={Boolean(
                          formik?.values?.questions?.find(
                            (evv) => evv === ev.id
                          )
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
                )}
              </Box>
            );
          })}
        </>
      )}
    </Box>
  );
};

export default Questions;
