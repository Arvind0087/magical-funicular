import { useState, useEffect, useTransition } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircularProgress from "@mui/material/CircularProgress";
import { Helmet } from "react-helmet-async";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { userAllPyqsAsync } from "redux/freeResource/freeResource.async";
import { PATH_DASHBOARD } from "routes/paths";
import arrowImg from "../../../assets/images/dashboard/arrow.png";
import NoVideo from "../../../assets/images/NoVideos.svg";

export default function Pyqs() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { getOnlySiteSettingData = [] } = useSelector(
    (state) => state.getOnlySiteSetting
  );
  const { siteTitle } = getOnlySiteSettingData;

  const { freePyqsLoader, freePyqs } = useSelector(
    (state) => state.freeResource
  );

  useEffect(() => {
    dispatch(userAllPyqsAsync({}));
  }, []);

  const backHandler = () => {
    navigate(-1);
  };

  const displayPyqs = (item) => {
    if (item) {
      navigate(`${PATH_DASHBOARD.pyqs}/${item.id}`, {
        state: {
          item,
        },
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>PYQS | {`${siteTitle}`}</title>
      </Helmet>
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
            Previous Year Question Papers
          </Typography>
        </Box>
      </Box>

      <Container>
        {freePyqsLoader ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 4,
              width: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : freePyqs?.length > 0 ? (
          <Box sx={{ pt: 4, position: "relative" }}>
            <Grid container spacing={3}>
              {freePyqs?.map((item, index) => {
                return (
                  <Grid item xs={6} sm={4} key={`${index}pq`}>
                    <Box
                      sx={{
                        width: "100%",
                        height: "auto",
                        background:
                          "linear-gradient(to right, #098A4E, #9ADD00)",
                        borderRadius: "15px",
                        padding: "15px",
                      }}
                    >
                      <Box
                        sx={{
                          height: { xs: "60px" },
                          width: "100%",
                          backgroundColor: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "15px 15px 0px 0px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#179246",
                          }}
                        >
                          {item?.year}
                        </Typography>
                      </Box>

                      <Box sx={{ width: "100%" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontWeight: "600",
                              color: "#fff",
                              mt: 2,
                              mb: 1,
                            }}
                          >
                            {item?.title} {item?.number}
                          </Typography>
                          <Box onClick={() => displayPyqs(item)}>
                            <LazyLoadImage
                              alt={item?.package_title}
                              effect="blur"
                              src={arrowImg}
                              width="40px"
                              objectFit="contain"
                              style={{ cursor: "pointer" }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
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
                No PYQs Found!
              </Typography>
            </Box>
          </Box>
        )}
      </Container>
    </>
  );
}
