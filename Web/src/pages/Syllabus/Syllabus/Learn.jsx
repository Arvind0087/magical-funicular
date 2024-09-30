import React, { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useTheme } from "@mui/material";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import LearnCarouselComponet from "./LearnCarouselSection";
import _ from "lodash";
import {
  getLearningContentByIdAsync,
  resumeLearningAsync,
} from "redux/syllabus/syllabus.async";
import rateUs from "../../../assets/images/rateUs.svg";
import RateUs from "pages/dashboard/RateUs/RateUs";

export default function Learn({ selectSubject }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [selectChapter, setSelectChapter] = useState("");
  const { chapterLoader, chaptersAsync } = useSelector(
    (state) => state?.chapterAsy
  );
  const { learningLoader, learningAsync } = useSelector(
    (state) => state?.syllabusAsy
  );
  const { resumeLearningLoader, resumeLearning = [] } = useSelector(
    (state) => state?.syllabusAsy
  );
  const { chaptersLoader, chapterBy } = useSelector(
    (state) => state?.chapterTopicsCount
  );
  const { studentById = {} } = useSelector((state) => state?.student);
  const { id, subscriptionType } = studentById;
  const { subjectLoader, subjectBy } = useSelector((state) => state?.subject);
  const [open, setOpen] = useState(false);
  const { getOnlySiteSettingLoader, getOnlySiteSettingData = [] } = useSelector(
    (state) => state.getOnlySiteSetting
  );
  const { siteTitle } = getOnlySiteSettingData;

  const handleOpen = () => setOpen(true);
  const handleChangeChapter = (e) => {
    setSelectChapter(e.target.value);
  };

  useEffect(() => {
    dispatch(
      resumeLearningAsync({
        subjectId: selectSubject?.id,
        chapterId: selectChapter,
      })
    );
  }, [selectChapter, selectSubject]);

  useEffect(() => {
    if (selectChapter)
      dispatch(
        getLearningContentByIdAsync({
          subjectId: selectSubject?.id,
          chapterId: selectChapter,
        })
      );
  }, [selectChapter]);

  const learningContent = useMemo(() => {
    return learningAsync.filter((item) => item?.tag === "Learning Content");
  }, [learningAsync]);

  const recorderLiveSession = useMemo(() => {
    return learningAsync.filter(
      (item) => item?.tag === "Recorded Live Session"
    );
  }, [learningAsync]);

  const helpResources = useMemo(() => {
    return learningAsync.filter((item) => item?.tag === "Help Resource");
  }, [learningAsync]);

  return (
    <>
      {!selectSubject?.isAllSubject ? (
        <FormControl size="small" sx={{ width: 300 }}>
          <InputLabel>Chapter</InputLabel>
          <Select label="Chapter" onChange={handleChangeChapter}>
            {(subscriptionType === "Free" ? chapterBy : chaptersAsync).map(
              (item, index) => (
                <MenuItem value={item.id} key={index}>
                  {item.name}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      ) : null}

      {resumeLearning?.length > 0 ? (
        <VideoBlock
          title="Resume Learning"
          discription="Pick upon where you left"
        >
          <LearnCarouselComponet
            data={resumeLearning}
            loader={learningLoader}
          />
        </VideoBlock>
      ) : null}
      {learningContent?.length > 0 ? (
        <VideoBlock
          title="Learning Content"
          discription=" Structured content to build concepts"
        >
          <LearnCarouselComponet
            data={learningContent}
            loader={learningLoader}
          />
        </VideoBlock>
      ) : null}

      {recorderLiveSession?.length > 0 ? (
        <VideoBlock
          title="Recorded Live sessions"
          discription=" Watch the recording of live sessions"
        >
          <LearnCarouselComponet
            data={recorderLiveSession}
            loader={learningLoader}
          />
        </VideoBlock>
      ) : null}

      {helpResources?.length > 0 ? (
        <VideoBlock
          title="Helpful Resources"
          discription="Students who wants to go extra mile"
        >
          <LearnCarouselComponet data={helpResources} loader={learningLoader} />
        </VideoBlock>
      ) : null}
      <Grid container>
        <Grid item xs={12} sm={12} md={9} lg={8}>
          <Card
            sx={{
              width: "100%",
              minHeight: 170,
              overflow: "hidden",
              cursor: "pointer",
              p: "20px 17px",
              mt: "30px",
              display: "flex",
              flexDirection: "row",
              backgroundColor: "#FFF9F0",
              [theme.breakpoints.down("md")]: {
                justifyContent: "space-between",
              },
            }}
          >
            <Grid item xs={5} sm={4} md={2}>
              <img src={rateUs} height="120px" width="110px" />
            </Grid>
            <Grid item xs={7} sm={8} md={10}>
              <Box
                sx={{
                  display: "block",
                  display: "flex",
                  ml: 1,
                  justifyContent: "space-between",
                  height: "90%",
                  [theme.breakpoints.down("md")]: {
                    flexDirection: "column",
                    justifyContent: "space-between",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography variant="h5">Enjoying {siteTitle}?</Typography>
                  <Typography sx={{ color: "#666666" }}>
                    Rate our app and tell us what you think. Your feedback is
                    valuable.
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    [theme.breakpoints.down("md")]: {
                      flexDirection: "row",
                      justifyContent: "flex-start",
                    },
                    width: "120px",
                  }}
                >
                  <Button
                    onClick={handleOpen}
                    sx={{
                      height: "35px",
                      [theme.breakpoints.down("md")]: {
                        width: "120px",
                        mt: 1,
                      },
                    }}
                    type="submit"
                    className="OTP-button"
                    variant="contained"
                  >
                    Rate Us
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      <RateUs open={open} setOpen={setOpen} />
    </>
  );
}

const VideoBlock = ({ title, discription, children }) => {
  return (
    <Box sx={{ mt: 2, ml: { xs: 2, sm: 0 }, mr: { xs: 2, sm: 0 } }}>
      <Typography variant="h4">{title}</Typography>
      <Typography>{discription}</Typography>
      <Box sx={{ mt: 2 }}>{children}</Box>
    </Box>
  );
};
