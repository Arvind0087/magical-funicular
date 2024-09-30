import React, { useState } from "react";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import { getStudentAllOrderBytIdAsync } from "redux/async.api";
import { useEffect } from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import CustomComponentLoader from "components/CustomComponentLoader";
import { useSettingsContext } from "../components/settings";
import InvoicePDF from "./InvoicePDF";

const OrderDetail = () => {
  const { themeStretch } = useSettingsContext();
  const theme = useTheme();
  const moment = require("moment");
  const dispatch = useDispatch();
  const [showDetail, setShowDetail] = useState([]);
  const { studentById = [] } = useSelector((state) => state?.student);
  const { getStudentAllOrderBytIdLoader, getStudentAllOrderBytIdData = [] } =
    useSelector((state) => state?.orderDetail);
  const { getOnlySiteSettingData = [] } = useSelector(
    (state) => state.getOnlySiteSetting
  );
  const { siteLogo, siteAuthorName } = getOnlySiteSettingData;

  useEffect(() => {
    const payload = { userId: studentById?.id };
    dispatch(getStudentAllOrderBytIdAsync({}));
  }, []);

  const handleShowDeatil = (item) => {
    if (showDetail.includes(item.id)) {
      setShowDetail(showDetail.filter((value) => value !== item.id));
    } else {
      setShowDetail([...showDetail, item.id]);
    }
  };

  return (
    <>
      {getStudentAllOrderBytIdLoader ? (
        <>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              color: "primary.main",
              mt: 40,
            }}
          >
            <CustomComponentLoader padding="0" size={50} />
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ mt: 3 }}>
            <Container maxWidth={themeStretch ? false : "lg"}>
              <Typography variant="h4">Order History</Typography>
              {getStudentAllOrderBytIdData?.length > 0 ? (
                getStudentAllOrderBytIdData?.map((item, index) => {
                  return (
                    <Card
                      key={index}
                      sx={{
                        p: 3,
                        mt: 3,
                        [theme.breakpoints.down("md")]: { paddingInline: 3 },
                      }}
                    >
                      <Grid
                        container
                        xs={12}
                        md={5}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          height: "80px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleShowDeatil(item)}
                      >
                        <Grid item xs={4}>
                          <img
                            src={siteLogo}
                            alt={siteAuthorName}
                            width={"120px"}
                            // height={"100%"}
                          />
                        </Grid>
                        <Grid item xs={7.5} sx={{ pt: 1 }}>
                          <Typography
                            sx={{ fontSize: "17px", fontWeight: "600" }}
                          >
                            {item?.title}
                          </Typography>
                          <Typography>
                            Purchase Date:{" "}
                            <span style={{ fontSize: "15px", fontWeight: 600 }}>
                              {moment(item?.purchaseDate)
                                .utc()
                                .format("Do MMM YYYY")}
                            </span>
                          </Typography>
                        </Grid>
                      </Grid>
                      <Box
                        sx={{ mt: 3 }}
                        display={
                          showDetail.includes(item.id) ? "block" : "none"
                        }
                      >
                        <Grid
                          container
                          spacing={2}
                          sx={{
                            alignItems: "center",
                            mb: 3,
                            display: "flex",
                            justifyContent: "space-between",
                            [theme.breakpoints.down("md")]: { mb: 0 },
                          }}
                        >
                          <Grid
                            container
                            xs={12}
                            md={2}
                            lg={2.4}
                            spacing={1}
                            sx={{
                              direction: "flex",
                              flexDirection: "column",
                              [theme.breakpoints.down("md")]: {
                                flexDirection: "row",
                              },
                            }}
                          >
                            <Grid
                              item
                              xs={6}
                              md={12}
                              lg={12}
                              sx={{
                                textAlign: "center",
                                [theme.breakpoints.down("md")]: {
                                  textAlign: "left",
                                },
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "17px", fontWeight: "600" }}
                              >
                                Order Id
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={6}
                              md={12}
                              lg={12}
                              sx={{
                                textAlign: "center",
                                [theme.breakpoints.down("md")]: {
                                  textAlign: "right",
                                },
                              }}
                            >
                              <Typography sx={{ height: "23px" }}>
                                {item?.orderId}
                              </Typography>
                            </Grid>
                          </Grid>
                          {/* <Grid container xs={12} md={2} lg={2} spacing={1} sx={{
                      direction: "flex", flexDirection: "column",
                      [theme.breakpoints.down('md')]: { flexDirection: "row" }
                    }}>
                      <Grid item xs={6} md={12} lg={12} sx={{ textAlign: "center", [theme.breakpoints.down('md')]: { textAlign: "left" } }}>
                        <Typography sx={{ fontSize: "17px", fontWeight: "600" }}>Date of Purchase</Typography>
                      </Grid>
                      <Grid item xs={6} md={12} lg={12} sx={{ textAlign: "center", [theme.breakpoints.down('md')]: { textAlign: "right" } }}>
                        <Typography> {moment(item?.purchaseDate).utc().format("Do MMM YYYY")}</Typography>
                      </Grid>
                    </Grid> */}
                          <Grid
                            container
                            xs={12}
                            md={2}
                            lg={2.4}
                            spacing={1}
                            sx={{
                              direction: "flex",
                              flexDirection: "column",
                              [theme.breakpoints.down("md")]: {
                                flexDirection: "row",
                              },
                            }}
                          >
                            <Grid
                              item
                              xs={6}
                              md={12}
                              lg={12}
                              sx={{
                                textAlign: "center",
                                [theme.breakpoints.down("md")]: {
                                  textAlign: "left",
                                },
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "17px", fontWeight: "600" }}
                              >
                                Total Amount
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={6}
                              md={12}
                              lg={12}
                              sx={{
                                textAlign: "center",
                                [theme.breakpoints.down("md")]: {
                                  textAlign: "right",
                                },
                              }}
                            >
                              <Typography sx={{ height: "23px" }}>
                                {item?.amount}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            xs={12}
                            md={2}
                            lg={2.4}
                            spacing={1}
                            sx={{
                              direction: "flex",
                              flexDirection: "column",
                              [theme.breakpoints.down("md")]: {
                                flexDirection: "row",
                              },
                            }}
                          >
                            <Grid
                              item
                              xs={6}
                              md={12}
                              lg={12}
                              sx={{
                                textAlign: "center",
                                [theme.breakpoints.down("md")]: {
                                  textAlign: "left",
                                },
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "17px", fontWeight: "600" }}
                              >
                                Mode of Payment
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={6}
                              md={12}
                              lg={12}
                              sx={{
                                textAlign: "center",
                                [theme.breakpoints.down("md")]: {
                                  textAlign: "right",
                                },
                              }}
                            >
                              <Typography sx={{ height: "23px" }}>
                                {item?.paymentMode ? item?.paymentMode : "NA"}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            xs={12}
                            md={2}
                            lg={2.4}
                            spacing={1}
                            sx={{
                              direction: "flex",
                              flexDirection: "column",
                              [theme.breakpoints.down("md")]: {
                                flexDirection: "row",
                              },
                            }}
                          >
                            <Grid
                              item
                              xs={6}
                              md={12}
                              lg={12}
                              sx={{
                                textAlign: "center",
                                [theme.breakpoints.down("md")]: {
                                  textAlign: "left",
                                },
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "17px", fontWeight: "600" }}
                              >
                                Auto-Renewal
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={6}
                              md={12}
                              lg={12}
                              sx={{
                                textAlign: "center",
                                [theme.breakpoints.down("md")]: {
                                  textAlign: "right",
                                },
                              }}
                            >
                              <Typography sx={{ height: "23px" }}>
                                {item?.autoRenewal ? item?.autoRenewal : "NA"}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            xs={12}
                            md={2}
                            lg={2.4}
                            spacing={1}
                            sx={{
                              direction: "flex",
                              flexDirection: "column",
                              [theme.breakpoints.down("md")]: {
                                flexDirection: "row",
                              },
                            }}
                          >
                            <Grid
                              item
                              xs={6}
                              md={12}
                              lg={12}
                              sx={{
                                textAlign: "center",
                                [theme.breakpoints.down("md")]: {
                                  textAlign: "left",
                                },
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "17px", fontWeight: "600" }}
                              >
                                Invoice
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={6}
                              md={12}
                              lg={12}
                              sx={{
                                textAlign: "center",
                                [theme.breakpoints.down("md")]: {
                                  textAlign: "right",
                                },
                              }}
                            >
                              {/*<Typography sx={{ height: "23px" }}>
                                {item?.invoice ? item?.invoice : "NA"}
                              </Typography> */}
                              <InvoicePDF
                                orderData={{
                                  orderId: item?.orderId,
                                  purchaseDate: item?.purchaseDate,
                                  title: item?.title,
                                  amount: item?.amount,
                                  purchaseDate: item?.purchaseDate,
                                  fullAddress: item?.fullAddress,
                                  userName: item?.userName,
                                  email: item?.email,
                                  invoiceTitle: item?.invoice_title,
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Divider
                          sx={{
                            [theme.breakpoints.down("md")]: {
                              visibility: "hidden",
                            },
                          }}
                        />
                        <Grid
                          container
                          spacing={2}
                          sx={{
                            alignItems: "center",
                            mt: 3,
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Grid
                            container
                            xs={12}
                            md={5}
                            lg={5}
                            spacing={1}
                            sx={{
                              direction: "flex",
                              flexDirection: "column",
                              textAlign: "center",
                            }}
                          >
                            <Grid
                              item
                              xs={12}
                              md={12}
                              lg={12}
                              sx={{ textAlign: "center" }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "17px",
                                  fontWeight: "600",
                                  width: "100%",
                                }}
                              >
                                Veda Academy Essential - K12 Learning Pack 1
                                Month
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={12}
                              lg={12}
                              sx={{ textAlign: "center" }}
                            >
                              <Typography sx={{ height: "23px" }}>
                                Started from:{" "}
                                <span
                                  style={{ fontSize: "15px", fontWeight: 600 }}
                                >
                                  {moment(item?.purchaseDate)
                                    .utc()
                                    .format("Do MMM YYYY")}
                                </span>
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            xs={12}
                            md={3}
                            lg={3}
                            spacing={1}
                            sx={{
                              direction: "flex",
                              flexDirection: "column",
                              [theme.breakpoints.down("md")]: {
                                flexDirection: "row",
                                mt: 1,
                              },
                            }}
                          >
                            <Grid
                              item
                              xs={6}
                              md={12}
                              lg={12}
                              sx={{
                                textAlign: "center",
                                [theme.breakpoints.down("md")]: {
                                  textAlign: "left",
                                },
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "17px", fontWeight: "600" }}
                              >
                                Class
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={6}
                              md={12}
                              lg={12}
                              sx={{
                                textAlign: "center",
                                [theme.breakpoints.down("md")]: {
                                  textAlign: "right",
                                },
                              }}
                            >
                              <Typography
                                sx={{ height: "23px" }}
                              >{`${item?.className}`}</Typography>
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            xs={12}
                            md={2}
                            lg={2}
                            spacing={1}
                            sx={{
                              direction: "flex",
                              flexDirection: "column",
                              [theme.breakpoints.down("md")]: {
                                flexDirection: "row",
                              },
                            }}
                          >
                            <Grid
                              item
                              xs={6}
                              md={12}
                              lg={12}
                              sx={{
                                textAlign: "center",
                                [theme.breakpoints.down("md")]: {
                                  textAlign: "left",
                                },
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "17px", fontWeight: "600" }}
                              >
                                Validity
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={6}
                              md={12}
                              lg={12}
                              sx={{
                                textAlign: "center",
                                [theme.breakpoints.down("md")]: {
                                  textAlign: "right",
                                },
                              }}
                            >
                              <Typography sx={{ height: "23px" }}>
                                {item?.validity
                                  ? moment(item?.validity)
                                      .utc()
                                      .format("Do MMM YYYY")
                                  : "NA"}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            xs={12}
                            md={2}
                            lg={2}
                            spacing={1}
                            sx={{
                              direction: "flex",
                              flexDirection: "column",
                              [theme.breakpoints.down("md")]: {
                                flexDirection: "row",
                              },
                            }}
                          >
                            <Grid
                              item
                              xs={6}
                              md={12}
                              lg={12}
                              sx={{
                                textAlign: "center",
                                [theme.breakpoints.down("md")]: {
                                  textAlign: "left",
                                },
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "17px", fontWeight: "600" }}
                              >
                                Status
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={6}
                              md={12}
                              lg={12}
                              sx={{
                                textAlign: "center",
                                display: "flex",
                                justifyContent: "center",
                                [theme.breakpoints.down("md")]: {
                                  textAlign: "right",
                                  justifyContent: "right",
                                },
                              }}
                            >
                              <Typography>{item?.status}</Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    </Card>
                  );
                })
              ) : (
                <>
                  <Box
                    sx={{
                      width: "100%",
                      textAlign: "center",
                      marginTop: "80px",
                    }}
                  >
                    <Typography variant="h5">No Data Found</Typography>
                  </Box>
                </>
              )}
            </Container>
          </Box>
        </>
      )}
    </>
  );
};
export default OrderDetail;
