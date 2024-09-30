import {
  Box,
  Container,
  Button,
  Card,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useSettingsContext } from "../../components/settings";
import {
  getBatchStartDateByBatchTypeIdAsync,
  getBatchTypeByClassIdAsync,
  getBatchTypeByClassIdForWebAppAsync,
  getClassByBatchIdAsync,
  getFinalPackagePriceByAllIdAsync,
  getProductByIdAsync,
  getCoursebystudentidAsync,
  initiatePaymentAsync,
  getPackageByUserIdAsync,
} from "../../../src/redux/async.api";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ConfirmDialog from "./paymentPopup";
import { Helmet } from "react-helmet-async";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router";
import { LoadingButton } from "@mui/lab";
import { emptysubscription } from "redux/slices/subscription.slice";

const Subscription = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const moment = require("moment");
  const theme = useTheme();
  const { themeStretch } = useSettingsContext();
  const {
    productDetails = [],
    allDropdownData = [],
    allPackageLoader,
    getAllPackage,
  } = useSelector((state) => state.subscription);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [allDropdownValue, setAllDropdownValue] = useState([]);
  const [packageDetails, setPackageDetails] = useState({});
  const [courseByStudent, setCourseByStudent] = useState({});
  const [showPackages, setShowPackages] = useState(false);
  const { getOnlySiteSettingData = [] } = useSelector(
    (state) => state.getOnlySiteSetting
  );
  const { initialPaymentLoader, initialPayment = [] } = useSelector(
    (state) => state.packages
  );

  const { siteTitle } = getOnlySiteSettingData;
  useEffect(() => {
    dispatch(getCoursebystudentidAsync()).then((res) => {
      const { payload } = res || {};
      const { status, data } = payload || {};
      if (status === 200) {
        setCourseByStudent(data);
        dispatch(getProductByIdAsync(data?.id));
      }
    });
    dispatch(emptysubscription());
  }, []);

  useEffect(() => {
    dispatch(getPackageByUserIdAsync({}));
  }, []);

  const classHandler = (e, product, index) => {
    const payload = {
      courseId: product?.courseId,
      packageId: product?.packageId,
      boardId: e.target?.value,
      index: index,
    };
    const indexPayload = {
      board: e.target?.value,
      class: null,
      batchType: null,
      batchStartDate: null,
      packageData: null,
    };
    const containerData = [...allDropdownValue];
    containerData[index] = indexPayload;
    setAllDropdownValue(containerData);
    dispatch(getClassByBatchIdAsync(payload));
  };

  const batchTypeHandler = (e, product, index) => {
    const payload = {
      courseId: product?.courseId,
      packageId: product?.packageId,
      boardId: allDropdownValue[index]?.board,
      classId: e.target.value,
      index: index,
    };
    const indexPayload = {
      board: allDropdownValue[index]?.board,
      class: e.target?.value,
      batchType: null,
      batchStartDate: null,
      packageData: null,
    };
    const containerData = [...allDropdownValue];
    containerData[index] = indexPayload;
    setAllDropdownValue(containerData);
    dispatch(getBatchTypeByClassIdAsync(payload));
    // dispatch(getBatchTypeByClassIdForWebAppAsync(payload))
  };

  const batchStartDateHanlder = (e, product, index) => {
    const payload = {
      courseId: product?.courseId,
      packageId: product?.packageId,
      boardId: allDropdownValue[index]?.board,
      classId: allDropdownValue[index]?.class,
      batchTypeId: e.target.value,
      index: index,
    };
    const indexPayload = {
      board: allDropdownValue[index]?.board,
      class: allDropdownValue[index]?.class,
      batchType: e.target?.value,
      batchStartDate: null,
      packageData: null,
    };
    const containerData = [...allDropdownValue];
    containerData[index] = indexPayload;
    setAllDropdownValue(containerData);
    dispatch(getBatchStartDateByBatchTypeIdAsync(payload));
  };

  const finalPackageHanlder = (e, product, index) => {
    const payload = {
      courseId: product?.courseId,
      packageId: product?.packageId,
      boardId: allDropdownValue[index]?.board,
      classId: allDropdownValue[index]?.class,
      batchTypeId: allDropdownValue[index]?.batchType,
      batchStartDateId: e.target.value,
      index: index,
    };
    const indexPayload = {
      board: allDropdownValue[index]?.board,
      class: allDropdownValue[index]?.class,
      batchType: allDropdownValue[index]?.batchType,
      batchStartDate: e.target?.value,
      packageData: null,
    };
    const containerData = [...allDropdownValue];
    containerData[index] = indexPayload;
    setAllDropdownValue(containerData);
    dispatch(getFinalPackagePriceByAllIdAsync(payload));
  };

  const addOrderHandler = (packageDetails) => {
    setPackageDetails(packageDetails);
    setOpenConfirm(true);
  };

  const proceedToPay = (packageDetails, item) => {
    const payload = {
      packageId: item?.packageId,
      subscriptionId: packageDetails?.id,
      amount: packageDetails?.monthlyDiscountedPrice,
      type: "Package",
    };
    dispatch(initiatePaymentAsync(payload)).then((res) => {
      const { payload } = res || {};
      const { status, data } = payload || {};
      if (status === 200) {
        let link = data;
        window.open(`${link}`, "_blank");
        navigate("/app/dashboard");
      }
    });
  };
  const handleNavBackPage = () => {
    navigate(-1);
  };

  console.log("getAllPackage......", getAllPackage);

  return (
    <>
      <Helmet>
        <title>Subscription | {`${siteTitle}`}</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Box sx={{ display: "flex", alignItems: "left" }}>
          <KeyboardBackspaceIcon
            sx={{ color: "primary.main" }}
            onClick={handleNavBackPage}
          />
        </Box>
        <Typography variant="h4">Start Learning</Typography>
        <Grid container sx={{ mb: 4 }}>
          <Grid
            item
            xs={12}
            md={5}
            onClick={() => setShowPackages(!showPackages)}
          >
            <Box sx={{ p: 1 }}>
              <Card
                sx={{
                  padding: "15px",
                  bgcolor: "primary.light",
                  color: "white",
                }}
              >
                <Typography sx={{ fontSize: "19px", fontWeight: "600" }}>
                  {courseByStudent?.courseName}
                </Typography>
                <Typography
                  sx={{ fontSize: "17px", fontWeight: "600" }}
                  dangerouslySetInnerHTML={{
                    __html: courseByStudent?.description,
                  }}
                ></Typography>
              </Card>
            </Box>
          </Grid>
        </Grid>
        <>
          {showPackages ? (
            <>
              {productDetails.length > 0 ? (
                productDetails?.map((item, index) => {
                  let listIs = [];
                  try {
                    listIs = JSON?.parse(item?.list);
                  } catch {
                    listIs = [];
                  }
                  return (
                    <Box sx={{ mt: 5, p: 2 }} boxShadow={12} key={index}>
                      <Typography variant="h5" sx={{ pb: 2 }}>
                        Showing Packages For
                      </Typography>
                      <Card sx={{ p: "15px" }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "19px",
                              fontWeight: "600",
                              color: "primary.main",
                            }}
                          >
                            {item?.packageName} - {item?.courseName}
                          </Typography>
                          {item?.tag && (
                            <Box
                              minWidth="130px"
                              height="45px"
                              sx={{
                                backgroundColor: "primary.main",
                                color: "#fff",
                                borderRadius: "60px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                p: 1.2,
                              }}
                            >
                              {item?.tag}
                            </Box>
                          )}
                        </Box>

                        <Grid container>
                          <Grid container md={9.5} spacing={3} sx={{ pb: 2 }}>
                            {listIs &&
                              listIs?.map((listItem, listIndex) => (
                                <Grid item key={listIndex} md={6}>
                                  <Typography sx={{ py: 1 }}>
                                    <FiberManualRecordIcon
                                      sx={{
                                        color: "primary.main",
                                        fontSize: "15px",
                                      }}
                                    />{" "}
                                    &nbsp;{listItem}
                                  </Typography>
                                </Grid>
                              ))}
                          </Grid>
                          <Grid
                            md={2.5}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              ml: 2.5,
                              pb: { xs: 3, md: 0 },
                            }}
                          >
                            <Typography variant="h6">
                              Starting from ₹{item?.startingPrice}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ pb: 2 }}>
                          <Grid item key={index} md={3} sm={6} xs={12}>
                            <FormControl fullWidth>
                              <Select
                                displayEmpty
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                onChange={(e) => classHandler(e, item, index)}
                                value={allDropdownValue[index]?.board}
                                placeholder="Select Batch"
                              >
                                {item?.boards?.length === 0 && (
                                  <MenuItem value="" disabled>
                                    Select Batch
                                  </MenuItem>
                                )}
                                {item?.boards &&
                                  item?.boards?.map((itemBoard, boardIndex) => (
                                    <MenuItem
                                      value={itemBoard?.id}
                                      key={boardIndex}
                                    >
                                      {itemBoard?.name}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item key={index} md={3} sm={6} xs={12}>
                            <FormControl fullWidth>
                              <Select
                                displayEmpty
                                labelId={`demo-class-${index}`}
                                id={`demo-class-${index}`}
                                onChange={(e) =>
                                  batchTypeHandler(e, item, index)
                                }
                                value={allDropdownValue[index]?.class}
                                placeholder="Select Class"
                              >
                                {allDropdownData[index]?.class.length === 0 && (
                                  <MenuItem value="" disabled>
                                    Select Class
                                  </MenuItem>
                                )}
                                {allDropdownData[index]?.class &&
                                  allDropdownData[index]?.class?.map(
                                    (itemClass, classIndex) => (
                                      <MenuItem
                                        value={itemClass?.id}
                                        key={classIndex}
                                      >
                                        {itemClass?.name}
                                      </MenuItem>
                                    )
                                  )}
                              </Select>
                            </FormControl>
                          </Grid>

                          {item.packageType === "Batch" && (
                            <Grid item key={index} md={3} sm={6} xs={12}>
                              <FormControl fullWidth>
                                <Select
                                  displayEmpty
                                  labelId={`demo-batchType-${index}`}
                                  id={`demo-batchType-${index}`}
                                  placeholder="Select Batch Type"
                                  onChange={(e) =>
                                    batchStartDateHanlder(e, item, index)
                                  }
                                  value={allDropdownValue[index]?.batchType}
                                >
                                  {allDropdownData[index]?.batchType?.length ===
                                    0 && (
                                    <MenuItem value="" disabled>
                                      Select Batch Type
                                    </MenuItem>
                                  )}
                                  {allDropdownData[index]?.batchType &&
                                    allDropdownData[index]?.batchType?.map(
                                      (itemBoard, boardIndex) => (
                                        <MenuItem
                                          value={itemBoard?.id}
                                          key={boardIndex}
                                        >
                                          {itemBoard?.name}
                                        </MenuItem>
                                      )
                                    )}
                                </Select>
                              </FormControl>
                            </Grid>
                          )}
                          {item.packageType === "Batch" && (
                            <Grid item key={index} md={3} sm={6} xs={12}>
                              <FormControl fullWidth>
                                <Select
                                  displayEmpty
                                  labelId={`demo-batchStartDate-${index}`}
                                  id={`demo-batchStartDate-${index}`}
                                  onChange={(e) =>
                                    finalPackageHanlder(e, item, index)
                                  }
                                  value={
                                    allDropdownValue[index]?.batchStartDate
                                  }
                                  placeholder="Select Batch"
                                >
                                  {allDropdownData[index]?.batchStartDate
                                    ?.length === 0 && (
                                    <MenuItem value="" disabled>
                                      Select Batch
                                    </MenuItem>
                                  )}
                                  {allDropdownData[index]?.batchStartDate &&
                                    allDropdownData[index]?.batchStartDate?.map(
                                      (itemBoard, boardIndex) => (
                                        <MenuItem
                                          value={itemBoard?.id}
                                          key={boardIndex}
                                        >
                                          {moment(itemBoard?.name)
                                            .utc()
                                            .format("Do MMM YYYY")}
                                        </MenuItem>
                                      )
                                    )}
                                </Select>
                              </FormControl>
                            </Grid>
                          )}
                        </Grid>

                        <Grid container spacing={2}>
                          {allDropdownData[index]?.packageData &&
                            allDropdownData[index]?.packageData?.map(
                              (curElem, index) => (
                                <>
                                  <Grid item key={index} sm={6} md={4}>
                                    <Card sx={{ p: "15px" }} boxShadow={12}>
                                      <Typography
                                        sx={{
                                          fontSize: "19px",
                                          fontWeight: "600",
                                          color: "primary.main",
                                        }}
                                      >
                                        {curElem?.name}
                                      </Typography>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <Box sx={{ display: "flex" }}>
                                          <s
                                            style={{
                                              paddingTop: "8px",
                                              paddingBottom: "8px",
                                              fontWeight: "600",
                                              opacity: 0.6,
                                            }}
                                          >
                                            {" "}
                                            <CurrencyRupeeIcon
                                              sx={{ fontSize: "16px", mt: 0.3 }}
                                            />
                                            {curElem?.realPrice}&nbsp;&nbsp;
                                          </s>
                                          <Box sx={{ py: 1, display: "flex" }}>
                                            <CurrencyRupeeIcon
                                              sx={{ fontSize: "16px", mt: 0.3 }}
                                            />
                                            <Typography
                                              sx={{ fontWeight: "600" }}
                                            >
                                              {curElem?.monthlyDiscountedPrice}
                                            </Typography>
                                          </Box>
                                        </Box>
                                        <Button
                                          variant="contained"
                                          onClick={() =>
                                            addOrderHandler(curElem)
                                          }
                                          sx={{
                                            color: "#fff",
                                            borderRadius: "60px",
                                            p: 1.2,
                                          }}
                                        >
                                          Add
                                        </Button>
                                      </Box>
                                    </Card>
                                  </Grid>
                                  <ConfirmDialog
                                    open={openConfirm}
                                    onClose={() => setOpenConfirm(false)}
                                    content={`Total(Inc. of all taxes) ₹${
                                      packageDetails?.realPrice || 0
                                    } `}
                                    action={
                                      <LoadingButton
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        onClick={() =>
                                          proceedToPay(packageDetails, item)
                                        }
                                        sx={{
                                          borderRadius: "60px",
                                          display: "flex",
                                          flexDirection: "row",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          padding: "10px 36px",
                                          height: "44px",
                                          width: "50%",
                                          color: "#ffff",
                                          [theme.breakpoints.down("sm")]: {
                                            width: "100%",
                                          },
                                        }}
                                        loading={initialPaymentLoader}
                                      >
                                        Proceed to Pay
                                      </LoadingButton>
                                    }
                                  />
                                </>
                              )
                            )}
                        </Grid>
                      </Card>

                      {/* {/ Checkout Dailog Box /} */}
                    </Box>
                  );
                })
              ) : (
                <Box
                  sx={{ width: "100%", textAlign: "center", marginTop: "80px" }}
                >
                  <Typography variant="h5">No Package Found</Typography>
                </Box>
              )}
            </>
          ) : null}
        </>
      </Container>
    </>
  );
};

export default Subscription;
