import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  Box,
  CardContent,
  Typography,
  Stack,
  Button,
  FormControl,
  TextField,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import EastIcon from "@mui/icons-material/East";
import CircularProgress from "@mui/material/CircularProgress";
import { registrationDashboardAsync } from "redux/dashboard/dashboard.async";
import excelDownload from "../../assets/excel/ExcelDownload.png";
import AnalayticRegister from "./AnalayticRegister";
import LineChartRegister from "./LineChartRegister";
import {
  addDaysToDate,
  generateDateFromTo,
  get30DateFromTodate,
} from "utils/generateDateFromTo";
import { Theme, useTheme, makeStyles } from "@mui/material/styles";
import { packageSellsExcelReportAsync } from "redux/downloadexcel/excel.async";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import searchImage from "../../assets/images/search.png";
import RegisterDialog from "./RegisterDialog";

function RegistrationDashboard() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [date30, setdate30] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tabs, setTabs] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [courseInfo, setCourseInfo] = useState([]);
  const { registerData, registerLoader } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    const payload = {
      fromDate: "",
      toDate: "",
    };
    dispatch(registrationDashboardAsync(payload));
  }, []);

  const handleChangefromDate = (e) => {
    setStartDate(e.target.value);
  };

  const handleChangeToDate = (e) => {
    setEndDate(e.target.value);
  };

  const handleSearch = () => {
    const payload = {
      fromDate: startDate,
      toDate: endDate,
    };
    dispatch(registrationDashboardAsync(payload));
  };

  const tabHandler = (val) => {
    setTabs(val);
    const payload = {
      fromDate: startDate || "",
      toDate: endDate || "",
    };
    dispatch(registrationDashboardAsync(payload));
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const packageHandler = (pack) => {
    setCourseInfo(pack);
    setOpenDialog(true);
  };

  const resetFilter = () => {
    setTabs("all");
    setStartDate("");
    setEndDate("");
    const payload = {
      fromDate: "",
      toDate: "",
    };
    dispatch(registrationDashboardAsync(payload));
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "flex-start", md: "flex-end" },
          flexWrap: "wrap",
          mb: 2,
          mt: { xs: 2, sm: 2, md: -9, lg: -9 },
        }}
      >
        <Typography
          sx={{
            marginRight: "10px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          From:
        </Typography>

        <FormControl>
          <TextField
            size="small"
            sx={{
              mr: 2,
              width: 130,
            }}
            type="date"
            name="fromDate"
            value={startDate}
            fullWidth
            inputProps={{
              max: "9999-12-31",
              // max: new Date(date30).toISOString().split("T")[0],
              sx: { fontSize: "12px" },
            }}
            onChange={handleChangefromDate}
            // defaultValue={currentDateNew}
          />
        </FormControl>

        <Typography
          sx={{
            marginRight: "10px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          To:
        </Typography>
        <FormControl>
          <TextField
            size="small"
            sx={{ mr: 2, width: 130 }}
            type="date"
            name="toDate"
            value={endDate}
            fullWidth
            inputProps={{
              min: addDaysToDate(startDate, 0),
              max: date30 && new Date(date30).toISOString().split("T")[0],
              sx: { fontSize: "12px" },
            }}
            onChange={handleChangeToDate}
            // defaultValue={lastDateNew}
          />
        </FormControl>
        <Box
          variant="outlined"
          sx={{
            fontSize: "13px",
            padding: "5px 8px",
            border: "1px solid #ccc",
            borderRadius: "7px",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#d1eade",
            },
          }}
          onClick={handleSearch}
        >
          <img src={searchImage} alt="" width="20px" />
        </Box>

        <Box>
          <Button
            variant="contained"
            sx={{ borderRadius: "7px", padding: "4px 0px", ml: 2 }}
            onClick={resetFilter}
          >
            <AutorenewRoundedIcon />
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {registerLoader ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              mt: 8,
            }}
          >
            <CircularProgress />
          </Box>
        ) : registerData?.length > 0 ? (
          registerData?.map((item, index) => (
            <Grid item xs={12} sm={4} md={3} mt={2} key={index + "keyii"}>
              <Card>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    pt: 3,
                    // background: "rgba(179, 190, 98, 0.1)",
                    background: "rgba(190, 149, 190, 0.1)",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: 600,
                      // textAlign: "left",
                      color: "#005249",
                    }}
                  >
                    {item?.courseName}
                  </Typography>

                  <Box
                    sx={{
                      color: "#005249",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "85%",
                      pt: 3,
                      pb: 2,
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: "24px", fontWeight: 600 }}>
                        {item?.totalUsers ? item?.totalUsers : 0}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        height: "30px",
                        width: "30px",
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        background: "#005249",
                        cursor: "pointer",
                      }}
                      onClick={() => packageHandler(item)}
                    >
                      <EastIcon
                        sx={{
                          color: "#FFFFFF",
                          justifyContent: "center",
                          alignItems: "center",
                          display: "flex",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Card>

              <RegisterDialog
                handleClose={handleClose}
                courseInfo={courseInfo}
                openDialog={openDialog}
              />
            </Grid>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "50vh",
            }}
          >
            <Typography
              sx={{ fontWeight: 600, fontSize: "18px", color: "#f0807f" }}
            >
              No User found!
            </Typography>
          </Box>
        )}
      </Grid>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <AnalayticRegister
            title="Courses"
            chart={{
              series: registerData || [],
              colors: [
                theme.palette?.warning?.main,
                theme.palette?.primary?.main,
              ],
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LineChartRegister coursesData={registerData} />
        </Grid>
      </Grid>
    </>
  );
}

export default RegistrationDashboard;
