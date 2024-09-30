import { Link as RouterLink } from "react-router-dom";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { CustomAvatar } from "../../../components/custom-avatar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useSelector } from "react-redux";

const StyledRoot = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

export default function NavAccount({ isOpen, setIsOpen }) {
  const { studentById } = useSelector((state) => state?.student);
  const { name, avatar, subscriptionType, courseName, className, boardName } =
    studentById;
  return (
    <StyledRoot sx={{ display: "flex", justifyContent: "space-between" }}>
      <Link
        to="myprofile"
        component={RouterLink}
        underline="none"
        color="inherit"
      >
        <CustomAvatar src={avatar} alt={name} name={name} />
      </Link>
      <Link
        to="myprofile"
        component={RouterLink}
        underline="none"
        color="inherit"
      >
        <Box sx={{ ml: 2, minWidth: 0 }}>
          <Typography variant="subtitle2" component="h2" noWrap>
            {name}
          </Typography>
          <Typography variant="subtitle2" component="h2">
            {boardName}-{className}
          </Typography>

          <Typography
            variant="body2"
            component="p"
            noWrap
            sx={{ color: "text.secondary", display: "flex" }}
          >
            {subscriptionType} User
            <CheckCircleIcon
              sx={{
                height: "15px",
                color: "#E27A00",
                mt: "5px",
                display: subscriptionType == "Free" ? "none" : "block",
              }}
            />
          </Typography>
        </Box>
      </Link>

      <NavigateNextIcon
        sx={{ height: "20px", color: "text.secondary" }}
        onClick={() => {
          setIsOpen((preVal) => !preVal);
        }}
      />
    </StyledRoot>
  );
}
