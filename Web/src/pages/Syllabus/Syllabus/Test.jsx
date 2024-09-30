import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "routes/paths";
import AddIcon from "@mui/icons-material/Add";
import CustomComponentLoader from "../../../components/CustomComponentLoader";
import TrendingCarouselSection from "../../dashboard/Assignment/components/TrendingCompo";
import { getTestByUserIdAsync } from "../../../redux/async.api";

function Test({ handleChangeChapter, chapterId, subjectId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chaptersAsync } = useSelector((state) => state?.chapterAsy);
  const { studentById } = useSelector((state) => state?.student);
  const { id } = studentById;
  const { getTestByUserId, getTestByUserIdLoader } = useSelector(
    (state) => state?.test
  );

  // get tests by category
  useEffect(() => {
    if (subjectId && chapterId) {
      dispatch(
        getTestByUserIdAsync({
          userId: id,
          subjectId: subjectId,
          chapterId: chapterId,
        })
      );
    } else if (subjectId) {
      dispatch(
        getTestByUserIdAsync({
          userId: id,
          subjectId: subjectId,
        })
      );
    }
  }, [subjectId, chapterId]);

  const trendingTest = useMemo(() => {
    return getTestByUserId?.data?.filter(
      (item) => item?.category === "Trending Tests"
    );
  }, [getTestByUserId]);

  const testSeries = useMemo(() => {
    return getTestByUserId?.data?.filter(
      (item) => item?.category === "Test Series"
    );
  }, [getTestByUserId]);

  const mockTests = useMemo(() => {
    return getTestByUserId?.data?.filter(
      (item) => item?.category === "Mock Tests"
    );
  }, [getTestByUserId]);

  const handleNavcreateTest = () => {
    navigate(PATH_DASHBOARD.createTest);
  };

  return (
    <>
      <Box sx={{ maxWidth: 227 }}>
        {chaptersAsync?.length > 0 ? (
          <FormControl size="small" sx={{ width: 300 }}>
            <InputLabel id="demo-simple-select-label">Chapter</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Chapter"
              onChange={handleChangeChapter}
            >
              {chaptersAsync.map((item) => (
                <MenuItem value={item.id}>{item.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : null}
      </Box>
      <Box sx={{ mt: 7 }}>
        <Typography variant="h4">Create Your Own Test</Typography>
        <Typography>
          Customize your tests for any chapter or topic and strengthen your
          improvement areas{" "}
        </Typography>
        <Grid container sx={{ mt: -1 }}>
          <Grid item md={4} xs={12}>
            <Card
              sx={{
                backgroundColor: "primary.main",
                width: "100%",
                height: "auto",
                overflow: "hidden",
                cursor: "pointer",
                p: "20px 10px",
                mt: "30px",
                display: "flex",
                flexDirection: "column",
              }}
              onClick={handleNavcreateTest}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "50%",
                    backgroundColor: "#ffff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mr: 2,
                  }}
                >
                  <AddIcon sx={{ color: "primary.main", fontSize: "30px" }} />
                </Box>
                <Typography
                  variant="p"
                  style={{ fontSize: "18px", fontWeight: 500, color: "#ffff" }}
                >
                  Create New Test
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {trendingTest?.length > 0 ? (
        <Box sx={{ mt: 7 }}>
          <Typography variant="h4">Trending Tests</Typography>
          {getTestByUserIdLoader ? (
            <>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  color: "primary.main",
                  mt: 4,
                }}
              >
                <CustomComponentLoader padding="0" size={50} />
              </Box>
            </>
          ) : (
            <>
              <Typography>
                Explore for tests attempted by the students of your class.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <TrendingCarouselSection getTests={trendingTest} />
              </Box>
            </>
          )}
        </Box>
      ) : null}

      {testSeries?.length > 0 ? (
        <Box sx={{ mt: 7 }}>
          <Typography variant="h4">Test Series</Typography>
          {getTestByUserIdLoader ? (
            <>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  color: "primary.main",
                  mt: 4,
                }}
              >
                <CustomComponentLoader padding="0" size={50} />
              </Box>
            </>
          ) : (
            <>
              <Typography>
                Test that helps you to decide on further study plan.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <TrendingCarouselSection getTests={testSeries} />
              </Box>
            </>
          )}
        </Box>
      ) : null}

      {mockTests?.length > 0 ? (
        <Box sx={{ mt: 7 }}>
          <Typography variant="h4">Mock Test</Typography>
          {getTestByUserIdLoader ? (
            <>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  color: "primary.main",
                  mt: 4,
                }}
              >
                <CustomComponentLoader padding="0" size={50} />
              </Box>
            </>
          ) : (
            <>
              <Typography>
                Explore the test based on latest exam patterns.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <TrendingCarouselSection getTests={mockTests} />
              </Box>
            </>
          )}
        </Box>
      ) : null}
    </>
  );
}

export default Test;
