import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Helmet } from "react-helmet-async";
import { getSubjectsByStudentAsync } from "../../../redux/async.api";
import QuestionPage from "./component/QuestionPage";
import VideosPage from "./component/VideosPage";

const MyBookmarksPage = () => {
  const dispatch = useDispatch();
  const { boardId, classId, courseId, batchTypeId, id } = useSelector((state) => state?.student?.studentById
  );
  const { subjectBy } = useSelector(state => state?.subject)
  const subjectByStudentId = subjectBy;
  const { getOnlySiteSettingData = [] } = useSelector((state) => state.getOnlySiteSetting)
  const { siteTitle } = getOnlySiteSettingData
  //For Tabs Name.................
  const [currentTab, setCurrentTab] = useState(
    window.location.href.includes("myBookmarks?tab=video-tab") ? 'Videos' :
      window.location.href.includes("myBookmarks?tab=question-tab") ? 'QuestionPage'
        : "QuestionPage"
  );

  useEffect(() => {
    if (batchTypeId)
      dispatch(
        getSubjectsByStudentAsync({
          courseId: courseId,
          boardId: boardId,
          classId: classId,
          batchTypeId: batchTypeId
        })
      )
  }, [batchTypeId]);

  const TABS = [
    {
      value: "QuestionPage",
      label: "Questions",
      component: <QuestionPage tabs={subjectByStudentId} id={id}/>
    },
    {
      value: "Videos",
      label: "Videos",
      component: <VideosPage tabs={subjectByStudentId} id={id}/>
    }
  ];

  return (
    <>
    <Helmet>
        <title>My Bookmark | {`${siteTitle}`}</title>
      </Helmet>
      <Container>
        <Box>
          <Typography variant="h4">My Bookmarks</Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
          >
            {TABS.map((tab) => (
              <Tab
                sx={{
                  bgcolor:
                    Boolean(currentTab === tab.value) && "primary.lighter",
                  px: 5,
                  margin: "0 !important"
                }}
                key={tab.value}
                label={tab.label}
                value={tab.value}
              />
            ))}
          </Tabs>
          
          {TABS.map(
            (tab) =>
              tab.value === currentTab && (
                <Box key={tab.value} sx={{ mt: 5 }}>
                  {tab.component}
                </Box>
              )
          )}
        </Box>
      </Container>
    </>
  );
};

export default MyBookmarksPage;
