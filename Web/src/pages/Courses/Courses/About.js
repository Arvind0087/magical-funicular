import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import ConfirmDialog from "./paymentPopup";
import CouponPopup from "./CouponPopup";
import arrow from "../../../assets/images/arrow.png";
import download from "../../../assets/images/download.png";
import Call from "../../../assets/images/Call.png";
import validity from "../../../assets/images/validity.png";
import { getTestInstructionAsync } from "../../../redux/async.api";
import { voucherByUserIdAsync } from "redux/syllabus/syllabus.async";
import AccordianCard from "components/accordion/AccordianCard";
import { LoadingButton } from "@mui/lab";
import {
  initPaymentphonepayAsync,
  verifyphonepayPaymentAsync,
} from "../../../redux/payment/phonepe.async";
import UserForm from "pages/components/forms/UserForm";
import DemoClass from "./DemoClass";
import ProductOffering from "./ProductOffering";
import coupan from "../../../assets/images/coupon.png";

function About({ getCoursePackageById }) {
  const theme = useTheme();
  let packageDescription = [];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openCoupon, setOpenCoupon] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({});
  const [checkedData, setCheckedData] = useState("");
  const [isApplied, setIsApplied] = useState("");

  const { initiatePaymentLoader, initiatePayment } = useSelector(
    (state) => state?.phonepe
  );
  const { testinstruction } = useSelector((state) => state?.test);

  const { helpLineNumber, helpEmail } = testinstruction;

  if (getCoursePackageById && getCoursePackageById.package_description) {
    try {
      packageDescription = JSON.parse(getCoursePackageById.package_description);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }
  useEffect(() => {
    dispatch(
      getTestInstructionAsync({
        type: "view",
      })
    );
  }, []);

  const proceedToStartPay = (pack) => {
    const currentPrice = discountedPrice
      ? discountedPrice
      : pack?.package_selling_price;

    setPaymentDetails(pack);

    if (pack?.addressForm == 1) {
      setOpenConfirm(true);
    } else {
      const payload = {
        packageId: pack?.id,
        subscriptionId: "",
        amount: currentPrice,
        type: "coursePackage",
        batchTypeId: pack?.batchTypeId,
      };

      dispatch(initPaymentphonepayAsync(payload)).then((res) => {
        if (res?.payload?.status == 200) {
          const url = res?.payload?.data?.url;
          // window.location.href = url;

          {
            /*dispatch(
            verifyphonepayPaymentAsync({
              merchantTransactionId:
                res?.payload?.responseData?.merchantTransactionId,
            })
          ); */
          }
        }
      });
    }
  };

  const proceedToPay = (pack) => {
    const payload = {
      packageId: pack?.id,
      subscriptionId: "",
      amount: pack?.package_selling_price,
      type: "coursePackage",
      batchTypeId: pack?.batchTypeId,
    };

    dispatch(initPaymentphonepayAsync(payload)).then((res) => {
      if (res?.payload) {
        const merchantId = res?.payload?.responseData?.merchantId;
        const url =
          res?.payload?.responseData?.instrumentResponse?.redirectInfo?.url;
        // window.open(url, "_blank");
        window.location.href = url;

        {
          /*dispatch(
          verifyphonepayPaymentAsync({
            merchantTransactionId:
              res?.payload?.responseData?.merchantTransactionId,
          })
        ); */
        }
      }
    });
  };

  const handleClick = (val) => {
    if (val === "call") {
      window.open(`tel:+91${helpLineNumber}`);
    }
  };

  // useEffect(() => {
  //   let payload = {
  //     packageId: getCoursePackageById?.id,
  //     searchVoucher: searchVal,
  //   };
  //   dispatch(voucherByUserIdAsync(payload));
  // }, []);

  const applyHandler = (val) => {
    if (val == "apply") {
      setOpenCoupon(true);
    }
  };

  return (
    packageDescription?.length > 0 && (
      <Box sx={{ mt: 4 }}>
        <Box
          sx={{
            width: "90%",
            height: "auto",
            backgroundColor: "#F9F9F9",
            padding: "15px",
            border: "1px solid #F26B35",
            borderRadius: "4px",
          }}
        >
          {packageDescription?.length > 0 &&
            packageDescription?.map((item) => {
              return (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <img src={arrow} alt="" width="15px" height="15px" />
                  <Typography
                    sx={{
                      fontSize: "14px",
                      lineHeight: "24px",
                      color: "#67696C",
                      lineHeight: "30px",
                    }}
                  >
                    {item}
                  </Typography>
                </Box>
              );
            })}
        </Box>

        {packageDescription?.length > 0 && (
          <Box sx={{ mt: 4, width: "90%" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Button
                  sx={{
                    background: "linear-gradient(to right, #F26B35, #FEE140)",
                    width: "100%",
                    color: "#fff",
                    padding: "10px 5px",
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                  onClick={() =>
                    window.open(
                      getCoursePackageById?.package_brochure,
                      "_blank"
                    )
                  }
                >
                  <img
                    src={download}
                    alt="download"
                    width="20px"
                    height="20px"
                  />
                  Download Brochure
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: "flex" }}>
                  <Button
                    sx={{
                      background: "linear-gradient(to right, #1C9544, #1C9544)",
                      width: "100%",
                      color: "#000",
                      padding: "10px 5px",
                      color: "#fff",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      pl: 2,
                      pr: 2,
                      justifyContent: "space-between",
                      gap: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img
                        src={Call}
                        alt="download"
                        width="20px"
                        height="20px"
                        onClick={() => handleClick("call")}
                      />{" "}
                      <Typography sx={{ fontSize: "12px" }}>
                        For admission Enquiry
                      </Typography>
                    </Box>
                    <Typography
                      sx={{ fontSize: "12px" }}
                      onClick={() => handleClick("call")}
                    >
                      CALL NOW
                    </Typography>
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  sx={{
                    background: "linear-gradient(to right, #098A4E, #9ADD00)",
                    width: "100%",
                    color: "#000",
                    padding: "10px 5px",
                    color: "#fff",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    pl: 2,
                    pr: 2,
                    justifyContent: "space-between",
                    gap: 1,
                    pointerEvents: "none",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <img
                      src={validity}
                      alt="validity"
                      width="20px"
                      height="20px"
                    />{" "}
                    <Typography sx={{ fontSize: "12px" }}>Validity</Typography>
                  </Box>
                  <Typography sx={{ fontSize: "12px" }}>
                    {getCoursePackageById?.package_duration} Months
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {getCoursePackageById?.prodOffers?.length > 0 && (
          <ProductOffering getCoursePackageById={getCoursePackageById} />
        )}

        {getCoursePackageById?.demoVideo?.length > 0 && (
          <DemoClass getCoursePackageById={getCoursePackageById} />
        )}

        {getCoursePackageById?.faq?.length > 0 && (
          <>
            <Typography variant="h5" sx={{ mt: 5, mb: 3 }}>
              Frequently{" "}
              <span style={{ color: "#F26B34" }}>asked questions</span>
            </Typography>
            <Box sx={{ width: "90%" }}>
              <AccordianCard getCourseFaq={getCoursePackageById?.faq} />
            </Box>
          </>
        )}

        {!getCoursePackageById?.isPurchased && (
          <Box
            sx={{
              width: { xs: "90%", sm: "50%" },
              height: "auto",
              // backgroundColor: "#41AA30",
              margin: "20px auto",
              marginLeft: { xs: "0px", sm: "auto" },
              borderRadius: "12px",
              padding: "15px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                // border: "1px solid #ccc",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <img src={coupan} alt="coupan" width="30px" />
                <Typography sx={{ fontWeight: 600, fontSize: "18px", ml: 1 }}>
                  Apply Coupons
                </Typography>
                {checkedData && isApplied && (
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "12px",
                      color: "#31a139",
                      ml: 2,
                    }}
                  >
                    {checkedData} Applied
                  </Typography>
                )}
              </Box>

              <Box sx={{ ml: 4 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    if (isApplied) {
                      setCheckedData([]);
                      setIsApplied(false);
                    } else {
                      setOpenCoupon(true);
                    }
                  }}
                >
                  {isApplied ? "Remove" : "Apply"}
                </Button>
              </Box>

              {/*discountedPrice ? (
                <Box sx={{ ml: 8 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setOpenCoupon(true)}
                  >
                    Apply
                  </Button>
                </Box>
              ) : (
                <Box sx={{ ml: 8 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setOpenCoupon(true)}
                  >
                    Apply
                  </Button>
                </Box>
              )*/}
            </Box>
          </Box>
        )}

        {!getCoursePackageById?.isPurchased && (
          <Box
            sx={{
              width: { xs: "90%", sm: "50%" },
              height: "110px",
              backgroundColor: "#41AA30",
              margin: "20px auto",
              marginLeft: { xs: "0px", sm: "auto" },
              borderRadius: "12px",
              padding: "15px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "50%",
                height: "80px",
                borderRight: "1px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{ fontSize: "20px", fontWeight: "600", color: "#fff" }}
              >
                Price ₹
                {discountedPrice
                  ? discountedPrice
                  : getCoursePackageById?.package_selling_price}{" "}
                <span
                  style={{
                    textDecoration: "line-through",
                    fontSize: "16px",
                    opacity: "0.8",
                  }}
                >
                  ₹{getCoursePackageById?.package_price}
                </span>
              </Typography>
            </Box>
            <Box
              sx={{
                width: "50%",
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                sx={{
                  color: "#fff",
                  background: "linear-gradient(to right, #F26B35, #FEE140)",
                  fontSize: "16px",
                  padding: "7px 20px",
                }}
                onClick={() => proceedToStartPay(getCoursePackageById)}
              >
                Buy Course
              </Button>
            </Box>
          </Box>
        )}

        {openCoupon && (
          <CouponPopup
            open={openCoupon}
            onClose={() => setOpenCoupon(false)}
            getCoursePackageById={getCoursePackageById}
            setDiscountedPrice={setDiscountedPrice}
            setCheckedData={setCheckedData}
            checkedData={checkedData}
            setIsApplied={setIsApplied}
            isApplied={isApplied}
          />
        )}

        {openConfirm && (
          <ConfirmDialog
            open={openConfirm}
            onClose={() => setOpenConfirm(false)}
            content={
              <UserForm
                paymentDetails={paymentDetails}
                discountedPrice={discountedPrice}
              />
            }
          />
        )}
      </Box>
    )
  );
}

export default About;
