import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import useResponsive from "hooks/useResponsive";
import { NAV } from "config";
import Logo from "components/logo";
import Scrollbar from "components/scrollbar";
import { NavSectionVertical } from "components/nav-section";
import navConfig from "./config";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useSelector, useDispatch } from "react-redux";
import { getAllUserDetails, getStudentByIdAsync } from "redux/async.api";
import { PATH_AUTH, PATH_DASHBOARD } from "routes/paths";
import { switchAccountAsync } from "redux/register/register.async";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
import { reduxSetUserLoggedInInfo } from "redux/loggedInInfo/loggedIn.slice";
import "./nav.css";
import _ from "lodash";
import { CustomAvatar } from "components/custom-avatar";
import CustomLoader from "components/CustomLoader";
import NavAccount from "./NavAccount";
import { addUserSpendTimeAsync } from "redux/async.api";

export default function NavVertical({ openNav, onCloseNav }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isDesktop = useResponsive("up", "lg");
  const [isVisible, setisVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { studentLoader, studentById } = useSelector((state) => state.student);
  const { userInfo } = useSelector((state) => state.userInfo);
  const { registerLoader, switchaccount } = useSelector(
    (state) => state.register
  );

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const userInLength = userInfo?.otheruser?.length || 0;

  useEffect(() => {
    // dispatch(
    //   addUserSpendTimeAsync({
    //     status: "close",
    //   })
    // );
    if (userInfo?.userId) {
      dispatch(addUserSpendTimeAsync({}));
    }
  }, [userInfo?.userId]);

  const handleLoginOtherUser = (id) => {
    dispatch(
      switchAccountAsync({
        userId: id,
      })
    ).then((evv) => {
      toast.success(evv.payload.message, toastoptions);
      // dispatch(addUserSpendTimeAsync());

      dispatch(
        addUserSpendTimeAsync({
          status: "close",
        })
      );

      dispatch(
        reduxSetUserLoggedInInfo({
          accessToken: evv?.payload?.data?.accessToken,
          userId: evv?.payload?.data?.id,
          loginStatus: evv?.payload?.data?.loginStatus,
        })
      );
      navigate("/app/dashboard");
    });
  };

  useMemo(() => {
    if (!Boolean(userInfo.otheruser)) {
      const payload = {
        userId: userInfo?.userId,
        batchTypeId: "",
      };
      dispatch(getAllUserDetails(userInfo?.userId)).then((ev) => {
        dispatch(addUserSpendTimeAsync());
        dispatch(getStudentByIdAsync(payload));
        dispatch(
          reduxSetUserLoggedInInfo({
            ...userInfo,
            otheruser: ev?.payload?.data,
          })
        );
      });
    }
  }, [switchaccount, userInfo]);

  //on the click of this function it will navigate to create account page
  const navigateCreateAccountfun = () => {
    navigate(PATH_AUTH.createAccount);
  };

  // const filteredData =
  //   studentById?.course_type == "Purchase"
  //     ? navConfig?.map((obj) => ({
  //         items: obj?.items?.filter((item) => item?.title !== "Syllabus"),
  //       }))
  //     : studentById?.course_type == "Subscription"
  //     ? navConfig?.map((obj) => ({
  //         items: obj?.items?.filter((item) => item?.title !== "Courses"),
  //       }))
  //     : navConfig;

  const filteredData =
    studentById?.course_type == "Purchase"
      ? navConfig?.map((obj) => ({
          items: obj?.items?.filter((item) => item?.title !== "Syllabus"),
        }))
      : navConfig;

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          pt: 3,
          pb: 2,
          px: 2.5,
          flexShrink: 0,
        }}
      >
        <Logo />
        {/*<NavAccount isOpen={isOpen} setIsOpen={setIsOpen} /> */}
        <Grid
          container
          sx={{
            position: "absolute",
            top: "170px",
            zIndex: "2333",
            width: "240px",
            left: "18px",
            overflow: "hidden",
            bgcolor: "primary.lighter",
            borderRadius: 1,
            display: isOpen ? "" : "none",
          }}
        >
          {/*Array.isArray(userInfo?.otheruser) &&
            userInfo?.otheruser
              ?.slice(0, isVisible ? userInLength : 3)
              .map((item) => (
                <Grid item xs={4} sx={{ my: 1 }} key={item.id}>
                  <Box
                    sx={{
                      width: "70px",
                      m: "auto",
                      cursor: "pointer",
                    }}
                    onClick={() => handleLoginOtherUser(item.id)}
                  >
                    <Box
                      sx={{
                        width: "40px",
                        height: "40px",
                        borderRadius: " 40px",
                        mt: 1,
                        marginX: "auto",
                      }}
                    >
                      <CustomAvatar
                        src={item?.avatar}
                        alt={item.name}
                        name={item.name}
                      />
                    </Box>
                    {item.name.length > 7 ? (
                      <Tooltip
                        title={item.name}
                        placement="top-start"
                        disabled={true}
                      >
                        <Typography
                          sx={{
                            fontSize: "12px",
                            textAlign: "center",
                            mt: 0.7,
                          }}
                        >
                          {_.truncate(item.name, { length: 7, omission: "" })}
                          {item.name.length > 7 ? "..." : ""}
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Typography
                        sx={{
                          fontSize: "12px",
                          textAlign: "center",
                          mt: 0.7,
                        }}
                      >
                        {item?.name}
                      </Typography>
                    )}
                    <Typography sx={{ textAlign: "center" }}>
                      {item.boardName}-{item.class}
                    </Typography>
                  </Box>
                </Grid>
              )) */}

          {Array.isArray(userInfo?.otheruser) &&
            userInfo?.otheruser?.map((item) => (
              <Grid item xs={4} sx={{ my: 1 }} key={item.id}>
                <Box
                  sx={{
                    width: "70px",
                    m: "auto",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleLoginOtherUser(item.id);
                    setIsOpen(false);
                  }}
                >
                  <Box
                    sx={{
                      width: "40px",
                      height: "40px",
                      borderRadius: " 40px",
                      mt: 1,
                      marginX: "auto",
                    }}
                  >
                    <CustomAvatar
                      src={item?.avatar}
                      alt={item.name}
                      name={item.name}
                    />
                  </Box>
                  {item.name.length > 7 ? (
                    <Tooltip
                      title={item.name}
                      placement="top-start"
                      disabled={true}
                    >
                      <Typography
                        sx={{
                          fontSize: "12px",
                          textAlign: "center",
                          mt: 0.7,
                        }}
                      >
                        {_.truncate(item.name, { length: 7, omission: "" })}
                        {item.name.length > 7 ? "..." : ""}
                      </Typography>
                    </Tooltip>
                  ) : (
                    <Typography
                      sx={{
                        fontSize: "12px",
                        textAlign: "center",
                        mt: 0.7,
                      }}
                    >
                      {item?.name}
                    </Typography>
                  )}
                  <Typography sx={{ textAlign: "center", fontSize: "14px" }}>
                    {item.boardName}-{item.class}
                  </Typography>
                </Box>
              </Grid>
            ))}

          {userInLength < 4 && (
            <Grid item xs={4} sx={{ mt: 1 }}>
              <Box
                sx={{
                  width: "70px",
                  mt: 1,
                }}
                onClick={navigateCreateAccountfun}
              >
                <Box
                  sx={{
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    bgcolor: "primary.main",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                    color: "white",
                    m: "auto",
                  }}
                >
                  <AddIcon />
                </Box>

                <Typography
                  sx={{
                    fontSize: "12px",
                    textAlign: "center",
                    mt: 0.7,
                  }}
                >
                  ADD
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        {/*userInLength > 3 && (
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Box
              sx={{
                borderRadius: "50%",
                width: "27px",
                height: "27px",
                bgcolor: "primary.lighter",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                color: "primary.main",
                m: "auto",
              }}
              onClick={() => setisVisible(!isVisible)}
            >
              {!isVisible ? (
                studentLoader || registerLoader ? (
                  <CircularProgress color="inherit" size={10} />
                ) : (
                  <KeyboardArrowDownIcon
                    sx={{
                      width: "22px",
                      height: "22px",
                    }}
                  />
                )
              ) : studentLoader || registerLoader ? (
                <CircularProgress color="inherit" size={10} />
              ) : (
                <KeyboardArrowDownIcon
                  sx={{
                    width: "22px",
                    height: "22px",
                  }}
                />
              )}
            </Box>
          </Box>
        ) */}
      </Stack>
      <NavSectionVertical data={filteredData} />
      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_DASHBOARD },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV.W_DASHBOARD,
              bgcolor: "transparent",
              borderRightStyle: "dashed",
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              width: NAV.W_DASHBOARD,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
