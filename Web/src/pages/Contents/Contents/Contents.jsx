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

export default function Syllabus() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { getSubjectContentLoader, getSubjectContent } = useSelector(
    (state) => state?.syllabusAsy
  );

  const subjectInfo = location?.state?.subjectInfo;

  useEffect(() => {
    const payload = {
      subjectId: subjectInfo?.id,
    };
    dispatch(userChapterBySubjectIdAsync(payload));
  }, []);

  const backHandler = () => {
    navigate(-1);
  };

  const chapterHandler = (val) => {
    if (
      getSubjectContent?.length > 2 &&
      getSubjectContent[2]?.id == val?.id &&
      val?.lockStatus == true
    ) {
      navigate(`${PATH_DASHBOARD.chapters}/${val.id}`, {
        state: {
          val,
          subjectId: subjectInfo?.id,
          courseStatus: "notpaid",
        },
      });
    } else {
      navigate(`${PATH_DASHBOARD.chapters}/${val.id}`, {
        state: {
          val,
          subjectId: subjectInfo?.id,
          courseStatus: "",
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
          // background: "linear-gradient(to right, #098A4E, #9ADD00)",
          // zIndex: 12344,
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
            {subjectInfo?.name}
          </Typography>
        </Box>
      </Box>
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="h5">Chapters</Typography>
        </Box>
        <Grid container spacing={2}>
          {getSubjectContent?.map((item, index) => {
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
                        background:
                          "linear-gradient(to right, #F26B35, #FEE140)",
                        borderRadius: "5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "26px",
                          color: "#fff",
                          fontWeight: "600",
                        }}
                      >
                        {index + 1}
                      </Typography>
                    </Box>{" "}
                    <Typography sx={{ fontSize: "20px" }}>
                      {item?.name}
                    </Typography>
                  </Box>
                  {item?.lockStatus == true ? (
                    getSubjectContent?.length > 2 &&
                    getSubjectContent[2]?.id == item?.id ? (
                      <img
                        src={lockimage}
                        alt="lock icon"
                        style={{ cursor: "pointer" }}
                        onClick={() => chapterHandler(item)}
                      />
                    ) : (
                      <img src={lockimage} alt="lock icon" />
                    )
                  ) : (
                    <ArrowForwardIosIcon
                      sx={{ color: "#f58937", cursor: "pointer" }}
                      onClick={() => chapterHandler(item)}
                    />
                  )}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </>
  );
}
