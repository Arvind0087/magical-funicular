import { Helmet } from "react-helmet-async";
import { useSettingsContext } from "components/settings";
import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { getChaptersByIdAsync } from "redux/chapter/chapter.async";
import { getLearningContentByIdAsync } from "redux/syllabus/syllabus.async";
import { getSubjectsByStudentAsync } from "redux/async.api";
import LocalLibraryRoundedIcon from "@mui/icons-material/LocalLibraryRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { PATH_DASHBOARD } from "routes/paths";
import SubjectBlockCustom from "components/SubjectBlockCustom/SubjectBlockCustom";
import MyLearningReports from "pages/MyLearningReports/MyLearningReports";
import Learn from "./Learn";
import Test from "./Test";
import { useEffect } from "react";
import { getChapterByStudentAsync } from "redux/Revision/chapter.async";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

export default function Syllabus() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { themeStretch } = useSettingsContext();
  const [selectChapter, setSelectChapter] = useState("");
  const [currentTab, setCurrentTab] = useState("general");
  const [studentInfo, setstudentInfo] = useState({});
  const { subjectLoader, subjectBy } = useSelector((state) => state?.subject);
  const [selectSubject, setSelectSubject] = useState(
    subjectBy[0] ? subjectBy[0] : {}
  );
  const { studentById } = useSelector((state) => state?.student);
  const { getOnlySiteSettingData = [] } = useSelector(
    (state) => state?.getOnlySiteSetting
  );
  const { siteTitle } = getOnlySiteSettingData;
  const { subscriptionType } = studentById;

  useEffect(() => {
    setstudentInfo(studentById);
  }, [studentById]);

  useEffect(() => {
    // GET SUBJECTS
    if (studentInfo?.courseId) {
      dispatch(
        getSubjectsByStudentAsync({
          courseId: studentById.courseId,
          boardId: studentById.boardId,
          classId: studentById.classId,
          batchTypeId: studentById?.batchTypeId,
        })
      ).then((evv) => {
        if (evv?.payload?.data?.length > 0) {
          evv?.payload?.data?.map((item) => {
            if (location?.state?.subjectInfo)
              setSelectSubject(location?.state?.subjectInfo);
            if (item?.isAllSubject) setSelectSubject(item);
          });
          setCurrentTab("Learn");
        }
      });
    }
  }, [studentInfo]);

  const handleChangeChapter = (e) => {
    setSelectChapter(e.target.value);
  };

  useEffect(() => {
    dispatch(
      getLearningContentByIdAsync({
        subjectId: subjectBy[0]?.id,
      })
    );
  }, []);

  useEffect(() => {
    if (selectSubject?.id) {
      if (subscriptionType === "Free") {
        dispatch(
          getChapterByStudentAsync({
            courseId: studentById.courseId,
            boardId: studentById.boardId,
            classId: studentById.classId,
            batchTypeId: studentById?.batchTypeId,
            subjectId: selectSubject?.id,
          })
        );
      } else {
        dispatch(
          getChaptersByIdAsync({
            courseId: studentById.courseId,
            boardId: studentById.boardId,
            classId: studentById.classId,
            batchTypeId: studentById?.batchTypeId,
            subjectId: selectSubject?.id,
          })
        );
      }

      dispatch(
        getLearningContentByIdAsync({
          subjectId: selectSubject?.id,
        })
      );
    }
  }, [selectSubject]);

  const _tabs = [
    {
      value: "Learn",
      label: "Learn",
      component: (
        <Learn
          handleChangeChapter={handleChangeChapter}
          selectSubject={selectSubject}
        />
      ),
      icon: <LocalLibraryRoundedIcon />,
    },
    {
      value: "Test",
      label: "Test",
      component: (
        <Test
          handleChangeChapter={handleChangeChapter}
          chapterId={selectChapter}
          subjectId={selectSubject?.id}
        />
      ),
      icon: <ListAltRoundedIcon />,
    },
    {
      value: "Report",
      label: "Report",
      component: <MyLearningReports />,
      icon: <AssessmentRoundedIcon />,
    },
  ];

  const handleEvent = (ev) => {
    setSelectSubject(ev);
  };
  return (
    <>
      <Helmet>
        <title>Syllabus | {`${siteTitle}`}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "xl"}>
        {/* <Box sx={{ display: 'flex', alignItems: 'left' }}>
         <KeyboardBackspaceIcon sx={{ color: 'primary.main' }} onClick={() => navigate(-1)}/>
        </Box> */}
        {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="h4">Syllabus</Typography>
          </Box> */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h4">Start Learning</Typography>
          <Typography>Track your recently studied topics</Typography>
        </Box>
        {/* SUBJECT SLIDER */}
        <SubjectBlockCustom
          loader={subjectLoader}
          data={subjectBy}
          handleEvent={handleEvent}
          selectsubject={selectSubject}
        />
        {!subjectLoader && (
          <Box sx={{ mt: 7 }}>
            <Tabs
              value={currentTab}
              onChange={(event, newValue) => setCurrentTab(newValue)}
            >
              {_tabs.map((tab, In) => (
                <Tab
                  key={In}
                  label={tab.label}
                  value={tab.value}
                  icon={tab.icon}
                  iconPosition="start"
                  sx={{
                    bgcolor:
                      Boolean(currentTab === tab.value) && "primary.lighter",
                    px: 5,
                    margin: "0 !important",
                  }}
                />
              ))}
            </Tabs>
            {Boolean(selectSubject) &&
              _tabs.map(
                (tab) =>
                  tab.value === currentTab && (
                    <Box key={tab.value} sx={{ mt: 5 }}>
                      {tab.component}
                    </Box>
                  )
              )}
          </Box>
        )}
      </Container>
    </>
  );
}
