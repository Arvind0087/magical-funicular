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
import { Link } from "react-router-dom";
import EastIcon from "@mui/icons-material/East";
import AnalayticSells from "./AnalayticSells";
import { salesDashboardAsync } from "redux/dashboard/dashboard.async";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import {
  addDaysToDate,
  generateDateFromTo,
  get30DateFromTodate,
} from "utils/generateDateFromTo";
import LineChartSell from "./LineChartSell";
import purchase from "../../assets/images/purchase.png";
import sale from "../../assets/images/sale.png";
import subscription from "../../assets/images/subscription.png";
import searchIamage from "../../assets/images/search.png";

function SellsDashboard() {
  const dispatch = useDispatch();
  const { themeStretch } = useSettingsContext();
  const theme = useTheme();
  const [date30, setdate30] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { sellLoader, sellData } = useSelector((state) => state.dashboard);

  useEffect(() => {
    const payload = {
      fromDate: "",
      toDate: "",
    };
    dispatch(salesDashboardAsync(payload));
  }, []);

  const handleChangefromDate = (e) => {
    setStartDate(e.target.value);
  };

  const handleChangeToDate = (e) => {
    setEndDate(e.target.value);
  };

  const handleSearch = () => {
    const payload = {
      fromDate: startDate || "",
      toDate: endDate || "",
    };
    dispatch(salesDashboardAsync(payload));
  };

  const resetFilter = () => {
    setStartDate("");
    setEndDate("");
    const payload = {
      fromDate: "",
      toDate: "",
    };
    dispatch(salesDashboardAsync(payload));
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "flex-start", md: "flex-end" },
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
            value={startDate}
            sx={{
              mr: 2,
              width: 130,
            }}
            type="date"
            name="fromDate"
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
            value={endDate}
            sx={{ mr: 2, width: 130 }}
            type="date"
            name="toDate"
            fullWidth
            inputProps={{
              min: addDaysToDate(startDate, 1),
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
          <img src={searchIamage} alt="" width="20px" />
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

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: "#C8FACD" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ pl: "10px", pt: "15px", pb: "15px" }}>
                <img src={sale} alt="" width="40px" />
              </Box>
              <Box
                sx={{
                  margin: "auto",
                  display: "grid",
                  placeItems: "center",
                  color: "#005249",
                }}
              >
                <Typography sx={{ fontSize: "17px", fontWeight: 600 }}>
                  Total Sale
                </Typography>
              </Box>
              <Box
                sx={{
                  Padding: "15px 0px",
                  maxHeight: "44px",
                  minWidth: "80px",
                  margin: "auto",
                  borderRadius: "10%",
                  display: "grid",
                  placeItems: "center",
                  color: "#005249",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <Typography sx={{ fontSize: "17px", fontWeight: 600 }}>
                  {sellData?.totalSell ? sellData?.totalSell : 0}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: "#FFF5CC" }}>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ pl: "10px", pt: "15px", pb: "15px", pr: "15px" }}>
                <img src={subscription} alt="" width="40px" />
              </Box>
              <Box
                sx={{
                  margin: "auto",
                  display: "grid",
                  placeItems: "center",
                  color: "#7A4100",
                }}
              >
                <Typography sx={{ fontSize: "17px", fontWeight: 600 }}>
                  Total Subscription
                </Typography>
              </Box>
              <Box
                sx={{
                  Padding: "15px 0px",
                  maxHeight: "44px",
                  minWidth: "80px",
                  margin: "auto",
                  borderRadius: "10%",
                  display: "grid",
                  placeItems: "center",
                  //   background:
                  //     "linear-gradient(135deg, rgba(0, 171, 85, 0) 0%, rgba(0, 171, 85, 0.24) 97.35%)",
                  color: "#7A4100",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <Typography sx={{ fontSize: "17px", fontWeight: 600 }}>
                  {sellData?.subscriptionSell ? sellData?.subscriptionSell : 0}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: "#CAFDF5" }}>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ pl: "10px", pt: "15px", pb: "15px" }}>
                <img src={purchase} alt="" width="40px" />
              </Box>
              <Box
                sx={{
                  margin: "auto",
                  display: "grid",
                  placeItems: "center",
                  color: "#003768",
                }}
              >
                <Typography sx={{ fontSize: "17px", fontWeight: 600 }}>
                  Total Purchase
                </Typography>
              </Box>
              <Box
                sx={{
                  Padding: "15px 0px",
                  maxHeight: "44px",
                  minWidth: "80px",
                  margin: "auto",
                  borderRadius: "10%",
                  display: "grid",
                  placeItems: "center",
                  //   background:
                  //     "linear-gradient(135deg, rgba(0, 171, 85, 0) 0%, rgba(0, 171, 85, 0.24) 97.35%)",
                  color: "#003768",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <Typography sx={{ fontSize: "17px", fontWeight: 600 }}>
                  {sellData?.packageSell ? sellData?.packageSell : 0}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <AnalayticSells
            title="By Course"
            chart={{
              series: sellData?.courseWiseData || [],
              colors: [
                theme.palette?.warning?.main,
                theme.palette?.primary?.main,
              ],
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LineChartSell monthWiseData={sellData?.monthWiseData} />
        </Grid>
      </Grid>
    </>
  );
}

export default SellsDashboard;
