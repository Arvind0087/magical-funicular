import { Stack, Typography } from "@mui/material";
import Logo from "../../components/logo";
import {
  StyledRoot,
  StyledContent,
  StyledSection,
  StyledSectionBg,
} from "./styles";
import Image from "../../components/image/Image";
import { useSelector } from "react-redux";

export default function LoginLayout({ children }) {

  const { adminSetting } = useSelector(
    (state) => state.admin
  );
  return (
    <StyledRoot>
      <Logo
        sx={{
          zIndex: 9,
          position: "absolute",
          mt: { xs: 1.5, md: 5 },
          ml: { xs: 2, md: 5 },
        }}
      />

      <StyledSection>
        {/* <Typography
          variant="h3"
          sx={{ mb: 10, maxWidth: 480, textAlign: "center" }}
        >
          {"Hi, Welcome back"}
        </Typography> */}

        <Image
          disabledEffect
          visibleByDefault
          alt="auth"
          // src={"/assets/illustrations/illustration_dashboard.png"}
          src={adminSetting?.loginImage}
          sx={{ maxWidth: 720 }}
        />

        <StyledSectionBg />
      </StyledSection>

      <StyledContent>
        <Stack sx={{ width: 1 }}> {children} </Stack>
      </StyledContent>
    </StyledRoot>
  );
}
