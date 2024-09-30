import React, { useEffect, useRef } from "react";
import {
  MenuItem,
  TextField,
  Stack,
  Card,
  Grid,
  FormControl
} from "@mui/material";
import { Box } from "@mui/system";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { _validation, _initial, _validationNan } from "./utils";
import { emptydoubtdemorquest } from "redux/doubtdemorequest/doubtdemorequest.slice";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import {
  createEventNewAsync,
  getTeacherScheduleDateAsync,
  getScheduleByTeacherIdAsync,
  getAllDoubtDemoRequestAsync
} from "redux/doubtdemorequest/doubtdemorequest.async";
import SelectMenuItem from "components/SelectMenuItem/index";
import { getAllMentorTeacherAsync } from "redux/liveclass/liveclass.async";
import { CustomToggleButton } from "../component/Button";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";
import _ from "lodash";
import moment from "moment";
export default function Assign({
  setActionModal,
  doubtdemorquestinfo,
  setActionfind
}) {
  const dispatch = useDispatch();

  const { MentorTeacherLoader, allStaffMentorTeacher } = useSelector(
    (state) => state.liveclass
  );
  const isFirstRender = useRef(true);

  const {
    doubtdemorequestLoader,
    doubtdemorquest,
    dateScheduleLoader,
    teacherSchduledate,
    addEventNew,
    teacherSchduleTime
  } = useSelector((state) => state.doubtdemorquest);
  console.log("teacherSchduleTime", teacherSchduleTime);

  const onSubmit = async (values) => {
    const selectedDateTime = new Date(values.startDate);
    const currentDateTime = new Date();
    const momentDate = moment(values.startDate);
    const formattedDate = momentDate.format("YYYY-MM-DD");

    if (selectedDateTime <= currentDateTime) {
      toast.error(
        "The selected date and time is earlier than the current date and time.",
        toastoptions
      );
      return;
    }
    let payload = {
      requestId: doubtdemorquestinfo?.id,
      teacherId: values.teacher,
      // attemptBy: values.startDate.label,
      attemptBy: formattedDate,
      time: formik.values.undefined,
      status: "Accepted"
    };
    if (doubtdemorquestinfo?.type === "Doubt Class") {
      delete payload.teacherId;
      delete payload.date;
    }
    dispatch(createEventNewAsync(payload));
  };

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema:
      doubtdemorquestinfo?.type !== "Doubt Class" ? _validation : _validationNan
  });

  useEffect(() => {
    if (addEventNew.status === 200) {
      dispatch(emptydoubtdemorquest());
      setActionModal(false);
      formik.resetForm();
    }
  }, [addEventNew]);

  useEffect(() => {
    dispatch(getAllMentorTeacherAsync({ type: doubtdemorquestinfo?.type }));
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (teacherSchduledate) {
      const payload = {
        teacherId: formik.values?.teacher
      };
      dispatch(getTeacherScheduleDateAsync(payload));
    }
  }, [formik.values.teacher]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (formik.values.teacher && formik.values?.startDate) {
      // (teacherSchduleTime)
      const payload = {
        teacherId: formik.values?.teacher,
        date: formik.values?.startDate?.label
      };
      dispatch(getScheduleByTeacherIdAsync(payload));
    }
  }, [formik.values?.startDate]);
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {doubtdemorquestinfo?.type !== "Doubt Class" && (
            <>
              <SelectMenuItem
                fullWidth
                disabled={MentorTeacherLoader}
                error={formik.touched.teacher && formik.errors.teacher}
                InputLabelLoader={MentorTeacherLoader}
                InputLabelLabel="Select Teacher"
                InputLabelSize={20}
                label="Select Teacher"
                name="teacher"
                {...formik.getFieldProps("teacher")}
                onChange={formik.handleChange}
                defaultItemLabel="Select Teacher"
                data={_.map(allStaffMentorTeacher.data, (ev, index) => {
                  return (
                    <MenuItem value={ev.id} key={ev.index}>
                      {ev.name}
                    </MenuItem>
                  );
                })}
              />

              <AutoCompleteCustom
                name="startDate"
                // disabled={dateScheduleLoader}
                loading={dateScheduleLoader}
                // loadingText={dateScheduleLoader}
                options={_.map(teacherSchduledate?.data, (ev) => {
                  return {
                    label: `${moment(ev.date).format("DD MMMM YYYY")}`,
                    value: `${moment(ev.date).format("DD MMMM YYYY")}`
                  };
                })}
                value={formik.values.startDate}
                onChange={(event, values) =>
                  formik.setFieldValue("startDate", values)
                }
                label="Select Available Date"
                error={formik.touched.startDate && formik.errors.startDate}
              />

              {/* <Grid item xs={12}> */}
              <FormControl
                sx={
                  {
                    // height: "300px",
                  }
                }
              >
                <span>Available Time</span>
                <CustomToggleButton
                  // basicdetail
                  formik={formik}
                  buttons={_.map(teacherSchduleTime?.data, (item) => {
                    return { label: item, value: item };
                  })}
                  //  name="time"
                  onChange={formik.handleChange}
                />
              </FormControl>
              {/* </Grid> */}
            </>
          )}

          <Stack alignItems="flex-end" sx={{ my: 3 }}>
            <Box sx={{ display: "flex" }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={doubtdemorequestLoader}
              >
                Accept
              </LoadingButton>
              <LoadingButton
                sx={{ ml: 1 }}
                variant="outlined"
                color="inherit"
                onClick={(e) => {
                  dispatch(emptydoubtdemorquest());
                  setActionfind(e);
                  setActionModal(false);
                }}
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
