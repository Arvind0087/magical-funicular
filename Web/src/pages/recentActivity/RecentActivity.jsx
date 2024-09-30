import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LocalLibraryRoundedIcon from "@mui/icons-material/LocalLibraryRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router";
import { useEffect } from "react";
import { useSettingsContext } from "components/settings";
import LearnRecentActivity from "./LearnRecentActivity";
import TestRecentActivity from "./TestRecentActivity";
const RecentActivityPage = () => {
  const { themeStretch } = useSettingsContext();
  const [currentTab, setCurrentTab] = useState("");
  const { getOnlySiteSettingData = [] } = useSelector(
    (state) => state.getOnlySiteSetting
  );
  const { siteTitle } = getOnlySiteSettingData;
  const location = useLocation();
  const _tabs = [
    {
      value: "Learn",
      label: "Learn",
      component: <LearnRecentActivity />,
      icon: <LocalLibraryRoundedIcon />,
    },
    {
      value: "Test",
      label: "Test",
      component: <TestRecentActivity />,
      icon: <ListAltRoundedIcon />,
    },
  ];
  useEffect(() => {
    location?.state?.label
      ? setCurrentTab(location?.state?.label)
      : setCurrentTab("");
  }, []);
  return (
    <>
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Helmet>
          <title> Recent Activity | {`${siteTitle}`}</title>
        </Helmet>
        <Typography variant="h4" sx={{ m: 1 }}>
          Recent Activities
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
          >
            {_tabs.map((tab, In) => (
              <Tab
                key={In}
                label={tab.label}
                value={tab.value}
                icon={tab.icon}
                iconPosition="start"
                sx={{
                  bgcolor:
                    Boolean(currentTab === tab.value) && "primary.lighter",
                  px: 5,
                  margin: "0 !important",
                }}
              />
            ))}
          </Tabs>
          {_tabs.map(
            (tab) =>
              tab.value === currentTab && (
                <Box key={tab.value} sx={{ mt: 5 }}>
                  {tab.component}
                </Box>
              )
          )}
        </Box>
      </Container>
    </>
  );
};
export default RecentActivityPage;
