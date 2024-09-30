import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useSettingsContext } from "components/settings";
import { getChapterByStudentAsync } from "redux/Revision/chapter.async";
import { getSubjectsByStudentAsync } from "redux/async.api";
import SubjectBlockCustom from "components/SubjectBlockCustom/SubjectBlockCustom";
import _ from "lodash";

export default function Revision() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [subjectInfo, setSubjectInfo] = useState([]);
  const [subjectInformation, setSubjectInformation] = useState({});
  const { studentById = [] } = useSelector((state) => state?.student);
  const { courseId, boardId, classId, batchTypeId } = studentById;
  const { subjectLoader } = useSelector((state) => state?.subject);
  const { chaptersLoader, chapterBy } = useSelector(
    (state) => state?.chapterTopicsCount
  );
  const { getOnlySiteSettingLoader, getOnlySiteSettingData = [] } = useSelector((state) => state.getOnlySiteSetting)
  const { siteLogo, siteAuthorName, favicon, siteTitle } = getOnlySiteSettingData

  useMemo(() => {
    // GET SUBJECTS
    if (courseId) {
      dispatch(
        getSubjectsByStudentAsync({
          courseId: courseId,
          boardId: boardId,
          classId: classId,
          batchTypeId: batchTypeId,
        })
      ).then((res) => {
        const { payload } = res || {};
        const { status, data } = payload || {};
        if (status === 200) {
          setSubjectInfo(data);
          if (data.length > 0)
            setSubjectInformation(data[0]);
        }
      });
    }
  }, [studentById]);

  useMemo(() => {
    // GET chapter
    if (subjectInformation?.id) {
      dispatch(
        getChapterByStudentAsync({
          courseId: courseId,
          boardId: boardId,
          classId: classId,
          batchTypeId: batchTypeId,
          subjectId: subjectInformation?.id,
        })
      );
    }
  }, [subjectInformation]);

  const handleEvent = (ev) => {
    setSubjectInformation(ev);
  };

  return (
    <>
      <Helmet>
        <title>Revision | {`${siteTitle}`}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "xl"}>
        <SubjectBlockCustom
          loader={subjectLoader}
          data={subjectInfo}
          handleEvent={handleEvent}
          selectsubject={subjectInformation}
        />

        {subjectInfo?.length > 0 && (
          <>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h4">Select Chapter</Typography>
            </Box>
            <RevisionChapter
              data={chapterBy}
              loader={chaptersLoader}
              selectedItem={subjectInformation}
            />
          </>
        )}
      </Container>
    </>
  );
}

const RevisionChapter = ({ data, selectedItem, loader }) => {
const navigate = useNavigate();
//NOTE: Navigate to RevisionDetail page
const handleNavRevisionDetail =(id, subjectId,subject,chapter,image)=>{
  navigate("/app/revision/revisionDetail", {
    state: {
      id: id,
      subjectId: subjectId,
      subject: subject,
      chapter: chapter,
      image: image,
    }
  });
}
  return (
    <Grid container rowSpacing={2} columnSpacing={6} sx={{ mt: 1 }}>
      {loader ? (
        <Grid item xs={12} md={6} lg={6}>
          <Card
            sx={{
              display: "flex",
              gap: "17px",
              p: 2,
              alignItems: "center",
              cursor: "pointer",
              width: "100%",
            }}
          >
            <Box>
              <Skeleton variant="circular" width={60} height={60} />
            </Box>
            <Box>
              <Skeleton
                variant="text"
                width={100}
                height={30}
                sx={{ fontSize: "1rem" }}
              />
              <Skeleton
                variant="text"
                width={100}
                height={30}
                sx={{ fontSize: "1rem" }}
              />
            </Box>
          </Card>
        </Grid>
      ) : (
        data?.map((item, index) => {
          return (
            <Grid item xs={12} md={6} lg={6} key={index}>
              <Card
                sx={{
                  display: "flex",
                  gap: "17px",
                  p: 2,
                  alignItems: "center",
                  cursor: "pointer",
                  width: "100%"
                }}
                onClick={()=>{handleNavRevisionDetail(item?.id, selectedItem.id, selectedItem.name, item?.name, selectedItem?.image)}}
              >
                {index < 10 ? (
                  <Typography
                    variant="h4"
                    sx={{
                      color: "primary.main",
                    }}
                  >
                    0{index + 1}
                  </Typography>
                ) : (
                  <Typography
                    variant="h4"
                    sx={{
                      color: "primary.main",
                    }}
                  >
                    {index + 1}
                  </Typography>
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  <Box>
                    <Typography>{item?.name}</Typography>
                    <Typography sx={{ fontSize: "12px", mt: 0.2 }}>
                      {item?.conceptsCount} Concepts
                    </Typography>
                  </Box>

                  <KeyboardArrowRightIcon
                    sx={{
                      width: "22px",
                      height: "22px",
                      color: "primary.main",
                    }}
                  />
                </Box>
              </Card>
            </Grid>
          );
        })
      )}
    </Grid>
  );
};
