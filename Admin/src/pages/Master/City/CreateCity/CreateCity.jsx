import React, { useEffect } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Stack,
} from "@mui/material";
import { Box } from "@mui/system";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { _validation, _initial } from "./utils";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import { emptycity } from "redux/city/cities.slice";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import {
  createCityAsync,
  updatCityByIdAsync,
  getCityByIdAsync,
} from "redux/city/cities.async";
import { getStateAsync } from "redux/state/states.async";
import SelectMenuItem from "components/SelectMenuItem/index";

export default function CreateCity({
  setActionModal,
  InfoId,
  InitialCities,
  setInfoId,
  IsFlagAction,
  setIsFlagAction,
}) {
  const dispatch = useDispatch();

  const { cityLoader, cityadd, cityById, updateCityById } = useSelector(
    (state) => state.city
  );
  const { stateLoader, states } = useSelector((state) => state.state);

  const onSubmit = async (values) => {
    let payload = {
      cityId: InfoId,
      name: values.name,
      stateId: values.stateId,
    };
    if (IsFlagAction) {
      dispatch(updatCityByIdAsync(payload));
    } else {
      delete payload.cityId;
      dispatch(createCityAsync(payload));
    }
  };

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validation,
  });

  useEffect(() => {
    if (cityById) {
      formik.setFieldValue("name", cityById?.name);
      formik.setFieldValue("stateId", cityById?.stateId);
    }
  }, [cityById]);

  const handleRoleEffect = () => {
    formik.resetForm();
    dispatch(emptycity());
    setInfoId();
    setActionModal(false);
    InitialCities({});
    setIsFlagAction(false);
  };

  useEffect(() => {
    if (cityadd.status === 200) {
      toast.success(cityadd.message, toastoptions);
      handleRoleEffect();
    }
    if (updateCityById.status === 200) {
      toast.success(updateCityById.message, toastoptions);
      handleRoleEffect();
    }
  }, [cityadd, updateCityById]);

  useEffect(() => {
    if (IsFlagAction) dispatch(getCityByIdAsync(InfoId));
  }, [IsFlagAction]);

  useEffect(() => {
    dispatch(getStateAsync({}));
  }, []);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <SelectMenuItem
            fullWidth
            disabled={stateLoader}
            error={formik.touched.stateId && formik.errors.stateId}
            InputLabelLoader={stateLoader}
            InputLabelLabel="State"
            InputLabelSize={20}
            label="State"
            name="stateId"
            {...formik.getFieldProps("stateId")}
            onChange={formik.handleChange}
            defaultItemLabel="Select State"
            data={_.map(states?.data, (ev, index) => {
              return (
                <MenuItem value={ev.id} key={ev.index}>
                  {ev.name}
                </MenuItem>
              );
            })}
          />

          <FormControl fullWidth>
            <TextField
              name="name"
              label="City"
              style={{ color: "transparent !important" }}
              fullWidth
              {...formik.getFieldProps("name")}
              onChange={formik.handleChange}
              error={formik.touched.name && formik.errors.name}
            />
          </FormControl>
          <Stack alignItems="flex-end" sx={{ my: 3 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={cityLoader}
            >
              Save
            </LoadingButton>
          </Stack>
        </Box>
      </form>
    </>
  );
}
