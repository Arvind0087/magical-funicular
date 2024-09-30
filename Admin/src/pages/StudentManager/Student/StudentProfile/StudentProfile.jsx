import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Card,
  Container,
  Box,
  Grid,
  Stack,
  CardHeader,
  Typography,
  TextField,
} from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import { useParams } from "react-router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getstudentbyidAsync } from "redux/async.api";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import Iconify from "components/iconify/Iconify";
import moment from "moment/moment";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { capitalize } from "lodash";
import Inf from "assets/ImageStudent/inf.jpg";

const StyledIcon = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

export default function StudentProfile() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { studentById } = useSelector((state) => state.student);
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  useEffect(() => {
    if (id) {
      const payload = {
        userId: id,
        batchTypeId: "",
      };
      dispatch(getstudentbyidAsync(payload));
    }
  }, [id]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title> User: Profile | {`${tabTitle}`}</title>
      </Helmet>

      <CustomBreadcrumbs
        // heading="Profile"
        links={[
          { name: "Student Manager", href: "" },
          { name: "Student", href: `${PATH_DASHBOARD.student}` },
          { name: "Profile", href: "" },
        ]}
      />

      <Grid container spacing={{ md: 3 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              mb: 3,
              height: 280,
              position: "relative",
            }}
          >
            <Stack spacing={2}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  mt: "70px",
                }}
              >
                <LazyLoadImage
                  alt="dfgdg"
                  effect="blur"
                  src={studentById?.avatar == null ? Inf : studentById?.avatar}
                  style={{
                    width: "128px",
                    height: "128px",

                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </Box>
              <Typography
                variant="body6"
                textAlign={"center"}
                sx={{ fontWeight: 700 }}
              >
                {capitalize(studentById.name)}
              </Typography>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={8} sx={{ mb: { xs: 3.2, mb: 0 } }}>
          <Card sx={{ p: 2 }}>
            <h4>Basic Information</h4>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              }}
            >
              <Box>
                {" "}
                <Typography variant="body2">
                  {" "}
                  Course:&nbsp;&nbsp;{studentById?.courseName}{" "}
                </Typography>
              </Box>
              <Box>
                {" "}
                <Typography variant="body2">
                  {" "}
                  Board:&nbsp;&nbsp;{studentById?.boardName}
                </Typography>
              </Box>
              <Box>
                {" "}
                <Typography variant="body2">
                  Class:&nbsp;&nbsp;{studentById?.className}
                </Typography>
              </Box>
              <Box>
                {" "}
                <Typography variant="body2">
                  Batch:&nbsp;&nbsp;{studentById?.batchTypeName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2">
                  {" "}
                  Batch Start Date:&nbsp;&nbsp;{" "}
                  {moment(studentById.batchStartDate).format("DD-MM-YYYY")}
                </Typography>
              </Box>
              <Box>
                {" "}
                Date of Birth:&nbsp;&nbsp;
                {moment(studentById.dob).format("DD-MM-YYYY")}
              </Box>
              <Box> Email:&nbsp;&nbsp;{studentById?.email}</Box>
              <Box> Gender:&nbsp;&nbsp;{studentById?.gender}</Box>
              <Box> Phone:&nbsp;&nbsp;{studentById?.phone}</Box>
              <Box> Pin Code:&nbsp;&nbsp;{studentById?.pincode}</Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* //for advance */}
      <Grid container spacing={{ md: 3 }}>
        <Grid item xs={12} md={12} sx={{ mb: { xs: 3.2, mb: 0 } }}>
          <Card sx={{ p: 2 }}>
            <h4>Advance Information</h4>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              }}
            >
              <Box>
                <Typography variant="body2">
                  {" "}
                  Want to Be:&nbsp;&nbsp;{studentById?.wantsToBeName};
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2">
                  State:&nbsp;&nbsp;{studentById?.stateName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2">
                  City:&nbsp;&nbsp;{studentById?.cityName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2">
                  Father Name:&nbsp;&nbsp;{studentById?.parentDetails?.name}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2">
                  Parent Number :&nbsp;&nbsp;
                  {studentById?.parentDetails?.phone}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2">
                  Father Occupation :&nbsp;&nbsp;
                  {studentById?.parentDetails?.occupation}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2">
                  School Name:&nbsp;&nbsp;{studentById?.schoolName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2">
                  Address:&nbsp;&nbsp;{studentById?.address}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2">
                  Own Referral Code:&nbsp;&nbsp;{studentById?.referralCode}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2">
                  Referred by:
                  {/* &nbsp;&nbsp;{studentById?.address} */}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
