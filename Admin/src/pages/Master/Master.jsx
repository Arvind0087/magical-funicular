import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import { Button, Container } from "@mui/material";
import { PATH_DASHBOARD } from "../../../routes/paths";
// import { _userList } from "../../../_mock/arrays";
import Iconify from "../../../components/iconify";
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../components/settings";

export default function Master() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Course | Veda Academy</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Course"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Course", href: "" },
            { name: "List" },
          ]}
          action={
            <Button
              to={PATH_DASHBOARD.user.new}
              component={RouterLink}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Add
            </Button>
          }
        />
      </Container>
    </>
  );
}
