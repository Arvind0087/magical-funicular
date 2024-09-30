import React from "react";
import { Helmet } from "react-helmet-async";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import {
  _userAbout,
  _userFeeds,
  _userFriends,
  _userGallery,
  _userFollowers,
} from "../../../../_mock/arrays";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../../components/settings";
import { ProfileCover } from "../../../../sections/@dashboard/user/profile";
import { getStudentByIdAsync } from "../../../../redux/async.api";
import Iconify from "../../../../components/iconify/Iconify";

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
  const { studentLoader, studentById } = useSelector((state) => state.student);

  useEffect(() => {
    if (id) {
      const payload = {
        userId: id,
        batchTypeId: "",
      };
      dispatch(getStudentByIdAsync(payload));
    }
  }, [id]);

  return (
    <>
      {/* <Helmet>
        <title> User: Profile | Minimal UI</title>
      </Helmet> */}

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Profile"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "User", href: "" },
            { name: "Deep Bag" },
          ]}
        />
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: "relative",
          }}
        >
          <ProfileCover name={studentById.name} role="Student" cover="" />
        </Card>
        <Box key="Profile">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Card>
                  <CardHeader title="Basic Information" />

                  <Stack spacing={2} sx={{ p: 3 }}>
                    <Stack direction="row">
                      <StyledIcon icon="eva:pin-fill" />

                      <Typography variant="body2">
                        DOB:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </Typography>

                      <Typography variant="body2">{studentById.dob}</Typography>
                    </Stack>

                    <Stack direction="row">
                      <StyledIcon icon="eva:email-fill" />
                      <Typography variant="body2">
                        Email:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </Typography>
                      <Typography variant="body2">
                        {studentById.email}
                      </Typography>
                    </Stack>

                    <Stack direction="row">
                      <StyledIcon icon="ic:round-business-center" />
                      <Typography variant="body2">
                        phone:&nbsp;&nbsp;&nbsp;
                      </Typography>
                      <Typography variant="body2">
                        {studentById.phone}
                      </Typography>
                    </Stack>

                    <Stack direction="row">
                      <StyledIcon icon="ic:round-business-center" />

                      <Typography variant="body2">
                        Board:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </Typography>
                      <Typography variant="body2">
                        {studentById.mPin}
                      </Typography>
                    </Stack>
                    <Stack direction="row">
                      <StyledIcon icon="ic:round-business-center" />

                      <Typography variant="body2">
                        Gender:&nbsp;&nbsp;&nbsp;
                        <Typography
                          component="span"
                          // variant="subtitle2"
                          // color="text.primary"
                        >
                          {studentById.gender}
                        </Typography>
                      </Typography>
                    </Stack>
                  </Stack>
                </Card>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Card>
                  <CardHeader title="Advance Information" />

                  <Stack spacing={2} sx={{ p: 3 }}>
                    <Stack direction="row">
                      <StyledIcon icon="eva:pin-fill" />

                      <Typography variant="body2">
                        Address:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </Typography>
                      <Typography variant="body2">
                        {studentById.address}
                      </Typography>
                    </Stack>

                    <Stack direction="row">
                      <StyledIcon icon="eva:email-fill" />
                      <Typography variant="body2">
                        State:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </Typography>
                      <Typography variant="body2">
                        {studentById.state}
                      </Typography>
                    </Stack>

                    <Stack direction="row">
                      <StyledIcon icon="ic:round-business-center" />
                      <Typography variant="body2">
                        Pincode:&nbsp;&nbsp;&nbsp;
                      </Typography>
                      <Typography variant="body2">
                        {studentById.pincode}
                      </Typography>
                    </Stack>

                    <Stack direction="row">
                      <StyledIcon icon="ic:round-business-center" />

                      <Typography variant="body2">
                        School Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </Typography>
                      <Typography variant="body2">
                        {studentById.schoolName}
                      </Typography>
                    </Stack>
                    <Stack direction="row">
                      <StyledIcon icon="ic:round-business-center" />

                      <Typography variant="body2">
                        WantsToBe:&nbsp;&nbsp;&nbsp;
                        <Typography
                          component="span"
                          // variant="subtitle2"
                          // color="text.primary"
                        >
                          {studentById.wantsToBe}
                        </Typography>
                      </Typography>
                    </Stack>
                  </Stack>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
