import { Link as RouterLink } from "react-router-dom";
import { styled, alpha } from "@mui/material/styles";
import { Box, Link, Typography } from "@mui/material";
// import { PATH_DASHBOARD } from "../../../routes/paths";
// import { CustomAvatar } from "../../../components/custom-avatar";
import Dashboard from "./dashboard.svg";

const StyledRoot = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

export default function NavAccount() {
  return (
    <Link
      to="/app/dashboard"
      component={RouterLink}
      underline="none"
      color="inherit"
    >
      <StyledRoot>
        {/* <CustomAvatar src={user?.photoURL} alt={user?.displayName} name={user?.displayName} /> */}
        <img
          src={Dashboard}
          style={{ width: "25px", height: "25px" }}
          alt="Dashboard"
        />
        <Box sx={{ ml: 2, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.displayName}
            Dashboard
          </Typography>

          {/* <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
            {user?.role}
          </Typography> */}
        </Box>
      </StyledRoot>
    </Link>
  );
}
