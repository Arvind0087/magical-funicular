import React, { useEffect, useState } from "react";
import { Autocomplete } from "@mui/lab";
import {
  Box,
  TextField,
  Card,
  Checkbox,
  Typography,
  Button
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getAllQuestionAsync } from "redux/questionbank/questionbank.async";
import ReactHtmlParser from "react-html-parser";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import { getQuestionScholarshipTestAsync } from "redux/questionbank/questionbank.async";

const Questions = ({ formik }) => {
  const dispatch = useDispatch();
  const [InputSearchSubjectId, setInputSearchSubjectId] = useState([]);
  const [InputSearchchapterId, setInputSearchchapterId] = useState([]);
  const [questionsAvailable, setQuestionsAvailable] = useState(false);

  const { questionBankLoader, getQuestionScholarshipTest } =
    useSelector((state) => state.questionbank);

 

  const { scholorshipLoader, getScholarshipDetails } = useSelector(
    (state) => state.scholorship
  );



  useEffect(() => {
    if (formik?.values?.classId?.value) {
      dispatch(
        getQuestionScholarshipTestAsync({
          classId: formik?.values?.classId?.value,
          scholarshipId: formik?.values?.name?.value
        })
      );
    }
  }, [formik?.values?.classId?.value]);

  const AutocompleteInfo = [
    {
      name: "name",
      options:
        getScholarshipDetails?.data?.map((ev) => {
          return { label: ev.name, value: ev.id };
        }) || [],
      onChange: (e, ev, reason) => {
        setInputSearchSubjectId(ev);
      },
      label: "Select Scholarship",
      loading: scholorshipLoader,
      value: InputSearchSubjectId
    }
  ];


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
      {getQuestionScholarshipTest?.data?.length > 0 ? (
        <>
          <Box display="flex" justifyContent="flex-end">
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
              {getQuestionScholarshipTest?.data?.map((ev, index) => {
                return (
                  <Box>
                    {questionBankLoader ? (
                      <CustomComponentLoader padding="0 0" size={20} />
                    ) : (
                      <>
                        {getQuestionScholarshipTest?.data?.length > 0 ? (
                          <Card
                            sx={{ padding: "15px", mb: "10px", mt: "15px" }}
                            style={{ borderRadius: "5px" }}
                          >
                            <Box
                              display="flex"
                              alignItems="center"
                              sx={{ mb: "10px" }}
                            >
                              <Checkbox
                                sx={{
                                  p: 0
                                }}
                                checked={Boolean(
                                  formik?.values?.questions?.find((evv) =>
                                     evv === ev.id
                                  )
                                )}
                                onChange={() => handleSelectQuestion(ev)}
                              />
                              <Typography
                                sx={{
                                  ml: "10px"
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
                                  my: "8px"
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
                                    marginRight: "10px"
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
                                  my: "8px"
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
                                    marginRight: "10px"
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
                                  my: "8px"
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
                                    marginRight: "10px"
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
                                  my: "8px"
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
                                    marginRight: "10px"
                                  }}
                                >
                                  D
                                </Box>
                                {ReactHtmlParser(ev.option4)}
                              </Typography>
                            </Box>
                          </Card>
                        ) : (
                          <Box>
                            <Typography>No questions found</Typography>
                          </Box>
                        )}
                      </>
                    )}
                  </Box>
                );
              })}
            </>
          )}
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh"
          }}
        >
          <Typography variant="h4"> No questions available</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Questions;
