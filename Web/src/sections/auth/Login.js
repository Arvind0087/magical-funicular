import { Stack, Typography } from "@mui/material";
import LoginLayout from "../../layouts/login";
import AuthLoginForm from "./AuthLoginForm";

export default function Login() {
  return (
    <LoginLayout>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
          }}
        >
          Sign in to Lecture Dekho
        </Typography>
      </Stack>

      <AuthLoginForm />
    </LoginLayout>
  );
}
