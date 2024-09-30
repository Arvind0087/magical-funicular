import React from "react";
import { Avatar, Box, Grid, Typography } from "@mui/material";
import SubjectsSkeleton from "components/Skeletons/SubjectsSkeleton/SubjectsSkeleton";
import _ from "lodash";
import { LazyLoadImage } from "react-lazy-load-image-component";

const SubjectBlockCustom = ({ data, selectsubject, handleEvent, loader }) => {
  return (
    <Grid container sx={{ mt: 2 }}>
      {loader ? (
        <SubjectsSkeleton />
      ) : (
        data?.map((item, index) => {
          return (
            <Grid
              item
              sx={{
                mr: 2,
                borderRadius: 1,
                cursor: "pointer",
                backgroundColor: index % 2 === 0 ? "#fef1eb" : "#e7f4ee",
                border: `2px solid ${
                  selectsubject?.id === item?.id
                    ? index % 2 === 0
                      ? "#F26B35"
                      : "#098A4E"
                    : "none"
                }`,
              }}
              onClick={() => handleEvent(item)}
            >
              <Box
                sx={{
                  textAlign: "center",
                  width: { xs: "150px", sm: "180px" },
                  height: "160px",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "70%",
                    // border: "1px solid black",
                    position: "absolute",
                    backgroundColor: index % 2 === 0 ? "#fde4d9" : "#d1eade",
                    top: "0",
                    left: "0",
                    borderRadius: "8px 8px 50% 50%",
                  }}
                ></Box>
                <Box
                  sx={{
                    textAlign: "center",
                    px: 2,
                    py: 2,
                  }}
                >
                  <Box
                    sx={{
                      // borderRadius: "50%",
                      width: "70px",
                      height: "80px",
                      display: "grid",
                      placeItems: "center",
                      margin: "auto",
                      // border: "1px solid #eaedee",
                    }}
                  >
                    <LazyLoadImage
                      alt={item.name}
                      effect="blur"
                      src={item.image}
                      width="100%"
                      height="100%"
                      style={{ objectFit: "contain" }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        mt: 4,
                        fontSize: "14px",
                        fontWeight: "600",
                        textAlign: "center",
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  width: "100%",
                  height: "46px",
                  borderRadius: "0px 0px 8px 8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxSizing: "border-box",
                  mt: 1,
                  marginX: "auto",
                  color: "#212B36",
                  backgroundImage: `linear-gradient(to right, ${
                    index % 2 === 0 ? "#F26B35" : "#098A4E"
                  }, ${index % 2 === 0 ? "#FEE140" : "#9ADD00"})`,
                }}
              >
                {item.isAllSubject === true ? (
                  <Typography
                    sx={{ fontSize: "18px", fontWeight: "600", color: "#fff" }}
                  >
                    Subjects-{item.subjectCount}
                  </Typography>
                ) : (
                  <Typography
                    sx={{ fontSize: "18px", fontWeight: "600", color: "#fff" }}
                  >
                    {item.chaptersCount} Chapters
                  </Typography>
                )}
              </Box>
            </Grid>
          );
        })
      )}
    </Grid>
  );
};

export default SubjectBlockCustom;
