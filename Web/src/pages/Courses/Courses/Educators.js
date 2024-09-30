import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { getEducatorsAsync } from "redux/syllabus/syllabus.async";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import arrow from "../../../assets/images/arrow.png";
import DialogMui from "../../../components/Modal/DialogMui";
import { toast } from "react-hot-toast";

function Subject({ packageId }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { subjectBy } = useSelector((state) => state?.subject);
  const { studentById = {} } = useSelector((state) => state?.student);
  const { educatorLoader, educatorData } = useSelector(
    (state) => state?.syllabusAsy
  );
  const [open, setOpen] = useState(false);
  const [vidUrl, setVidUrl] = useState("");

  useEffect(() => {
    const payload = {
      packageId: packageId,
    };
    dispatch(getEducatorsAsync(payload));
  }, [dispatch]);

  const demoHandler = (educatorInfo) => {
    if (
      educatorInfo?.original_intro_video == "" ||
      educatorInfo?.original_intro_video == null
    ) {
      setOpen(false);
      toast.error("No demo scheduled yet");
    } else {
      setOpen(true);
      setVidUrl(educatorInfo?.original_intro_video);
    }
  };

  return (
    <Container>
      {educatorLoader ? (
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
      ) : educatorData?.length > 0 ? (
        <Box sx={{ mt: 10 }}>
          {educatorData?.map((educator) => {
            return (
              <Grid item container mt={4} spacing={1}>
                <Grid xs={12} sm={3} sx={{ width: "100%" }}>
                  <Box sx={{ display: "flex" }}>
                    <Box
                      sx={{
                        width: { xs: "100%", sm: "100%" },
                        mb: { xs: 4, sm: 8 },
                        mr: { xs: 0, sm: 2 },
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-end",
                          width: "100%",
                          height: "240px",
                          borderRadius: "6px",
                          background:
                            "linear-gradient(to bottom, rgba(4, 34, 45, 1), rgba(4, 34, 45, 0.5))",
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            height: "70px",
                            backgroundColor: "#0B2933",
                            borderRadius: "6px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#fff",
                              textAlign: "center",
                              fontSize: "18px",
                              mb: "5px",
                            }}
                          >
                            {educator?.name}
                          </Typography>
                          {/*<Typography
                            sx={{
                              color: "#fff",
                              textAlign: "center",
                              fontSize: "12px",
                            }}
                          >
                            Mental Ability
                          </Typography> */}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          position: "absolute",
                          top: "-60px",
                          left: { xs: "65px", sm: "15px" },
                        }}
                      >
                        <img
                          src={educator?.avatar}
                          alt="teacher image"
                          width="180px"
                          height="230px"
                        />
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid xs={12} sm={8}>
                  <Box
                    sx={{
                      width: { xs: "100%", sm: "100%" },
                      height: { xs: "auto", sm: "240px" },
                      backgroundColor: "#FEF4D8",
                      borderRadius: "6px",
                      p: 2,
                      display: "flex",
                      mb: { xs: 5, sm: 0 },
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      {JSON.parse(educator?.teacherInfo)?.map((item) => (
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <img src={arrow} alt="" width="15px" height="15px" />
                          <Typography
                            sx={{
                              fontSize: "14px",
                              lineHeight: "24px",
                              color: "#67696C",
                              lineHeight: "30px",
                            }}
                          >
                            {item}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        mt: { xs: 1, sm: 0 },
                      }}
                    >
                      <Button
                        sx={{
                          backgroundColor: "#F26B35",
                          color: "#fff",
                          padding: "5px 20px",
                          fontSize: "14px",

                          "&:hover": {
                            backgroundColor: "#f79c3a",
                          },
                        }}
                        onClick={() => demoHandler(educator)}
                      >
                        Play Demo
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            );
          })}
          {open && vidUrl && (
            <DialogMui
              open={open}
              setOpen={setOpen}
              urlVid={vidUrl}
              videoProvider="youtube"
            />
          )}
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            mt: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
            No Educator Found!
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default Subject;
