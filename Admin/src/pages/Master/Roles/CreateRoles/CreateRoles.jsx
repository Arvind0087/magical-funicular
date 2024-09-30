import React, { useEffect } from "react";
import { TextField, Stack } from "@mui/material";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { _validation, _initial } from "./utils";
import { emptyroles } from "redux/Roles/roles.slice";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import {
  createRolesAsync,
  getRolesByIdAsync,
  updatRolesByIdAsync,
} from "redux/Roles/roles.async";
import { LoadingButton } from "@mui/lab";

export default function CreateRoles({
  InfoId,
  InitialRoles,
  setInfoId,
  setActionModal,
  IsFlagAction,
}) {
  const dispatch = useDispatch();
  const { rolesLoader, rolesadd, rolesById, updateRolesById } = useSelector(
    (state) => state.roles
  );

  const onSubmit = async (values) => {
    let payload = {
      role: values.role,
    };
    if (IsFlagAction) {
      payload.id = InfoId;
      dispatch(updatRolesByIdAsync(payload));
    } else {
      delete payload.id;
      dispatch(createRolesAsync(payload));
    }
  };

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validation,
  });

  const handleRoleEffect = () => {
    formik.resetForm();
    setInfoId({});
    dispatch(emptyroles());
    setActionModal(false);
    InitialRoles({});
  };

  useEffect(() => {
    if (rolesById) formik.setFieldValue("role", rolesById?.role);
  }, [rolesById]);

  useEffect(() => {
    if (rolesadd.status === 200) {
      toast.success(rolesadd.message, toastoptions);
      handleRoleEffect();
    }
    if (updateRolesById.status === 200) {
      toast.success(updateRolesById.message, toastoptions);
      handleRoleEffect();
    }
  }, [rolesadd, updateRolesById]);

  useEffect(() => {
    if (IsFlagAction) dispatch(getRolesByIdAsync(InfoId));
  }, [IsFlagAction]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          name="role"
          label="Role"
          style={{ color: "transparent !important", marginTop: 5 }}
          fullWidth
          {...formik.getFieldProps("role")}
          onChange={formik.handleChange}
          error={formik.touched.role && formik.errors.role}
        />

        <Stack alignItems="flex-end" sx={{ my: 3 }}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={rolesLoader}
          >
            Save
          </LoadingButton>
        </Stack>
      </form>
    </>
  );
}
