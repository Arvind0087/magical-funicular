import {
  Button,
  CircularProgress,
  Container,
  Typography,
  Box,
} from "@mui/material";
import { config } from "config/config";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getPaymentStatusAsync } from "redux/PaymentStatus";
import success from "../../assets/paymentStatus/succeess.gif";
import pending from "../../assets/paymentStatus/pending.gif";
import failed from "../../assets/paymentStatus/failed.gif";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import moment from "moment";

const PaymentResponse = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const ref_id = query.get("ref_id");
  const token = query.get("token");

  const { paymentstatusLoader, paymentstatus } = useSelector(
    (state) => state.paymentstatus
  );

  const statusGIF = {
    success: success,
    error: failed,
    pending: pending,
  };

  useEffect(() => {
    var back_to_home = document.getElementById("back_to_home");
    var view_order_details = document.getElementById("view_order_details");

    if (back_to_home) {
      back_to_home.addEventListener(
        "click",
        () => {
          console.log("back_to_home");
          window.ReactNativeWebView &&
            window.ReactNativeWebView.postMessage("back_to_home");
        },
        false
      );
    }
    if (view_order_details) {
      view_order_details.addEventListener(
        "click",
        () => {
          console.log("view_order_details");
          window.ReactNativeWebView &&
            window.ReactNativeWebView.postMessage("view_order_details");
        },
        false
      );
    }
  }, []);

  useMemo(() => {
    dispatch(getPaymentStatusAsync({ ref_id, token: token }));
  }, []);

  const orderInfo = [
    {
      label: "Order Id",
      value: paymentstatus?.order_id,
    },
    {
      label: "Date of Purchase",
      value: moment(paymentstatus?.date_of_purchase).format("DD MMM YYYY"),
    },
    {
      label: "Total Amount",
      value: `₹ ${paymentstatus?.total_amount}`,
    },
  ];

  return (
    <>
      {paymentstatusLoader && (
        <Container
          sx={{
            height: "100vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <CircularProgress size={40} sx={{ color: "#000" }} />
          <Typography sx={{ mt: "20px", fontFamily: config.fontFamily }}>
            Wait We Are Getting Your Payment Information...
          </Typography>
        </Container>
      )}
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            mt: "130px",
          }}
        >
          <Box>
            <img
              src={statusGIF[paymentstatus?.payment_status]}
              alt="Payment Success"
              width="100%"
              height="100%"
            />
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: 600,
                fontSize: "18px",
                lineHeight: "24px",
                textAlign: "center",
                color: "#787A8D",
                zIndex: 3,
                mt: 4,
              }}
            >
              {paymentstatus?.message}
            </Typography>
          </Box>
          <Box
            sx={{
              columnGap: "40px",
              mt: "50px",
            }}
          >
            {orderInfo.map((item) => {
              return (
                <Box
                  sx={{
                    display: "flex",
                    columnGap: "20px",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "30px",
                      alignContent: "center",
                      color: "#787A8D",
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "30px",
                      alignContent: "center",
                      color: "#787A8D",
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              );
            })}
          </Box>
          <Box sx={{ mt: "10px" }}>
            <Typography
              id="view_order_details"
              sx={{
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: 600,
                FontSize: "14px",
                lineHeight: "17px",
                alignContent: "center",
                color: "#FF8331",
                mt: 3,
                cursor: "pointer",
              }}
            >
              View Order Details
            </Typography>
          </Box>
          <Box sx={{ mt: "50px" }}>
            <Button
              id="back_to_home"
              variant="contained"
              sx={{
                bgcolor: "#FF8331",
                borderRadius: 30,
                padding: "10px 36px",
                gap: "8px",
                zIndex: 5,
                ":hover": {
                  bgcolor: "#FF8331",
                },
              }}
              startIcon={<KeyboardBackspaceIcon />}
            >
              Back to Home
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default PaymentResponse;
