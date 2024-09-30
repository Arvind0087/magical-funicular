import React, { useEffect } from "react";
import {
  FormControl,
  MenuItem,
  TextField,
  Stack,
  Box
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import SelectMenuItem from "components/SelectMenuItem/index";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { _validation, _initial } from "./utils";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";

import {
  getAllCategoryAsync, createGrievancesSubCategoryAsync,
  getGrievancesSubCategoryByIdAsync, updatGrievancesSubCategoryIdAsync
} from 'redux/grievances/grievances.async';
import { emptyGrievances } from "redux/grievances/grievances.slice";

export default function CreateSubCategory({
  setActionModal,
  getSubCategory,
  setSubCategory,
  InitialSubCategory,
  IsFlagAction,
  setIsFlagAction,
}) {

  const dispatch = useDispatch();
  const {
    grievancesLoader, allCategory, createGrievancesSubCategory,
    getGrievancesSubCategoryById, updatGrievancesSubCategory
  } = useSelector((state) => state.grievances)

 
  const onSubmit = async (values) => {
    let payload = {
      id: getSubCategory,
      categoryId: values.categoryId,
      subCategory: values.subCategory,
    };
    if (IsFlagAction) {
      dispatch(updatGrievancesSubCategoryIdAsync(payload));
    } else {
      delete payload.id;
      dispatch(createGrievancesSubCategoryAsync(payload));
    }
  };

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validation,
  });

  useEffect(() => {
    if (getGrievancesSubCategoryById) {
      formik.setFieldValue("subCategory", getGrievancesSubCategoryById?.subCategory);
      formik.setFieldValue("categoryId", getGrievancesSubCategoryById?.categoryId);
    }
  }, [getGrievancesSubCategoryById]);

  const handleRoleEffect = () => {
    formik.resetForm();
    dispatch(emptyGrievances());
    setSubCategory();
    setActionModal(false);
    InitialSubCategory({});
    setIsFlagAction(false);
  };

  useEffect(() => {
    if (createGrievancesSubCategory.status === 200) {
      toast.success(createGrievancesSubCategory.message, toastoptions);
      handleRoleEffect();
    }
    if (updatGrievancesSubCategory.status === 200) {
      toast.success(updatGrievancesSubCategory.message, toastoptions);
      handleRoleEffect();
    }
  }, [createGrievancesSubCategory, updatGrievancesSubCategory]);

  useEffect(() => {
    if (IsFlagAction) dispatch(getGrievancesSubCategoryByIdAsync(getSubCategory));
  }, [IsFlagAction]);

  useEffect(() => {
    dispatch(getAllCategoryAsync());
  }, []);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <SelectMenuItem
            fullWidth
            disabled={grievancesLoader}
            error={formik.touched.categoryId && formik.errors.categoryId}
            InputLabelLoader={grievancesLoader}
            InputLabelLabel="Category"
            InputLabelSize={20}
            label="Category"
            name="categoryId"
            {...formik.getFieldProps("categoryId")}
            onChange={formik.handleChange}
            defaultItemLabel="Select Category"
            data={_.map(allCategory?.data, (ev, index) => {
              return (
                <MenuItem value={ev.id} key={ev.index}>
                  {ev.category}
                </MenuItem>
              );
            })}
          />

          <FormControl fullWidth>
            <TextField
              name="subCategory"
              label="Sub Category"
              style={{ color: "transparent !important" }}
              fullWidth
              {...formik.getFieldProps("subCategory")}
              onChange={formik.handleChange}
              error={formik.touched.subCategory && formik.errors.subCategory}
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
        </Box>
      </form>
    </>
  );
}
