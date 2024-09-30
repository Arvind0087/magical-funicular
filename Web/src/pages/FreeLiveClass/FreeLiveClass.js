import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getFreeEventByStudentIdAsync } from "redux/freeliveClass/freeliveClass.async";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import FreeLiveCarousel from "../../components/freeLiveClass/FreeLiveCarousel";
import NoUpcoming from "./NoUpcoming";
import NoOutgoing from "./NoOutgoing";
import NoPast from "./NoPast";
import { Helmet } from "react-helmet-async";

function FreeLiveClass() {
  const { getOnlySiteSettingData = [] } = useSelector(
    (state) => state.getOnlySiteSetting
  );
  const { siteTitle } = getOnlySiteSettingData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { studentById = {} } = useSelector((state) => state?.student);
  const { freeLiveLoader, freeLive } = useSelector((state) => state?.freeLive);
  const [tabVal, setTabVal] = useState("ongoing");

  useEffect(() => {
    let payload = {
      status: tabVal,
      batchTypeId: studentById?.batchTypeId,
    };
    dispatch(getFreeEventByStudentIdAsync(payload));
  }, [tabVal]);

  const handleTabChange = (event, newValue) => {
    setTabVal(newValue);
  };

  const backHandler = () => {
    navigate(-1);
  };

  return (
    <>
      <Helmet>
        <title>Free Events | {`${siteTitle}`}</title>
      </Helmet>
      <Box
        sx={{
          position: "relative",
          backgroundColor: "#fff",
          width: "103%",
          height: "50px",
          marginLeft: "-15px",
          mt: 2,
          // background: "linear-gradient(to right, #098A4E, #9ADD00)",
          // zIndex: 12344,
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
            Free Live Classes
          </Typography>
        </Box>
      </Box>
      <Container>
        <Box>
          <TabContext value={tabVal}>
            <Box sx={{ borderColor: "divider" }}>
              <TabList onChange={handleTabChange}>
                <Tab label="Past" value="past" />
                <Tab label="Ongoing" value="ongoing" />
                <Tab label="Upcoming" value="upcoming" />
              </TabList>
            </Box>
            <TabPanel value="ongoing">
              <Box>
                {freeLiveLoader ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : freeLive?.length > 0 ? (
                  <FreeLiveCarousel data={freeLive} loader={freeLiveLoader} />
                ) : (
                  <NoOutgoing setTabVal={setTabVal} />
                )}
              </Box>
            </TabPanel>
            <TabPanel value="upcoming">
              <Box>
                {freeLiveLoader ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : freeLive?.length > 0 ? (
                  <FreeLiveCarousel data={freeLive} loader={freeLiveLoader} />
                ) : (
                  <NoUpcoming setTabVal={setTabVal} />
                )}
              </Box>
            </TabPanel>
            <TabPanel value="past">
              <Box>
                {freeLiveLoader ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : freeLive?.length > 0 ? (
                  <FreeLiveCarousel data={freeLive} loader={freeLiveLoader} />
                ) : (
                  <NoPast setTabVal={setTabVal} />
                )}
              </Box>
            </TabPanel>
          </TabContext>
        </Box>
      </Container>
    </>
  );
}

export default FreeLiveClass;
