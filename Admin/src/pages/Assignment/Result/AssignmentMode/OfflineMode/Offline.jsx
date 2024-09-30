import { React, useState, useEffect } from "react";
import {
  Grid,
  Card,
  Stack,
  Typography,
  Paper,
  Box,
  Button,
  Container
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { PATH_DASHBOARD } from "routes/paths";
import { useSettingsContext } from "components/settings";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAssignmentReportByIdAsync } from "redux/slices/assignment/assignmentAsync";

export default function Offline() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const location = useLocation();
  const [assignmentdata, setAssignmentdata] = useState(location.state.id);
  const dispatch = useDispatch();
  const query = new URLSearchParams(location.search);

  const { assignmentLoader, AssignmentResult, getAssignmentReportById } =
    useSelector((state) => state.assignment);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  useEffect(() => {
    if (id) {
      const payload = {
        assignmentId: assignmentdata?.assignmentId,
        studentId: assignmentdata?.studentId,
        studentStartId: id,
      };
      dispatch(getAssignmentReportByIdAsync(payload));
    }
  }, [id]);
  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title> Assignment Result | {`${tabTitle}`}</title>
      </Helmet>
      <Card sx={{ p: 3 }}>
        <CustomBreadcrumbs
          // heading={"Assignment Result"}
          links={[
            { name: "Assignment" },
            { name: "Assignment", href: PATH_DASHBOARD.assignmentresult },
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Stack spacing={1.5} sx={{ px: 3, padding: "0px !important" }}>
              <Stack
                direction="row"
                spacing={2}
                sx={{ paddingBottom: "0px !important" }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    flexGrow: 1,
                    bgcolor: "background.neutral",

                    marginBottom: "10px !important"
                  }}
                >
                  <Box
                    sx={{
                      marginBottom: "10px !important",
                      marginRight: "10px !important"
                    }}
                  >
                    <Box>
                      <Typography variant="h6">
                        Test Method :&nbsp;
                        <span style={{ fontWeight: 400 }}>
                          {getAssignmentReportById?.data?.testMethod}
                        </span>{" "}
                      </Typography>
                    </Box>
                  </Box>
                  <Stack
                    justifyContent="space-between"
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ sm: "center" }}
                    sx={{ mb: 0.5 }}
                  >
                    <Typography variant="subtitle2">
                      Student Name:&nbsp;
                      <span style={{ fontWeight: 400 }}>
                        {getAssignmentReportById?.data?.studentName}
                      </span>
                    </Typography>
                    <Typography variant="subtitle2" sx={{ marginLeft: "-60px" }}>
                      Assignment Name :&nbsp;
                      <span style={{ fontWeight: 400 }}>
                        Mock Assignment
                        {getAssignmentReportById?.data?.name}
                      </span>
                    </Typography>
                  </Stack>

                  <Stack
                    justifyContent="space-between"
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ sm: "center" }}
                    sx={{ mb: 0.5 }}
                  >
                    <Typography variant="subtitle2">
                      Time :&nbsp;
                      <span style={{ fontWeight: 400 }}>
                        {getAssignmentReportById?.data?.time}
                      </span>
                    </Typography>
                  </Stack>
                  <Box sx={{ display: "flex", justifyContent: "end", mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() =>
                        window.open(
                          getAssignmentReportById.data.questionFile,
                          "_blank",
                          "noreferrer"
                        )
                      }
                    >
                      Download Question
                    </Button>
                    &nbsp;&nbsp;
                    <Button
                      variant="contained"
                      onClick={() =>
                        window.open(
                          getAssignmentReportById.data.answerFileByStudent,
                          "_blank",
                          "noreferrer"
                        )
                      }
                    >
                      Download Answer By Student
                    </Button>
                    &nbsp;&nbsp;
                    <Button
                      variant="contained"
                      onClick={() =>
                        window.open(
                          getAssignmentReportById.data.answerFileByTeacher,
                          "_blank",
                          "noreferrer"
                        )
                      }
                    >
                      Download Answer By Teacher
                    </Button>
                  </Box>
                </Paper>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}
