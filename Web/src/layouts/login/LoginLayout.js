import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import { useDispatch,useSelector } from "react-redux";
import Logo from "../../components/logo";
import { StyledRoot, StyledContent, StyledSection, StyledSectionBg } from "./styles";
import Image from "../../components/image/Image";

export default function LoginLayout({ children }) {
  const dispatch=useDispatch();
  const{getOnlySiteSettingLoader, getOnlySiteSettingData= []}=useSelector((state)=>state.getOnlySiteSetting)
  const {siteLogo,siteAuthorName,loginImage}=getOnlySiteSettingData
 
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
          src={loginImage}
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

LoginLayout.propTypes = {
  children: PropTypes.node,
};
