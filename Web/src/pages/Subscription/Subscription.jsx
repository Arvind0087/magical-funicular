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
  InputLabel,
  TextField,
} from "@mui/material";
import moment from "moment";
import CircularProgress from "@mui/material/CircularProgress";
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

  const addOrderHandler = (packageDetails) => {
    setPackageDetails(packageDetails);
    setOpenConfirm(true);
  };

  const proceedToPay = (packageDetails) => {
    const payload = {
      packageId: packageDetails?.packageId,
      subscriptionId: packageDetails?.subscriptionId,
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

  let listItem = [];
  try {
    listItem = JSON?.parse(getAllPackage?.list);
  } catch {
    listItem = [];
  }

  return (
    <>
      <Helmet>
        <title>Subscription | {`${siteTitle}`}</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : "xl"}>
        {allPackageLoader ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 10,
            }}
          >
            <CircularProgress />
          </Box>
        ) : Object.keys(getAllPackage).length > 0 ? (
          <>
            <Box sx={{ display: "flex", alignItems: "left" }}>
              <KeyboardBackspaceIcon
                sx={{ color: "primary.main", cursor: "pointer" }}
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
                      {getAllPackage?.courseName}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "17px", fontWeight: "600" }}
                      dangerouslySetInnerHTML={{
                        __html: getAllPackage?.shortDescription,
                      }}
                    ></Typography>
                  </Card>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ mt: 5, p: 2 }} boxShadow={12}>
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
                    {getAllPackage?.packageName} - {getAllPackage?.courseName}
                  </Typography>

                  {/*getAllPackage?.tag && (
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
                      {getAllPackage?.tag}
                    </Box>
                  )*/}
                </Box>

                <Grid container>
                  <Grid container md={9.5} spacing={3} sx={{ pb: 2 }}>
                    {listItem &&
                      listItem?.map((items, listIndex) => (
                        <Grid item key={listIndex} md={6}>
                          <Typography sx={{ py: 1 }}>
                            <FiberManualRecordIcon
                              sx={{
                                color: "primary.main",
                                fontSize: "15px",
                              }}
                            />{" "}
                            &nbsp;{items}
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
                      Starting from ₹{getAllPackage?.startingPrice}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ pb: 2 }}>
                  <Grid item md={3} sm={6} xs={12}>
                    <FormControl fullWidth>
                      <TextField
                        name="board"
                        label="Board"
                        fullWidth
                        value={getAllPackage?.boardName}
                        sx={{ pointerEvents: "none" }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <FormControl fullWidth>
                      <TextField
                        name="class"
                        label="Class"
                        fullWidth
                        value={getAllPackage?.className}
                        sx={{ pointerEvents: "none" }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <FormControl fullWidth>
                      <TextField
                        name="batch"
                        label="Batch"
                        fullWidth
                        value={getAllPackage?.batchName}
                        sx={{ pointerEvents: "none" }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <FormControl fullWidth>
                      <TextField
                        name="date"
                        label="Date"
                        fullWidth
                        value={moment(getAllPackage?.batchStartDate).format(
                          "DD MMM YYYY"
                        )}
                        sx={{ pointerEvents: "none" }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item sm={6} md={4}>
                    <Card sx={{ p: "15px" }} boxShadow={12}>
                      <Typography
                        sx={{
                          fontSize: "19px",
                          fontWeight: "600",
                          color: "primary.main",
                        }}
                      >
                        {listItem[0]}
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
                            {getAllPackage?.realPrice}&nbsp;&nbsp;
                          </s>
                          <Box sx={{ py: 1, display: "flex" }}>
                            <CurrencyRupeeIcon
                              sx={{ fontSize: "16px", mt: 0.3 }}
                            />
                            <Typography sx={{ fontWeight: "600" }}>
                              {getAllPackage?.startingPrice}
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          variant="contained"
                          onClick={() => addOrderHandler(getAllPackage)}
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
                      packageDetails?.monthlyDiscountedPrice || 0
                    } `}
                    action={
                      <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        onClick={() => proceedToPay(packageDetails)}
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
                </Grid>
              </Card>
            </Box>
          </>
        ) : (
          <Box sx={{ width: "100%", textAlign: "center", marginTop: "80px" }}>
            <Typography variant="h5">No Package Found</Typography>
          </Box>
        )}
      </Container>
    </>
  );
};

export default Subscription;
