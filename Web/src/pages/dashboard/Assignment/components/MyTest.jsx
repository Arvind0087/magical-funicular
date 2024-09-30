import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useTheme } from "@mui/material";
import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import {
  getchaptersBysubjectIdAsync,
  getOwnTestByUserIdAsync,
  getSubjectsByStudentAsync,
  getTestByUserIdAsync,
} from "../../../../redux/async.api";
import notePad from "../../../../assets/images/notePad.svg";
import { getTopicBysubBychapterAsync } from "../../../../redux/Revision/revision.async";
import CustomComponentLoader from "../../../../components/CustomComponentLoader/CustomComponentLoader";
import TrendingCarouselSection from "./TrendingCompo";

export const MyTest = (props) => {
  const { studentById } = props;
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subjectBy } = useSelector((state) => state?.subject);
  const { courseId, boardId, classId, batchTypeId, id } = studentById;
  const {
    getTestByUserId,
    getTestByUserIdLoader,
    getOwnTestByUserId,
    getOwnTestByUserIdLoader,
  } = useSelector((state) => state?.test);
  const { revisionTopicsBysubBychapter } = useSelector(
    (state) => state?.revision
  );
  // states
  const [chapters, setChapters] = useState([]);
  const [subjectId, setSubjectId] = useState();
  const [chapterId, setChapterId] = useState();
  const [showTopic, setShowTopic] = useState(false);

  useEffect(() => {
    // GET SUBJECTS
    if (courseId) {
      dispatch(
        getSubjectsByStudentAsync({
          courseId: courseId,
          boardId: boardId,
          classId: classId,
          batchTypeId: batchTypeId,
        })
      );
    }
  }, [studentById]);
  // get tests by category
  useEffect(() => {
    dispatch(
      getTestByUserIdAsync({
        userId: id,
      })
    );
  }, [id]);

  useEffect(() => {
    if (subjectId && chapters) {
      dispatch(
        getTestByUserIdAsync({
          userId: id,
          subjectId: subjectId,
          chapterId: chapterId,
        })
      );
    } else if (subjectId) {
      dispatch(
        getTestByUserIdAsync({
          userId: id,
          subjectId: subjectId,
        })
      );
    }
  }, [subjectId, chapterId]);
  // get own Test
  useEffect(() => {
    dispatch(
      getOwnTestByUserIdAsync({
        userId: id,
      })
    );
  }, [id]);

  useEffect(() => {
    if (subjectId && chapters) {
      dispatch(
        getOwnTestByUserIdAsync({
          userId: id,
          subjectId: subjectId,
          chapterId: chapterId,
        })
      );
    } else if (subjectId) {
      dispatch(
        getOwnTestByUserIdAsync({
          userId: id,
          subjectId: subjectId,
        })
      );
    }
  }, [subjectId, chapterId]);

  const handleChange = (event) => {
    //  GET CHAPTERS
    setSubjectId(event.target.value);
    if (event.target.value)
      dispatch(
        getchaptersBysubjectIdAsync({
          courseId: courseId,
          boardId: boardId,
          classId: classId,
          batchTypeId: batchTypeId,
          subjectId: event.target.value,
        })
      ).then((res) => {
        const { payload } = res || {};
        const { status, data } = payload || {};
        if (status === 200) {
          setChapters(data);
        }
      });
  };
  const handleChangeChapteId = (event) => {
    setChapterId(event.target.value);
    if (subjectId && event.target.value) {
      // get topics by chapter id
      dispatch(
        getTopicBysubBychapterAsync({
          courseId: courseId,
          boardId: boardId,
          classId: classId,
          batchTypeId: batchTypeId,
          subjectId: subjectId,
          chapterId: event.target.value,
        })
      );
      setShowTopic(true);
    }
  };

  const trendingTest = useMemo(() => {
    return getTestByUserId?.data?.filter(
      (item) => item?.category === "Treading Tests"
    );
  }, [getTestByUserId]);
  const testSeries = useMemo(() => {
    return getTestByUserId?.data?.filter(
      (item) => item?.category === "Test Series"
    );
  }, [getTestByUserId]);

  const mockTests = useMemo(() => {
    return getTestByUserId?.data?.filter(
      (item) => item?.category === "Mock Tests"
    );
  }, [getTestByUserId]);

  const ownTests = useMemo(() => {
    return getOwnTestByUserId?.filter((item) => item?.category === "Own Tests");
  }, [getOwnTestByUserId]);
  //NOTE : it will navigate to create test page
  const handleNavCreateTest = () => {
    navigate(PATH_DASHBOARD.createTest);
  };
  return (
    <>
      <Typography variant="h5">Apply Filter</Typography>
      <Box
        sx={{
          maxWidth: "500px",
          display: "flex",
          mt: 6,
          [theme.breakpoints.down("sm")]: {
            display: "block",
          },
        }}
      >
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Subject</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Subject"
            // value={selectedSubjects}
            defaultValue={""}
            onChange={(event) => handleChange(event)}
          >
            {subjectBy &&
              subjectBy
                .filter((item) => item.isAllSubject === false)
                .map((item, index) => (
                  <MenuItem value={item.id} key={index}>
                    {item.name}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>
        <FormControl
          fullWidth
          sx={{
            ml: 3,
            [theme.breakpoints.down("sm")]: {
              ml: 0,
              mt: 2,
            },
          }}
        >
          <InputLabel id="demo-simple-select-label">Chapter</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Chapter"
            // value={}
            defaultValue={""}
            onChange={(event) => handleChangeChapteId(event)}
          >
            {chapters &&
              chapters.map((item, index) => (
                <MenuItem value={item.id} key={index}>
                  {item.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={3}>
        {revisionTopicsBysubBychapter?.length > 0 &&
          showTopic &&
          revisionTopicsBysubBychapter?.map((data, index) => {
            return (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    width: "100%",
                    height: "auto",
                    overflow: "hidden",
                    cursor: "pointer",
                    p: "15px 10px",
                    mt: "30px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                  }}
                >
                  <Box sx={{ display: "flex" }}>
                    <Box
                      sx={{
                        borderRadius: "5px",
                        bgcolor: "primary.main",
                        p: 1,
                        paddingInline: 1.5,
                      }}
                    >
                      <img src={notePad} alt="" />
                    </Box>
                    <Box sx={{ display: "block", ml: 2 }}>
                      <p style={{ margin: "0px", fontWeight: 500 }}>
                        {data.subject}
                      </p>
                      <p style={{ margin: "0px", fontSize: "12px" }}>
                        {data.chapterName}
                      </p>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            );
          })}
      </Grid>

      <Box sx={{ mt: 7 }}>
        <Typography variant="h4">Create Your Own Test</Typography>
        <Typography>
          Customize your tests for any chapter or topic and strengthen your
          improvement areas{" "}
        </Typography>
        <Grid container sx={{ mt: -1 }}>
          <Grid item md={4} xs={12}>
            <Card
              sx={{
                backgroundColor: "primary.main",
                width: "100%",
                height: "auto",
                overflow: "hidden",
                cursor: "pointer",
                p: "20px 10px",
                mt: "30px",
                display: "flex",
                flexDirection: "column",
              }}
              onClick={handleNavCreateTest}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "50%",
                    backgroundColor: "#ffff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mr: 2,
                  }}
                >
                  <AddIcon sx={{ color: "primary.main", fontSize: "30px" }} />
                </Box>
                <Typography
                  variant="p"
                  style={{ fontSize: "18px", fontWeight: 500, color: "#ffff" }}
                >
                  Create New Test
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
      {trendingTest?.length > 0 ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h4">Trending Test</Typography>
          {getTestByUserIdLoader ? (
            <>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  color: "primary.main",
                  mt: 4,
                }}
              >
                <CustomComponentLoader padding="0" size={50} />
              </Box>
            </>
          ) : (
            <>
              <Typography>
                Explore for tests attempted by the students of your class.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <TrendingCarouselSection getTests={trendingTest} />
              </Box>
            </>
          )}
        </Box>
      ) : null}
      {testSeries?.length > 0 ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h4">Test Series</Typography>
          {getTestByUserIdLoader ? (
            <>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  color: "primary.main",
                  mt: 4,
                }}
              >
                <CustomComponentLoader padding="0" size={50} />
              </Box>
            </>
          ) : (
            <>
              <Typography>
                Test that helps you to decide on further study plan.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <TrendingCarouselSection getTests={testSeries} />
              </Box>
            </>
          )}
        </Box>
      ) : null}
      {mockTests?.length > 0 ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h4">Mock Test</Typography>
          {getTestByUserIdLoader ? (
            <>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  color: "primary.main",
                  mt: 4,
                }}
              >
                <CustomComponentLoader padding="0" size={50} />
              </Box>
            </>
          ) : (
            <>
              <Typography>
                Explore the test based on latest exam patterns.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <TrendingCarouselSection getTests={mockTests} />
              </Box>
            </>
          )}
        </Box>
      ) : null}
      {ownTests?.length > 0 ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h4">Own Test</Typography>
          {getOwnTestByUserIdLoader ? (
            <>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  color: "primary.main",
                  mt: 4,
                }}
              >
                <CustomComponentLoader padding="0" size={50} />
              </Box>
            </>
          ) : (
            <>
              <Typography>
                Explore test as per your learning pattern.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <TrendingCarouselSection getTests={ownTests} />
              </Box>
            </>
          )}
        </Box>
      ) : null}
    </>
  );
};
