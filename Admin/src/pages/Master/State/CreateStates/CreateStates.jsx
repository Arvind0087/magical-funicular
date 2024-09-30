import React, { useEffect } from "react";
import { FormControl, TextField, Stack } from "@mui/material";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { _validation, _initial } from "./utils";
import { emptystate } from "redux/state/states.slice";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import {
  createStateAsync,
  updatStateByIdAsync,
  getStateByIdAsync,
} from "redux/state/states.async";
import { LoadingButton } from "@mui/lab";

export default function AddState({
  setActionModal,
  InfoId,
  setInfoId,
  InitialState,
  IsFlagAction,
  setIsFlagAction,
}) {
  const dispatch = useDispatch();
  const { stateLoader, stateadd, stateById, updateStateById } = useSelector(
    (state) => state.state
  );

  const onSubmit = async (values) => {
    let payload = {
      name: values.name,
    };
    if (IsFlagAction) {
      payload.Id = InfoId;
      dispatch(updatStateByIdAsync(payload));
    } else {
      delete payload.Id;
      dispatch(createStateAsync(payload));
    }
  };

  useEffect(() => {
    if (stateById) formik.setFieldValue("name", stateById?.name);
  }, [stateById]);

  const handleStateEffect = () => {
    formik.resetForm();
    setInfoId("");
    dispatch(emptystate());
    setActionModal(false);
    setIsFlagAction(false);
    InitialState({})
  };

  useEffect(() => {
    if (stateadd.status === 200) {
      toast.success(stateadd.message, toastoptions);
      handleStateEffect();
    }
    if (updateStateById.status === 200) {
      toast.success(updateStateById.message, toastoptions);
      handleStateEffect();
    }
  }, [stateadd, updateStateById]);

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validation,
  });

  useEffect(() => {
    if (IsFlagAction) dispatch(getStateByIdAsync(InfoId));
  }, [IsFlagAction]);

  return (
    <>
      <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <TextField
            name="name"
            label="State"
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
            loading={stateLoader}
          >
            Save
          </LoadingButton>
        </Stack>
      </form>
    </>
  );
}
