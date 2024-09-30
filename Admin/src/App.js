import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Router from "routes";
import MotionLazyContainer from "components/animate/MotionLazyContainer";
import ThemeProvider from "theme";
import SnackbarProvider from "components/snackbar/SnackbarProvider";
import StyledChart from "components/chart/styles";
import { getAuth } from "utils/getAuth";
import { setUserInfoRedux } from "redux/slices/userinfo.slice";
import ThemeSettings from "components/settings/ThemeSettings";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import "./styles.css";
export default function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const getauth = getAuth();

  useEffect(() => {
    if (getauth) dispatch(setUserInfoRedux(getauth));
  }, [getauth]);

  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/app") {
      navigate("/app/dashboard");
    }
  }, [location]);

  return (
    <MotionLazyContainer>
      <ThemeProvider>
        <ThemeSettings>
          <SnackbarProvider>
            <StyledChart />
            <Router />
            <Toaster reverseOrder={false} />
          </SnackbarProvider>
        </ThemeSettings>
      </ThemeProvider>
    </MotionLazyContainer>
  );
}
