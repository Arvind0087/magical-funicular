import React, { useEffect, useState } from "react";
import {
  FormControl,
  Grid,
  TextField,
  Container,
  Typography,
  Box,
  Stack,
  Autocomplete,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Helmet } from "react-helmet-async";
import { useFormik } from "formik";
import { _initialValues, _validation } from "./utils";
import { useSelector, useDispatch } from "react-redux";
import {
  initPaymentphonepayAsync,
  verifyphonepayPaymentAsync,
} from "../../../redux/payment/phonepe.async";
import {
  getAllStateAsync,
  getAllCityByStateIdAsync,
} from "redux/cityAndState/cityAndState.async";

function UserForm({ paymentDetails, discountedPrice }) {
  const dispatch = useDispatch();

  const [stateVal, setStateVal] = useState({ id: "", name: "" });
  const [inputValue, setInputValue] = useState("");

  const [cityVal, setCityVal] = useState({ id: "", name: "" });
  const [type, setType] = useState({ id: "", name: "" });
  const [inputCityValue, setCityInputValue] = useState("");

  const {
    getAllStateLoader,
    getAllStateBy,
    getAllCityByStateIdLoader,
    AllCityByStateId,
  } = useSelector((state) => state.StateAndCity);

  // const { cityLoader, city } = useSelector((state) => state.city);

  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const onSubmit = async () => {
    const payload = {
      packageId: paymentDetails?.id,
      subscriptionId: "",
      amount: paymentDetails?.package_selling_price,
      type: "coursePackage",
      batchTypeId: paymentDetails?.batchTypeId,
    };

    dispatch(initPaymentphonepayAsync(payload)).then((res) => {
      if (res?.payload?.status == 200) {
        const url = res?.payload?.data?.url;
        // window.open(url, "_blank");
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
  };

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: _validation,
  });

  useEffect(() => {
    dispatch(getAllStateAsync({}));
  }, []);

  useEffect(() => {
    let payload = {
      id: stateVal?.id ? stateVal?.id : "",
    };
    dispatch(getAllCityByStateIdAsync(payload));
  }, [stateVal?.id]);

  const discounted = discountedPrice
    ? discountedPrice
    : paymentDetails?.package_selling_price;

  return (
    <Container>
      <Helmet>
        <title>Student Details | Veda Academy</title>
      </Helmet>
      <Typography sx={{ mb: 3, fontWeight: 600, fontSize: "18px" }}>
        User Details
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                name="name"
                label={"Student Name"}
                {...formik.getFieldProps("name")}
                onChange={formik.handleChange}
                error={Boolean(formik.touched.name && formik.errors.name)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                name="phone"
                type="number"
                minLength={10}
                // inputProps={{ minLength: 10 }}
                inputProps={{ maxLength: 10 }}
                //   disabled={Boolean(id) && studentById?.phone}
                label={"Phone"}
                {...formik.getFieldProps("phone")}
                onChange={(e) => {
                  if (String(e.target.value).length <= 10) {
                    formik.handleChange(e);
                  }
                }}
                error={Boolean(formik.touched.phone && formik.errors.phone)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                type="number"
                inputProps={{ maxLength: 6 }}
                name="pincode"
                label={"Pin Code"}
                {...formik.getFieldProps("pincode")}
                onChange={(e) => {
                  if (String(e.target.value).length <= 6) {
                    {
                      formik.handleChange(e);
                    }
                  }
                }}
                error={Boolean(formik.touched.pincode && formik.errors.pincode)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                name="address"
                label={"Full Address"}
                {...formik.getFieldProps("address")}
                onChange={formik.handleChange}
                error={Boolean(formik.touched.address && formik.errors.address)}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                name="landmark"
                label={"Lankmark"}
                {...formik.getFieldProps("landmark")}
                onChange={formik.handleChange}
                error={Boolean(
                  formik.touched.landmark && formik.errors.landmark
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Autocomplete
                value={stateVal}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setStateVal(newValue);
                  } else {
                    setStateVal({ id: "", name: "" });
                  }
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                id="state"
                options={getAllStateBy}
                getOptionLabel={(state) => state.name}
                renderInput={(params) => (
                  <TextField {...params} label="State" />
                )}
              />
            </FormControl>

            {/*<FormControl fullWidth>
              <TextField
                name="city"
                label={"City"}
                {...formik.getFieldProps("city")}
                onChange={formik.handleChange}
                error={Boolean(formik.touched.city && formik.errors.city)}
              />
            </FormControl> */}
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Autocomplete
                value={cityVal}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setCityVal(newValue);
                  } else {
                    setCityVal({ id: "", name: "" });
                  }
                }}
                inputValue={inputCityValue}
                onInputChange={(event, newInputValue) => {
                  setCityInputValue(newInputValue);
                }}
                id="city"
                options={AllCityByStateId || []}
                getOptionLabel={(city) => city.name}
                renderInput={(params) => <TextField {...params} label="City" />}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                name="price"
                label={"Price"}
                defaultValue={`₹${discounted}`}
                {...formik.getFieldProps("price")}
                onChange={formik.handleChange}
                // error={Boolean(formik.touched.name && formik.errors.name)}
                sx={{ pointerEvents: "none" }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={12}>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained">
                Proceed to Pay
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default UserForm;
