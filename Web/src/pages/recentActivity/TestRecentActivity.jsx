import React, { useEffect } from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { getActivityOfUserAsync } from "redux/async.api";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "routes/paths";
import CustomComponentLoader from "components/CustomComponentLoader";
import moment from "moment";
const TestRecentActivity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getActivityOfUserLoader, activityOfUser = [] } = useSelector(
    (state) => state?.activity
  );
  const { studentById = [] } = useSelector((state) => state?.student);
  const { id } = studentById;
  // const bookmark = true
  useEffect(() => {
    dispatch(
      getActivityOfUserAsync({
        type: "test",
      })
    );
  }, []);
  const handleNavigate = (id, category) => {
    const testType = ["Test Series", "Own Tests", "Mock Tests"];
    const name = testType.includes(category) ? "my_test" : "";
    navigate(`${PATH_DASHBOARD.instruction(id)}?type=${name}`);
  };
  const GoToReportPage = (TestId) => {
    navigate(PATH_DASHBOARD.reportSummary, {
      state: {
        userId: studentById?.id,
        testId: TestId,
        type: "my_test",
      },
    });
  };
  const goToPage = (id) => {
    navigate(`${PATH_DASHBOARD.instruction(id)}?type=my_test`);
  };

  console.log(
    "getActivityOfUserLoader.....",
    getActivityOfUserLoader,
    activityOfUser
  );

  return (
    <>
      {getActivityOfUserLoader ? (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            color: "primary.main",
            mt: 20,
          }}
        >
          <CustomComponentLoader padding="0" size={50} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {activityOfUser?.length > 0 ? (
            <>
              {activityOfUser?.map((item) => {
                return (
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ p: 3 }} key={item?.id}>
                      <Card
                        sx={{
                          height: "200px",
                          width: "300px",
                          overflow: "hidden",
                          p: 2,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: "700",
                              pb: 1,
                            }}
                          >
                            {item?.title}
                          </Typography>
                          <Divider />
                          <Box
                            sx={{
                              display: "flex",
                              textAlign: "center",
                              justifyContent: "space-between",
                              mt: 1,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "15px",
                              }}
                            >
                              Questions: {item?.questionCount}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "15px",
                              }}
                            >
                              Time:{" "}
                              {moment.duration(item?.testTime).asMinutes() +
                                " mins"}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              textAlign: "center",
                              justifyContent: "space-between",
                              mt: 1,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "15px",
                              }}
                            >
                              Max Marks: {item?.marks}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "15px",
                                color: "primary.main",
                              }}
                            >
                              Previous Score: {item.score}
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Button
                            variant="contained"
                            sx={{ color: "#fff", borderRadius: "60px" }}
                            onClick={() => goToPage(item?.id)}
                          >
                            Re-attempt
                          </Button>
                          <Box
                            sx={{ cursor: "pointer" }}
                            onClick={() => GoToReportPage(item?.id)}
                          >
                            <Typography variant="p" sx={{ color: "blue" }}>
                              View Analysis
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    </Box>
                  </Grid>
                );
              })}
            </>
          ) : (
            <Box
              sx={{
                width: "100%",
                textAlign: "center",
                marginTop: "80px",
                mt: 20,
              }}
            >
              <Typography variant="h5">No Data Found</Typography>
            </Box>
          )}
        </Grid>
      )}
    </>
  );
};
export default TestRecentActivity;
