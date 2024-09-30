import Router from "./routes";
import ThemeProvider from "./theme";
import ThemeLocalization from "./locales";
import { StyledChart } from "./components/chart";
import SnackbarProvider from "./components/snackbar";
import { ThemeSettings } from "./components/settings";
import { MotionLazyContainer } from "./components/animate";
import { Toaster, toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { toastoptions } from "./utils/toastoptions";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { emptyErrorMessage } from "./redux/slices/error.slice";
import { setUsersData } from "redux/slices/schedule.slice";
import { Helmet } from "react-helmet-async";
import { addUserSpendTimeAsync, watchingLiveClassAsync } from "redux/async.api";
import { userActivationAsync } from "redux/dashboard/dashboard.async";
import { useLocation } from "react-router";
import socketio from "socket.io-client";

function disableRightClick(e) {
  e.preventDefault();
}

function handleKeyDown(e) {
  if (
    (e.ctrlKey && e.shiftKey && e.code === "KeyI") ||
    (e.ctrlKey && e.shiftKey && e.code === "KeyJ")
  ) {
    e.preventDefault();
  }
}

export default function App() {
  const { eventsId, liveUsers } = useSelector((state) => state?.schedule);
  const [isVisible, setIsVisible] = useState(true);
  // const [socket, setSocket] = useState(null);
  const { studentLoader, studentById } = useSelector((state) => state.student);
  const { userInfo: { accessToken = "", loginStatus = false } = "" } =
    useSelector((state) => state?.userInfo);
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.error);
  const { getOnlySiteSettingLoader, getOnlySiteSettingData = [] } = useSelector(
    (state) => state.getOnlySiteSetting
  );
  const { siteLogo, siteAuthorName, favicon, siteTitle } =
    getOnlySiteSettingData;

  useEffect(() => {
    if (studentById?.isUserActive == false) {
      dispatch(userActivationAsync({}));
    }
  }, []);

  console.log("studentById in app", studentById?.isUserActive, studentById);

  // useEffect(() => {
  //   const newSocket = socketio("https://api.vedaacademy.org.in");
  //   setSocket(newSocket);
  //   return () => newSocket.disconnect();
  // }, []);

  // const sendCountMessage = () => {
  //   if (socket) {
  //     let userId = studentById?.id;
  //     let batchId = studentById?.batchTypeId;
  //     let status = 0;
  //     socket.emit("send-watching-count", userId, eventsId, batchId, status);
  //   }
  // };

  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === "hidden") {
  //       if (eventsId) {
  //         sendCountMessage();
  //       }
  //     }
  //   };
  //   document.addEventListener("visibilitychange", handleVisibilityChange);
  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, []);

  // const location = useLocation();
  // useEffect(() => {
  //   const pattern = /^\/app\/event\/\d+$/;
  //   if (!pattern.test(location.pathname)) {
  //     if (eventsId) {
  //       sendCountMessage();
  //     }
  //   }
  // }, [location]);

  // useEffect(() => {
  //   if (socket) {
  //     socket.on("receive-watching-count", (data) => {
  //       dispatch(setUsersData(data));
  //     });
  //   }

  //   return () => {
  //     if (socket) {
  //       socket.off("receive-watching-count");
  //     }
  //   };
  // }, [socket]);

  useEffect(() => {
    if (process.env.REACT_APP_RIGHT_CLICK === "true") {
      document.addEventListener("contextmenu", disableRightClick);
      return () => {
        document.removeEventListener("contextmenu", disableRightClick);
      };
    } else {
      console.log("Right click enable");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleBeforeUnload = (event) => {
    event.preventDefault();
    // dispatch(
    //   addUserSpendTimeAsync({
    //     status: "close",
    //   })
    // );

    // sendCountMessage();
    // if (process.env.REACT_APP_RIGHT_CLICK === "true") {
    //   dispatch({ type: "LOGOUT" });
    // }

    // if (!event.currentTarget) {
    //   dispatch({ type: "LOGOUT" });
    // }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (error && error !== "User couldn't found.") {
      toast.error(error, toastoptions);
      dispatch(emptyErrorMessage());
    }
  }, [error]);

  return (
    <MotionLazyContainer>
      <ThemeProvider>
        <ThemeSettings>
          <ThemeLocalization>
            <SnackbarProvider>
              <StyledChart />
              <Helmet>
                <title>{siteTitle}</title>
                <link rel="icon" type="image/png" href={favicon} />
              </Helmet>
              <Router />
              <Toaster reverseOrder={false} />
            </SnackbarProvider>
          </ThemeLocalization>
        </ThemeSettings>
      </ThemeProvider>
    </MotionLazyContainer>
  );
}
