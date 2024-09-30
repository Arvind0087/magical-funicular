import React, { useEffect } from "react";
import { FormControl, TextField, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { _validation, _initial } from "./utils";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import {
  createGrievancesCategoryAsync,
  getGrievancesCategoryByIdAsync,
  updatGrievancesCategoryIdAsync
} from 'redux/grievances/grievances.async'
import { emptyGrievances } from "redux/grievances/grievances.slice";

export default function AddCategory({
  setActionModal,
  getCategoryInfo,
  setCategoryInfo,
  Initialgrievances,
  IsFlagAction,
  setIsFlagAction,
}) {
  const dispatch = useDispatch();
  const { grievancesLoader,
    createGrievancesCategory,
    grievancesCategoryById,
    updatGrievancesCategory,
  } = useSelector((state) => state.grievances)

  const onSubmit = async (values) => {
    let payload = {
      id: getCategoryInfo,
      category: values.category,
    };
    if (IsFlagAction) {
      dispatch(updatGrievancesCategoryIdAsync(payload));
    } else {
      delete payload.id;
      dispatch(createGrievancesCategoryAsync(payload));
    }
  };

  useEffect(() => {
    if (grievancesCategoryById) formik.setFieldValue("category", grievancesCategoryById?.category);
  }, [grievancesCategoryById]);

  const handleStateEffect = () => {
    formik.resetForm();
    setCategoryInfo("");
    dispatch(emptyGrievances());
    setActionModal(false);
    setIsFlagAction(false);
    Initialgrievances({})
  };

  useEffect(() => {
    if (createGrievancesCategory.status === 200) {
      toast.success(createGrievancesCategory.message, toastoptions);
      handleStateEffect();
    }
    if (updatGrievancesCategory.status === 200) {
      toast.success(updatGrievancesCategory.message, toastoptions);
      handleStateEffect();
    }
  }, [createGrievancesCategory, updatGrievancesCategory]);


  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validation,
  });

  useEffect(() => {
    if (IsFlagAction) dispatch(getGrievancesCategoryByIdAsync(getCategoryInfo));
  }, [IsFlagAction]);
  getGrievancesCategoryByIdAsync
  return (
    <>
      <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <TextField
            name="category"
            label="Category"
            style={{ color: "transparent !important" }}
            fullWidth
            {...formik.getFieldProps("category")}
            onChange={formik.handleChange}
            error={formik.touched.category && formik.errors.category}
          />
        </FormControl>

        <Stack alignItems="flex-end" sx={{ my: 3 }}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={grievancesLoader}
          >
            Save
          </LoadingButton>
        </Stack>
      </form>
    </>
  );
}
