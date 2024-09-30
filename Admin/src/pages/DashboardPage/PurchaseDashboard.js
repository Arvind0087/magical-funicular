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
import { useSettingsContext } from "components/settings/SettingsContext";
import { Theme, useTheme, makeStyles } from "@mui/material/styles";
import EastIcon from "@mui/icons-material/East";
import CircularProgress from "@mui/material/CircularProgress";
import { packageDashboardAsync } from "redux/dashboard/dashboard.async";
import excelDownload from "../../assets/excel/ExcelDownload.png";
import {
  addDaysToDate,
  generateDateFromTo,
  get30DateFromTodate,
} from "utils/generateDateFromTo";
import { packageSellsExcelReportAsync } from "redux/downloadexcel/excel.async";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import searchImage from "../../assets/images/search.png";
import active from "../../assets/images/active.png";
import inactive from "../../assets/images/inactive.png";
import StaffDialog from "./StaffDialog";

function PurchaseDashboard() {
  const dispatch = useDispatch();
  const { themeStretch } = useSettingsContext();
  const theme = useTheme();
  const [date30, setdate30] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tabs, setTabs] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [packageInfo, setPackageInfo] = useState([]);
  const { sellLoader, sellData, packageLoader, packageData } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    const payload = {
      fromDate: "",
      toDate: "",
    };
    dispatch(packageDashboardAsync(payload));
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
      type: tabs,
    };
    dispatch(packageDashboardAsync(payload));
  };

  const tabHandler = (val) => {
    setTabs(val);
    const payload = {
      fromDate: startDate || "",
      toDate: endDate || "",
      type: val,
    };
    dispatch(packageDashboardAsync(payload));
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const packageHandler = (pack) => {
    setPackageInfo(pack);
    setOpenDialog(true);
  };

  const resetFilter = () => {
    setTabs("all");
    setStartDate("");
    setEndDate("");
    const payload = {
      fromDate: "",
      toDate: "",
      type: "all",
    };
    dispatch(packageDashboardAsync(payload));
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

        <Box
          sx={{ borderRadius: "40px", cursor: "pointer", ml: 2 }}
          onClick={() =>
            packageSellsExcelReportAsync({
              packageId: "",
              fromDate: startDate || "",
              toDate: endDate || "",
              type: tabs,
            })
          }
        >
          <img
            src={excelDownload}
            alt="Download Excel"
            width="50px"
            height="50px"
            borderRadius="40px"
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          mb: 4,
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          sx={{
            width: "100px",
            fontSize: "10px",
            borderRadius: "10px",
          }}
          color={tabs == "all" ? "secondary" : "info"}
          onClick={() => tabHandler("all")}
        >
          All ({packageData?.allSell})
        </Button>
        <Button
          variant="contained"
          sx={{
            width: "100px",
            fontSize: "10px",
            borderRadius: "10px",
            pt: "5px",
            pb: "5px",
          }}
          onClick={() => tabHandler("active")}
          color={tabs == "active" ? "secondary" : "info"}
        >
          Active ({packageData?.activeTotalSell})
        </Button>
        <Button
          variant="contained"
          sx={{
            width: "100px",
            fontSize: "10px",
            borderRadius: "10px",
          }}
          color={tabs == "inactive" ? "secondary" : "info"}
          onClick={() => tabHandler("inactive")}
        >
          Inactive ({packageData?.inactiveTotalSell})
        </Button>
      </Box>
      <Grid container spacing={2}>
        {packageLoader ? (
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
        ) : packageData?.packageWiseData?.length > 0 ? (
          packageData?.packageWiseData?.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index + "keyii"}>
              <Card>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    pt: 2,
                    position: "relative",
                    background:
                      item?.status == 1
                        ? "rgba(0, 145, 127, 0.1)"
                        : "rgba(240, 128, 127, 0.1)",
                  }}
                >
                  <Box sx={{ position: "absolute", top: "8px", left: "4px" }}>
                    <img
                      src={item?.status == 1 ? active : inactive}
                      alt=""
                      width="20px"
                    />
                  </Box>

                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 500,
                      // textAlign: "left",
                      color: "#005249",
                      mt: 2,
                    }}
                  >
                    {item?.packageName}
                  </Typography>

                  <Box
                    sx={{
                      color: "#005249",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "85%",
                      pt: 2,
                      pb: 2,
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: "28px", fontWeight: 600 }}>
                        {item?.totalSell ? item?.totalSell : 0}
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
              <StaffDialog
                handleClose={handleClose}
                packageInfo={packageInfo}
                openDialog={openDialog}
                startDate={startDate}
                endDate={endDate}
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
              No Package found!
            </Typography>
          </Box>
        )}
      </Grid>
    </>
  );
}

export default PurchaseDashboard;
