import React, { useMemo, useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import {
  getSubjectsByStudentAsync,
  createQuizAsync,
  getUserLeaderBoardAsync,
} from "redux/async.api";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShareWith from "components/shareWith/ShareWith";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import India from "../../../../src/assets/images/india.svg";
import State from "../../../../src/assets/images/state.svg";
import City from "../../../../src/assets/images/city.svg";
import School from "../../../../src/assets/images/school.svg";
import Skill from "../../../../src/assets/images/Skill.svg";
import { useSettingsContext } from "../../../components/settings";
import CustomComponentLoader from "../../../components/CustomComponentLoader";
import { CustomAvatar } from "components/custom-avatar";
import { toastoptions } from "../../../utils/toastoptions";
import { PATH_DASHBOARD } from "routes/paths";
import { status } from "nprogress";
import { Helmet } from "react-helmet-async";

const Quiz = () => {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState({ status: false, id: 0 });
  const [isTrueSubjectId, setIsTrueSubjectId] = useState("");
  const [openShareDialog, setShareOpenDialog] = useState(false);

  const { subjectLoader, subjectBy = [] } = useSelector(
    (state) => state?.subject
  );
  const { createQuizLoader, createQuizResponse } = useSelector(
    (state) => state?.test
  );
  const { studentById = [] } = useSelector((state) => state?.student);
  const { id, avatar, name, coins, games } = studentById;
  const { userLeaderBoard = {}, getUserLeaderBoardLoader } = useSelector(
    (state) => state?.userLeaderBoard
  );
  const { getOnlySiteSettingLoader, getOnlySiteSettingData = [] } = useSelector(
    (state) => state.getOnlySiteSetting
  );
  const { siteLogo, siteAuthorName, siteTitle } = getOnlySiteSettingData;
  const handleClickOpen = () => {
    setShareOpenDialog(true);
  };

  useEffect(() => {
    // GET SUBJECTS
    if (studentById?.courseId) {
      dispatch(
        getSubjectsByStudentAsync({
          courseId: studentById?.courseId,
          boardId: studentById?.boardId,
          classId: studentById?.classId,
          batchTypeId: studentById?.batchTypeId,
        })
      ).then((res) => {
        const { payload } = res || {};
        const { status, data } = payload || {};
        if (status === 200) {
          data?.map((e) => {
            if (e.isAllSubject) {
              setIsTrueSubjectId(e?.id);
            }
          });
        }
      });
    }
  }, [dispatch, studentById]);

  useEffect(() => {
    dispatch(getUserLeaderBoardAsync());
  }, []);

  const handleQuiz = (subjectId) => {
    setIsTrueSubjectId(subjectId);
    setLoading({ status: true, id: subjectId });
    dispatch(
      createQuizAsync({
        subjectId: subjectId,
        studentId: id,
      })
    ).then((res) => {
      const { payload } = res || {};
      const { status, data, message } = payload || {};
      if (status === 200) {
        toast.success(message, toastoptions);
        navigate(`${PATH_DASHBOARD.instruction(data?.id)}?type=quiz_test`);
        setLoading({ status: false, id: subjectId });
      }
    });
  };
  const newSubjectBy = useMemo(() => {
    return subjectBy?.filter((item) => !item.isAllSubject);
  }, [subjectBy]);
  return (
    <>
      <Helmet>
        <title>Quiz | {`${siteTitle}`}</title>
      </Helmet>
      <Container
        maxWidth={themeStretch ? false : "xl"}
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h3"
          component="h2"
          sx={{ textAlign: "center", mb: 2 }}
        >
          Quiz
        </Typography>
        <Grid container spacing={2}>
          <Grid
            item
            md={4}
            sm={6}
            xs={12}
            display="flex"
            justifyContent="center"
          >
            <Card
              sx={{
                p: "15px",
                backgroundColor: "primary.main",
                maxWidth: "400px",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} display="flex" justifyContent="center">
                  <Box
                    sx={{
                      width: "60px",
                      height: "60px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "white",
                      borderRadius: "50%",
                    }}
                  >
                    {/* <img src="https://cdn.landesa.org/wp-content/uploads/default-user-image.png" width="44px" alt={' '} style={{ borderRadius: '50%',border:"1px solid red" }} /> */}
                    <CustomAvatar
                      src={avatar}
                      alt={name}
                      name={name}
                      sx={{
                        mx: "auto",
                        color: "white",
                        borderWidth: 2,
                        borderStyle: "solid",
                        borderColor: "common.white",
                        width: "100%",
                        height: "100%",
                        zindex: 1,
                      }}
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                >
                  <Typography sx={{ color: "white", fontWeight: "600", mb: 1 }}>
                    {name}
                  </Typography>
                  <Box sx={{ display: "flex" }}>
                    <Box sx={{ display: "flex" }}>
                      <AttachMoneyIcon
                        sx={{ fontSize: "18px", color: "white" }}
                      />{" "}
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        {coins} coins
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", ml: 1.5 }}>
                      <VideogameAssetIcon
                        sx={{ fontSize: "18px", color: "white" }}
                      />
                      &nbsp;&nbsp;{" "}
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        {games} Games
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid
            item
            md={4}
            sm={6}
            xs={12}
            display="flex"
            justifyContent="center"
          >
            <Card sx={{ p: "15px", maxWidth: "400px" }}>
              <Typography
                sx={{
                  fontWeight: "700",
                  fontSize: { md: "18px", xs: "16px" },
                  mb: 0.5,
                }}
              >
                Leader board Rank
              </Typography>
              <Divider sx={{ borderBottomWidth: 2.5 }} />
              <Grid container spacing={2} sx={{ mt: 0.3 }}>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", my: 1.5 }}>
                    <img src={India} alt="" />
                    <Typography
                      sx={{
                        ml: 0.5,
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#787A8D",
                      }}
                    >
                      India
                    </Typography>
                    <Typography
                      sx={{ ml: 0.5, fontSize: "14px", color: "#787A8D" }}
                    >
                      {userLeaderBoard?.country}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", my: 1.5 }}>
                    <img src={State} alt="" />
                    <Typography
                      sx={{
                        ml: 0.5,
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#787A8D",
                      }}
                    >
                      State
                    </Typography>
                    <Typography
                      sx={{ ml: 0.5, fontSize: "14px", color: "#787A8D" }}
                    >
                      {userLeaderBoard?.state}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex" }}>
                    <img src={City} alt="" />
                    <Typography
                      sx={{
                        ml: 0.5,
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#787A8D",
                      }}
                    >
                      City
                    </Typography>
                    <Typography
                      sx={{ ml: 0.5, fontSize: "14px", color: "#787A8D" }}
                    >
                      {userLeaderBoard?.city}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex" }}>
                    <img src={School} alt="" />
                    <Typography
                      sx={{
                        ml: 0.5,
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#787A8D",
                      }}
                    >
                      School
                    </Typography>
                    <Typography
                      sx={{ ml: 0.5, fontSize: "14px", color: "#787A8D" }}
                    >
                      {userLeaderBoard?.school}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} display="flex" justifyContent="center">
            <Card sx={{ p: "15px", maxWidth: "400px" }}>
              <Typography
                sx={{
                  fontWeight: "700",
                  fontSize: { md: "18px", xs: "16px" },
                  mb: 0.5,
                }}
              >
                Play With a friend
              </Typography>
              <Divider sx={{ borderBottomWidth: 2.5 }} />
              <Grid container sx={{ mt: 1.5 }}>
                <Grid item xs={3}>
                  <img src={Skill} alt="" />
                </Grid>
                <Grid item xs={9} alignSelf="center">
                  <Typography sx={{ fontSize: "12px", color: "#787A8D" }}>
                    Challenge your friends to a quiz game
                  </Typography>
                </Grid>
              </Grid>
              <Box textAlign="end">
                <Button
                  variant="contained"
                  sx={{
                    color: "#fff",
                    borderRadius: "60px",
                    p: 0,
                    minWidth: "110px",
                    height: "45px",
                    mt: 1,
                  }}
                  onClick={handleClickOpen}
                >
                  Add Friend
                </Button>
              </Box>
            </Card>
          </Grid>

          <Grid
            item
            xs={12}
            md={12}
            sx={{ mt: 4, paddingInline: "20px" }}
            alignSelf={"center"}
            display="flex"
            justifyContent="center"
          >
            <Card
              sx={{
                p: "15px",
                minWidth: "100%",
                maxWidth: "100%",
                [theme.breakpoints.down("sm")]: {
                  minWidth: "100%",
                },
              }}
            >
              {subjectLoader ? (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    color: "primary.main",
                  }}
                >
                  <CustomComponentLoader padding="0" size={50} />
                </Box>
              ) : (
                <>
                  <Typography
                    sx={{
                      fontWeight: "700",
                      fontSize: { md: "18px", xs: "16px" },
                      mb: 0.5,
                    }}
                  >
                    Select topic to play
                  </Typography>
                  <Divider sx={{ borderBottomWidth: 2.5 }} />
                  <Grid container sx={{ mt: 2, display: "flex" }}>
                    {newSubjectBy.length > 0 ? (
                      newSubjectBy?.map((item, index) => {
                        return (
                          <Grid
                            item
                            sx={{
                              mr: 4,
                              position: "relative",
                              width: "180px",
                              height: "205px",
                              backgroundColor:
                                index % 2 === 0 ? "#fef1eb" : "#e7f4ee",
                              borderRadius: 1,
                              cursor: "pointer",
                              border: `2px solid ${
                                subjectBy?.id === item?.id
                                  ? index % 2 === 0
                                    ? "#F26B35"
                                    : "#098A4E"
                                  : "none"
                              }`,
                            }}
                            key={index}
                            onClick={() => handleQuiz(item?.id)}
                          >
                            <Box
                              sx={{
                                width: "100%",
                                height: "45%",
                                // border: "1px solid black",
                                position: "absolute",
                                backgroundColor:
                                  index % 2 === 0 ? "#fde4d9" : "#d1eade",
                                top: "0",
                                left: "0",
                                borderRadius: "8px 8px 50% 50%",
                              }}
                            ></Box>
                            <Box
                              sx={{
                                textAlign: "center",
                                cursor: "pointer",
                                paddingTop: "12px",
                              }}
                            >
                              <Box
                                sx={{
                                  // borderRadius: "50%",
                                  width: "60px",
                                  height: "70px",
                                  display: "grid",
                                  placeItems: "center",
                                  margin: "auto",
                                }}
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  width="100%"
                                  style={{ zIndex: "44" }}
                                />
                              </Box>

                              <Typography
                                sx={{
                                  mt: 3,
                                  mb: 0,
                                  fontSize: "18px",
                                  fontWeight: "600",
                                  textAlign: "center",
                                }}
                              >
                                {item.name}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                width: "100%",
                                height: "50px",
                                borderRadius: "0px 0px 8px 8px",
                                display: "flex",
                                position: "absolute",
                                bottom: "0px",
                                alignItems: "center",
                                justifyContent: "center",
                                boxSizing: "border-box",
                                mt: 1,
                                color: "#212B36",
                                backgroundImage: `linear-gradient(to right, ${
                                  index % 2 === 0 ? "#F26B35" : "#098A4E"
                                }, ${index % 2 === 0 ? "#FEE140" : "#9ADD00"})`,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "18px",
                                  fontWeight: "600",
                                  color: "#fff",
                                }}
                              >
                                {item.isAllSubject === true
                                  ? item.subjectCount
                                  : item.chaptersCount}{" "}
                                Chapters
                              </Typography>
                            </Box>
                          </Grid>
                        );
                      })
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          textAlign: "center",
                          marginTop: "80px",
                        }}
                      >
                        <Typography variant="h5">No Data Found</Typography>
                      </Box>
                    )}
                  </Grid>
                </>
              )}
            </Card>
          </Grid>
        </Grid>
        <ShareWith
          {...{
            setShareOpenDialog,
            openShareDialog,
          }}
        />
      </Container>
    </>
  );
};

export default Quiz;
