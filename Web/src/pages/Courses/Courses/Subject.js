import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import Typography from "@mui/material/Typography";
import { getSubjectsByStudentAsync } from "../../../redux/async.api";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

function Subject() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { subjectBy } = useSelector((state) => state?.subject);
  const { studentById = {} } = useSelector((state) => state?.student);

  useEffect(() => {
    if (studentById?.courseId) {
      dispatch(
        getSubjectsByStudentAsync({
          courseId: studentById.courseId,
          boardId: studentById.boardId,
          classId: studentById.classId,
          batchTypeId: studentById.batchTypeId,
        })
      );
    }
  }, [
    dispatch,
    studentById.batchTypeId,
    studentById.boardId,
    studentById.classId,
    studentById.courseId,
  ]);

 const handleSyllabusClick = (item) => {
    if (studentById?.courseId == 7 || studentById?.courseId == 8) {
      navigate("/app/chapters", {
        state: {
          subjectInfo: item,
        },
      });
    } else {
      navigate("/app/syllabus", {
        state: {
          subjectInfo: item,
        },
      });
    }
  };

  return (
    <Container>
      <Grid container spacing={3} marginTop="20px">
        <Grid item xs={12}>
          <Typography component="div" fontWeight="700" variant="h4">
            Subjects
          </Typography>
        </Grid>
        <Grid item container mt={1} spacing={0}>
          {subjectBy && subjectBy.length > 0 ? (
            subjectBy.map((item, index) => (
              <Grid
                item
                sx={{
                  mr: 4,
                  position: "relative",
                  width: "180px",
                  height: "205px",
                  backgroundColor: index % 2 === 0 ? "#fef1eb" : "#e7f4ee",
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
                onClick={() => handleSyllabusClick(item)}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "45%",
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
                      fontSize: "14px",
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
            ))
          ) : (
            <Typography>No Data Found</Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Subject;
