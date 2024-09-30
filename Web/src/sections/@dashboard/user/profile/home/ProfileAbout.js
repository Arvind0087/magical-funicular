import { styled } from "@mui/material/styles";
import { Link, Card, Typography, CardHeader, Stack } from "@mui/material";
import Iconify from "../../../../../components/iconify";

const StyledIcon = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

export default function ProfileAbout({
  quote,
  country,
  email,
  role,
  company,
  school,
}) {
  return (
    <Card>
      <CardHeader title="Basic Information" />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row">
          <StyledIcon icon="eva:pin-fill" />

          <Typography variant="body2">
            DOB:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Live at &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {country}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <StyledIcon icon="eva:email-fill" />
          <Typography variant="body2">
            Email:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </Typography>
          <Typography variant="body2">{email}</Typography>
        </Stack>

        <Stack direction="row">
          <StyledIcon icon="ic:round-business-center" />
          <Typography variant="body2">Course:&nbsp;&nbsp;&nbsp;</Typography>
          <Typography variant="body2">
            {role} &nbsp;&nbsp;&nbsp; at &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {company}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <StyledIcon icon="ic:round-business-center" />

          <Typography variant="body2">
            Board:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {school}
            </Link>
          </Typography>
        </Stack>
        <Stack direction="row">
          <StyledIcon icon="ic:round-business-center" />

          <Typography variant="body2">
            Gender:&nbsp;&nbsp;&nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              <Typography
                component="span"
                variant="subtitle2"
                color="text.primary"
              >
                Male
              </Typography>
            </Link>
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
