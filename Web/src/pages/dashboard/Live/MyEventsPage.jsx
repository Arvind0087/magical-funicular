import React, { useState } from "react";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useNavigate } from "react-router";
import { useSettingsContext } from "../../../components/settings";
import calenderr from "../../../assets/images/calenderr.svg";
import event from "../../../assets/images/event.svg";
import Calender from "./components/Calender";
import DetailedEvent from "./components/DetailedEvent";
import { useLocation } from "react-router";

const BookEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { themeStretch } = useSettingsContext();
  const [currentTab, setCurrentTab] = useState("event");
  const { packageId } = location?.state;

  const TABS = [
    {
      value: "event",
      label: <img src={event} />,
      component: <DetailedEvent packageId={packageId} />,
    },
    {
      value: "Calender",
      label: <img src={calenderr} />,
      component: <Calender packageId={packageId} />,
    },
  ];

  return (
    <>
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Box sx={{ display: "flex", float: "right" }}>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
          >
            {TABS.map((tab, index) => (
              <Tab key={index} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Box>
        {TABS.map(
          (tab) =>
            tab.value === currentTab && (
              <Box key={tab.value} sx={{ mt: 5 }}>
                {tab.component}
              </Box>
            )
        )}
      </Container>
    </>
  );
};
export default BookEvent;
