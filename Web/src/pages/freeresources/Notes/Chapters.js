import { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { useSettingsContext } from "components/settings";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { PATH_DASHBOARD } from "routes/paths";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { userChapterBySubjectIdAsync } from "redux/syllabus/syllabus.async";
import lockimage from "../../../assets/images/lockimage.png";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import NoVideo from "../../../assets/images/NoVideos.svg";

export default function Chapters() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { getSubjectContentLoader, getSubjectContent } = useSelector(
    (state) => state?.syllabusAsy
  );

  const subjectBy = location?.state?.subjectBy;

  useEffect(() => {
    const payload = {
      subjectId: subjectBy?.id,
    };
    dispatch(userChapterBySubjectIdAsync(payload));
  }, []);

  const backHandler = () => {
    navigate(-1);
  };

  const chapterHandler = (note) => {
    if (note) {
      navigate(`${PATH_DASHBOARD.notesChapter}/${note?.id}`, {
        state: {
          note,
        },
      });
    }
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          backgroundColor: "#fff",
          width: "103%",
          height: "50px",
          marginLeft: "-15px",
          mt: 2,
        }}
      >
        <Box
          sx={{
            ml: 5,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ArrowBackIcon
            sx={{ color: "#000", cursor: "pointer" }}
            onClick={backHandler}
          />
          <Typography sx={{ color: "#000", fontSize: "18px" }}>
            {subjectBy?.name}
          </Typography>
        </Box>
      </Box>
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Box sx={{ mt: 0, mb: 2 }}>
          <Typography variant="h5">Chapters</Typography>
        </Box>
        <Grid container spacing={2}>
          {getSubjectContentLoader ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 8,
                width: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : getSubjectContent?.length > 0 ? (
            getSubjectContent?.map((item, index) => {
              return (
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      backgroundColor: "#F9F9F9",
                      borderRadius: "10px",
                      width: "100%",
                      height: "60px",
                      padding: "10px 15px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Box
                        sx={{
                          width: "45px",
                          height: "45px",
                          borderRadius: "5px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={subjectBy?.image}
                          alt="chapters"
                          width="35px"
                        />
                      </Box>
                      <Typography sx={{ fontSize: "20px" }}>
                        {item?.name}
                      </Typography>
                    </Box>

                    <ArrowForwardIosIcon
                      sx={{ color: "#000", cursor: "pointer" }}
                      onClick={() => chapterHandler(item)}
                    />
                  </Box>
                </Grid>
              );
            })
          ) : (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img src={NoVideo} alt="" width="250px" />
                <Typography sx={{ fontWeight: 600, mt: 1 }}>
                  No data Found!
                </Typography>
              </Box>
            </Box>
          )}
        </Grid>
      </Container>
    </>
  );
}
