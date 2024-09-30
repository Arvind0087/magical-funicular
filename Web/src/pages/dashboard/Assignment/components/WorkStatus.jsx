import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Grid,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import { useSelector, useDispatch } from "react-redux";
import { useSettingsContext } from "../../../../components/settings";
import CustomComponentLoader from "../../../../components/CustomComponentLoader";
import moment from "moment";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { toastoptions } from "../../../../utils/toastoptions";
import { PATH_DASHBOARD } from "routes/paths";
import NoVideo from "../../../../assets/images/NoVideos.svg";

export const WorkStatus = (props) => {
  const { statusTabs, onValueChange, currentTab } = props;
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();

  const assignment = useSelector(
    (state) => state?.assignment?.AssignmentStatus?.data
  );
  const { AssignmentStatus, AssignmentStatusLoader } = useSelector(
    (state) => state?.assignment
  );

  const [showAll, setShowAll] = useState(false);
  const itemsToShow = showAll
    ? AssignmentStatus?.data
    : AssignmentStatus?.data?.length > 3
    ? AssignmentStatus?.data?.slice(0, 3)
    : AssignmentStatus?.data;

  const handleClick = (e, newValue) => {
    onValueChange("tabs", newValue);
  };

  const goToInstruction = (data) => {
    if (data && currentTab == "upcoming") {
      let assignDateTime = data?.validity;
      const splitValue = assignDateTime && assignDateTime.split("T");

      const providedDate = splitValue[0];
      const providedTime = splitValue[1];
      const providedDateTime = moment(
        `${providedDate} ${providedTime}`,
        "YYYY-MM-DD HH:mm:ss"
      );
      const currentDateTime = moment();

      if (providedDateTime.isBefore(currentDateTime, "day")) {
        toast.error("Assignment completed!", toastoptions);
      } else if (providedDateTime.isAfter(currentDateTime, "day")) {
        toast.error("Please start at the scheduled date", toastoptions);
      } else if (currentDateTime.isSame(providedDateTime, "day")) {
        if (currentDateTime.isSameOrAfter(providedDateTime)) {
          navigate(
            `${PATH_DASHBOARD.instruction(data?.assignmentId)}?type=assignment`
          );
        } else {
          toast.error("Assignment not started!", toastoptions);
        }
      } else {
        toast.error("Please start at the scheduled date!", toastoptions);
      }
    } else if (data && currentTab == "pending") {
      navigate(
        `${PATH_DASHBOARD.instruction(data?.assignmentId)}?type=assignment`
      );
    }

    // navigate(
    //   `${PATH_DASHBOARD.instruction(data?.assignmentId)}?type=assignment`
    // );
  };

  return (
    <Container maxWidth={themeStretch ? false : "xl"}>
      <Tabs value={currentTab} onChange={handleClick}>
        {statusTabs.map((tab, index) => (
          <Tab
            sx={{
              bgcolor: Boolean(currentTab === tab.value) && "primary.lighter",
              px: 5,
              margin: "0 !important",
            }}
            key={index}
            label={tab.label}
            value={tab.value}
          />
        ))}
      </Tabs>
      {itemsToShow?.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {AssignmentStatusLoader ? (
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
                {itemsToShow?.length > 0 ? (
                  itemsToShow?.map((data, index) => {
                    return (
                      <Grid item xs={12} md={4} key={index}>
                        <Card
                          sx={{
                            width: "100%",
                            height: 150,
                            overflow: "hidden",
                            cursor: "pointer",
                            p: "20px 12px",
                            mt: "30px",
                            flexDirection: "column",
                            justifyContent: "space-around",
                            pointerEvents: currentTab === "completed" && "none",
                          }}
                          onClick={() => goToInstruction(data)}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box
                              sx={{
                                width: "80px",
                                height: "20px",
                                borderRadius: " 26px",
                                display: "grid",
                                placeItems: "center",
                                bgcolor: "primary.main",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "13px",
                                  textAlign: " center",
                                  color: "#ffff",
                                }}
                              >
                                {data?.assignmentType}
                              </Typography>
                            </Box>
                            <Typography sx={{ fontSize: "12px" }}>
                              Attempted By:
                              {moment
                                .utc(data.validity)
                                .format("D MMMM, h:mm A")}
                            </Typography>
                          </Box>
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="h6">{data.name}</Typography>
                            <Typography
                              sx={{ color: "#787A8D", fontSize: "12px", mt: 3 }}
                            >
                              {moment.duration(data?.time).asMinutes() +
                                " Minute"}
                              | by {data.createdBy}
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                    );
                  })
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      textAlign: "center",
                      marginTop: "80px",
                    }}
                  >
                    <Typography variant="h5">No Data Found</Typography>
                  </Box>
                )}
              </>
            )}
          </Grid>
          {AssignmentStatus?.data?.length > 3 ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
              <Button
                sx={{
                  borderRadius: "60px",
                  color: "#ffff",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  // padding: '10px 36px',
                  height: "44px",
                  width: "30%",
                  [theme.breakpoints.down("md")]: {
                    width: "100%",
                  },
                }}
                type="submit"
                className="OTP-button"
                variant="contained"
                onClick={() => setShowAll(true)}
              >
                View All
              </Button>
            </Box>
          ) : null}
        </>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img src={NoVideo} alt="" width="250px" />
            <Typography sx={{ fontWeight: 600, mt: 1 }}>
              No assignment found!
            </Typography>
          </Box>
        </>
      )}
    </Container>
  );
};
