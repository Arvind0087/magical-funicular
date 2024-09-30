import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import useResponsive from "hooks/useResponsive";
import Scrollbar from "components/scrollbar";
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
import { addUserSpendTimeAsync } from "redux/async.api";
import AddIcon from "@mui/icons-material/Add";

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

  const navigateCreateAccountfun = () => {
    navigate(PATH_AUTH.createAccount);
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

  return (
    <>
      {openNav && (
        <Box
          sx={{
            flexShrink: { lg: 0 },
          }}
        >
          <Grid
            container
            sx={{
              position: "absolute",
              zIndex: "2333",
              bgcolor: "primary.lighter",
              width: "230px",
              mt: "5px",
              ml: 1,
              borderRadius: "10px",
            }}
          >
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
        </Box>
      )}
    </>
  );
}
