import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Container, Tab, Tabs, Box } from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import Web from "./component/web";
import Mobile from "./component/Mobile/Mobile";
import Admin from "./component/Admin/Admin";
import { useSelector } from 'react-redux'
export default function AddStudent() {
  const { themeStretch } = useSettingsContext();
  const [currentTab, setCurrentTab] = useState("admin");
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);


  const TABS = [
    {
      value: "admin",
      label: "Admin",
      icon: <Iconify icon="ic:round-receipt" />,
      component: <Admin />,
    },
    {
      value: "web",
      label: "Web",
      icon: <Iconify icon="ic:round-account-box" />,
      component: <Web />,
    },
    {
      value: "mobile",
      label: "Mobile",
      icon: <Iconify icon="ic:round-receipt" />,
      component: <Mobile />,
    },
  ];

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title> Site Setting | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Site Setting"
        links={[
          { name: "General Settings", href: "" },
          { name: "Site Setting" },
        ]}
      />
      <Tabs
        value={currentTab}
        onChange={(event, newValue) => setCurrentTab(newValue)}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            icon={tab.icon}
            value={tab.value}
          />
        ))}
      </Tabs>

      {TABS.map(
        (tab) =>
          tab.value === currentTab && (
            <Box key={tab.value} sx={{ mt: 5 }}>
              {tab.component}
            </Box>
          )
      )}
    </Container>
  );
}
