import React, { useEffect, useMemo } from "react";
import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { _validate, _initial } from "./utils";
import _ from "lodash";
import moment from "moment";
import { toastoptions } from "utils/toastoptions";
import { PATH_DASHBOARD } from "routes/paths";
import { toast } from "react-hot-toast";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";
import { useNavigate, useParams } from "react-router";
import { getMultipleBatchDateAsync } from "redux/batchdate/batchdate.async";
import { getMultipleBatchByMultiClassAsync } from "redux/batchtype/batchtype.async";
import {
  getSubjectByMultipleClassIdAsync,
  updateStaffBatchDetailsAsync
} from "redux/staff/staff.async";
import { emptystaff } from "redux/staff/staff.slice";
import { CleanHands } from "../../../../../../node_modules/@mui/icons-material/index";
export default function AddBatch({
  setActionModal,
  teacherinfo,
  InitialStaff,
  IsFlagAction,
  setIsFlagAction
}) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { batchLoader, batchByMultiClass } = useSelector(
    (state) => state.batch
  );

  const { batchdateLoader, getMultipleBatchDate } = useSelector(
    (state) => state.batchdate
  );

  const {
    staffLoader,
    staffById,
    getSubjectByMultipleClass,
    updateStaffBatchDetails
  } = useSelector((state) => state.staff);

  const onSubmit = async (values) => {
    let payload = {
      id: teacherinfo?.id,
      batchTypeIds: _.map(values?.batchId, (ev) => ev.value),
      batchDateIds: _.map(values?.batchStartDateId, (ev) => ev.value),
      subjectIds: _.map(values?.subjectId, (ev) => ev.value)
    };

    dispatch(updateStaffBatchDetailsAsync(payload));
  };

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate
  });

  const handleStaffEffect = () => {
    formik.resetForm();
    InitialStaff({});
    dispatch(emptystaff());
    setActionModal(false);
    setIsFlagAction(false);
  };

  useEffect(() => {
    if (teacherinfo && batchByMultiClass) {
      const _matchBatchType = _.map(_.intersectionBy(batchByMultiClass, teacherinfo?.batchType, 'id'), (item) => {
        return {
          label: `${item?.batchType} (${item?.className})`,
          value: item?.id
        }
      })
      formik.setFieldValue("batchId", _matchBatchType);
    }
  }, [teacherinfo, batchByMultiClass]);


  useEffect(() => {
    const _matchBatchStartDate = _.map(_.intersectionBy(getMultipleBatchDate?.data, teacherinfo?.batchDate, 'id'), (item) => {
      return {
        label: `${moment(item.name).format("DD MMM YYYY")} (${item?.batchType})`,
        value: item.id
      };
    })
    formik.setFieldValue("batchStartDateId", _matchBatchStartDate);

  }, [teacherinfo, getMultipleBatchDate])

  useEffect(() => {
    const _matchSubject = _.map(_.intersectionBy(getSubjectByMultipleClass?.data, teacherinfo?.subject, 'id'), (item) => {
      return {
        label: `${item?.subject}(${item?.class}) (${item?.batchTypeName})`,
        value: item.id
      };
    })
    formik.setFieldValue("subjectId", _matchSubject);
  }, [teacherinfo, getSubjectByMultipleClass])

  useEffect(() => {
    if (updateStaffBatchDetails.status === 200) {
      toast.success(updateStaffBatchDetails.message, toastoptions);
      handleStaffEffect();
    }
  }, [updateStaffBatchDetails]);

  useEffect(() => {
    if (teacherinfo?.class) {
      dispatch(
        getMultipleBatchByMultiClassAsync({
          classIds: _.map(teacherinfo?.class, (ev) => ev.id)
        })
      );
    }
  }, [teacherinfo]);

  useEffect(() => {
    if (formik.values.batchId?.length) {
      dispatch(
        getMultipleBatchDateAsync({
          batchTypeIds: _.map(formik.values?.batchId, (e) => e.value)
        })
      );
    }
  }, [formik.values.batchId]);

  useEffect(() => {
    if (formik.values.batchId?.length) {
      dispatch(
        getSubjectByMultipleClassIdAsync({
          classId: _.map(formik.values?.classId, (e) => e.value),
          batchTypeIds: _.map(formik.values?.batchId, (e) => e.value)
        })
      );
    }
  }, [formik.values.batchId]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <>
            <AutoCompleteCustom
              multiple={true}
              loading={batchLoader}
              name="batchId"
              options={_.map(batchByMultiClass, (ev) => {
                return {
                  label: `${ev?.batchType} (${ev?.className})`,
                  value: ev.id
                };
              })}
              value={formik.values.batchId}
              onChange={(event, value) =>
                formik.setFieldValue("batchId", value)
              }
              error={formik.touched.batchId && formik.errors.batchId}
              label="Select Batch"
            />
            <AutoCompleteCustom
              name="batchStartDateId"
              multiple={true}
              loading={batchdateLoader}
              options={_.map(getMultipleBatchDate?.data, (ev) => {
                return {
                  label: `${moment(ev?.date).format("DD MMMM YYYY")} (${ev?.batchType})`,
                  value: ev.id
                };
              })}
              value={formik.values.batchStartDateId}
              onChange={(event, value) =>
                formik.setFieldValue("batchStartDateId", value)
              }
              label="Select Batch Start Date"
              error={
                formik.touched.batchStartDateId &&
                formik.errors.batchStartDateId
              }
            />
            <AutoCompleteCustom
              multiple={true}
              name="subjectId"
              loading={staffLoader}
              options={_.map(getSubjectByMultipleClass?.data, (ev) => {
                return {
                  label: `${ev.subject} (${ev.class}) (${ev.batchTypeName})`,
                  value: ev.id
                };
              })}
              value={formik.values.subjectId}
              onChange={(event, value) =>
                formik.setFieldValue("subjectId", value)
              }
              error={formik.touched.subjectId && formik.errors.subjectId}
              label="Select Subject"
            />
          </>
          <Stack alignItems="flex-end" sx={{ my: 3 }}>
            <Box sx={{ display: "flex" }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={staffLoader}
              >
                {teacherinfo?.batchType?.length ? "Update Batch" : "Add Batch"}
              </LoadingButton>
              <LoadingButton
                sx={{ ml: 1 }}
                variant="outlined"
                color="inherit"
                onClick={(e) => setActionModal(false)}
              >
                Cancel
              </LoadingButton>
            </Box>
          </Stack>
        </Box>
      </form>
    </>
  );
}
