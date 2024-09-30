import React from "react";
import { Helmet } from "react-helmet-async";
import { useState, useMemo } from "react";
import { useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import RevisionCard from "./modules/RevisionCard";
import RevisionQuestionCard from "./modules/RevisionQuestionCard";
import { getRevisionBysubBychapterAsync } from "redux/Revision/revision.async";
import { useSettingsContext } from "components/settings";
import LocalLibraryRoundedIcon from "@mui/icons-material/LocalLibraryRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import { CustomAvatar } from "components/custom-avatar";
import { styled, alpha } from "@mui/material/styles";
import RevisionSkeleton from "components/Skeletons/RevisionSkeleton/RevisionSkeleton";
import _ from "lodash";

export default function RevisionDetails() {
  const location = useLocation();
  const { themeStretch } = useSettingsContext();
  const { id, subjectId, subject, chapter, image } = location?.state;
  const [currentTab, setCurrentTab] = useState("Quick Bites");
  const [showBookmarked, setShowBookmarked] = useState(false);
  const { getOnlySiteSettingLoader, getOnlySiteSettingData = [] } = useSelector((state) => state.getOnlySiteSetting)
  const { siteLogo, siteAuthorName,favicon,siteTitle  } = getOnlySiteSettingData

  const handleBookmarkInfo = () => {
    setShowBookmarked(!showBookmarked);
  };

  const _tabs = [
    {
      value: "Quick Bites",
      label: "Quick Bites",
      icon: <LocalLibraryRoundedIcon />,
      component: (
        <ModuleCard
          chapterId={id}
          subjectId={subjectId}
          showBookmarked={showBookmarked}
          category={currentTab}
        />
      ),
    },
    {
      value: "Summary",
      label: "Summary",
      icon: <ListAltRoundedIcon />,
      component: (
        <ModuleCard
          chapterId={id}
          subjectId={subjectId}
          showBookmarked={showBookmarked}
          category={currentTab}
        />
      ),
    },
    {
      value: "Questions",
      label: "Questions",
      icon: <AssessmentRoundedIcon />,
      component: (
        <Questions
          chapterId={id}
          subjectId={subjectId}
          showBookmarked={showBookmarked}
          category={currentTab}
        />
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title> Revision | Revision Details | {`${siteTitle}`}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "xl"}>
        <StyledRoot>
          <CustomAvatar src={image} alt={subject} name={subject} />

          <Box sx={{ ml: 2, minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {subject}
            </Typography>

            <Typography
              variant="body2"
              noWrap
              sx={{ color: "text.secondary", display: "flex" }}
            >
              {chapter}
            </Typography>
          </Box>
        </StyledRoot>
        <Box>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                color: "primary.main",
                bgcolor: "primary.lighter",
                p: "9px",
                mr: "10px",
              }}
              onClick={handleBookmarkInfo}
            >
              {!showBookmarked ? (
                <BookmarkBorderIcon
                  sx={{
                    width: "30px",
                    height: "30px",
                    color: "primary.main",
                  }}
                />
              ) : (
                <BookmarkIcon
                  sx={{
                    width: "30px",
                    height: "30px",
                    color: "primary.main",
                  }}
                />
              )}
            </Box>
            <Tabs
              value={currentTab}
              onChange={(event, newValue) => {
                setShowBookmarked(false);
                setCurrentTab(newValue);
              }}
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
          </Box>
          {_tabs.map(
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
}

function ModuleCard({ subjectId, chapterId, showBookmarked, category }) {
  const dispatch = useDispatch();
  const [Invalue, setInvalue] = useState("All");

  const { revisionLoader, revisionBysubBychapter } = useSelector(
    (state) => state?.revision
  );

  const _topics = [
    { label: "All", value: "All" },
    { label: "Diagram", value: "Diagram" },
    { label: "Definition", value: "Definition" },
    { label: "Application", value: "Application" },
  ];

  useMemo(() => {
    if (subjectId && chapterId && Invalue && category) {
      const payload = {
        subjectId: subjectId,
        chapaterId: chapterId,
        topic: Invalue,
        category: category,
        bookmark: true,
      };
      if (Invalue === "All") delete payload.topic;
      if (!showBookmarked) delete payload.bookmark;
      if (category !== "Quick Bites") delete payload.topic;
      dispatch(getRevisionBysubBychapterAsync(payload));
    }
  }, [subjectId, chapterId, Invalue, category, showBookmarked]);

  const isBookMarkRemove = (evv) => {
    // if (showBookmarked) {
    //   let index = _.findIndex(revisionBysubBychapter, (obj) =>
    //     _.some(obj.list, { id: evv })
    //   );
    //   if (index !== -1) {
    //     const removeIn = _.remove(revisionBysubBychapter[index].list, {
    //       id: evv,
    //     });
    //     dispatch(removeBookmark(removeIn));
    //   }
    // }
  };

  return (
    <>
      {category === "Quick Bites" && (
        <ToogleButtonsCustom
          Invalue={Invalue}
          handleChange={(ev, value) => setInvalue(value)}
          Items={_topics}
        />
      )}

      {revisionLoader ? (
        <RevisionSkeleton />
      ) : (
        <Grid container spacing={2} mt={2}>
          {_.map(revisionBysubBychapter, (item) => {
            return _.map(item?.list, (ev, In) => {
              return (
                <Grid item xs={10} md={6} lg={4} key={In}>
                  <RevisionCard
                    item={item}
                    list={ev}
                    itemIn={{ category, subjectId, chapterId, In }}
                    isBookMarkRemove={isBookMarkRemove}
                  />
                </Grid>
              );
            });
          })}
        </Grid>
      )}
    </>
  );
}

function Questions({ subjectId, chapterId, showBookmarked, category }) {
  const dispatch = useDispatch();
  const { revisionLoader, revisionBysubBychapter } = useSelector(
    (state) => state?.revision
  );

  useMemo(() => {
    if (subjectId && chapterId && category) {
      const payload = {
        subjectId: subjectId,
        chapaterId: chapterId,
        category: category,
        bookmark: true,
      };
      if (!showBookmarked) delete payload.bookmark;
      dispatch(getRevisionBysubBychapterAsync(payload));
    }
  }, [subjectId, chapterId, category, showBookmarked]);

  const isBookMarkRemove = (evv) => {
    // if (showBookmarked) {
    //   let index = _.findIndex(revisionBysubBychapter, (obj) =>
    //     _.some(obj.list, { id: evv })
    //   );
    //   if (index !== -1) {
    //     const removeIn = _.remove(revisionBysubBychapter[index].list, {
    //       id: evv,
    //     });
    //     dispatch(removeBookmark(removeIn));
    //   }
    // }
  };

  return (
    <>
      {revisionLoader ? (
        <RevisionSkeleton />
      ) : (
        <Grid container spacing={2}>
          {_.map(revisionBysubBychapter, (item) => {
            return _.map(item?.list, (ev, In) => {
              return (
                <Grid item xs={10} md={6} lg={4} key={In}>
                  <RevisionQuestionCard
                    item={item}
                    list={ev}
                    itemIn={{ category, subjectId, chapterId, In }}
                    isBookMarkRemove={isBookMarkRemove}
                  />
                </Grid>
              );
            });
          })}
        </Grid>
      )}
    </>
  );
}

const StyledRoot = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
  width: "fit-content",
  marginBottom: "20px",
}));
const ToogleButtonsCustom = ({ Invalue, handleChange, Items }) => {
  return (
    <ToggleButtonGroup
      value={Invalue}
      exclusive
      onChange={handleChange}
      sx={{ border: 0 }}
    >
      {Items?.map((item, index) => (
        <ToggleButton
          key={index}
          value={item?.value}
          style={{ marginRight: "21px" }}
          onClick={handleChange}
          sx={{
            height: 29,
            borderRadius: "60px",
            bgcolor: "primary.lighter",
            color: "primary.main",
            fontWeight: "400",
          }}
        >
          <Typography sx={{ fontSize: "12.4px" }}>{item?.label}</Typography>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
