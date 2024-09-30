import React, { useEffect, useState } from "react";
import { Grid, Stack } from "@mui/material";
import { Container } from "@mui/system";
import moment from "moment";
import { useFormik } from "formik";
import { _initial, _validate } from "./validation";
import { useDispatch, useSelector } from "react-redux";
import { PATH_DASHBOARD } from "routes/paths";
import { getcourseAsync } from "redux/course/course.async";
import { getBoardsByCourseIdAsync } from "redux/board/board.async";
import { getClassByBoardAndCourseIdAsync } from "redux/class/class.async";
import { getBatchByCourseBoardClassAsync } from "redux/batchtype/batchtype.async";
import { getMultipleBatchDateAsync } from "redux/batchdate/batchdate.async";
import _ from "lodash";
import { LoadingButton } from "@mui/lab";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";
import BoxGridTwo from "components/BoxGridTwo/BoxGridTwo";
import { useNavigate } from "react-router-dom";

export default function CreateTest() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isInfo, setIsInfo] = useState({
    course: "",
    board: "",
    class: "",
    batch: "",
    batchDate: ""
  });
  const { courseLoader, course } = useSelector((state) => state.course);
  const { boardLoader, boardByCourse } = useSelector((state) => state.board);
  const { classLoader, classbycourseboard } = useSelector(
    (state) => state.class
  );
  const { batchLoader, batchByCourseBoardClass } = useSelector(
    (state) => state.batch
  );
  const { batchdateLoader, getMultipleBatchDate } = useSelector(
    (state) => state.batchdate
  );

  const onSubmit = (value) => {
    navigate(`${PATH_DASHBOARD.questions}`, {
      state: {
        ...isInfo
      }
    });
  };

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate
  });

  useEffect(() => {
    dispatch(getcourseAsync({}));
  }, []);

  useEffect(() => {
    if (formik.values.courseId?.value) {
      dispatch(
        getBoardsByCourseIdAsync({
          courseId: formik.values.courseId?.value
        })
      );
    }
  }, [formik.values.courseId]);

  useEffect(() => {
    if (formik.values.boardId?.value) {
      dispatch(
        getClassByBoardAndCourseIdAsync({
          courseId: formik.values.courseId.value,
          boardId: formik.values.boardId.value
        })
      );
    }
  }, [formik.values.boardId]);

  useEffect(() => {
    if (formik.values.classId?.value) {
      dispatch(
        getBatchByCourseBoardClassAsync({
          courseId: formik.values.courseId.value,
          boardId: formik.values.boardId.value,
          classId: formik.values.classId.value
        })
      );
    }
  }, [formik.values.classId]);

  useEffect(() => {
    if (formik.values.batchTypeId?.length > 0) {
      dispatch(
        getMultipleBatchDateAsync({
          batchTypeIds: _.map(formik?.values?.batchTypeId, (ev) => ev.value)
        })
      );
    }
  }, [formik.values.batchTypeId]);

  useEffect(() => {
    setIsInfo({
      course: _.find(
        course?.data,
        (ev) => ev.id === formik.values.courseId?.value
      ),
      board: _.find(
        boardByCourse,
        (ev) => ev.id === formik.values.boardId?.value
      ),
      class: _.find(
        classbycourseboard,
        (ev) => ev.id === formik.values.classId?.value
      ),
      batch: _.map(formik.values.batchTypeId, (evv) => {
        const find = _.find(
          batchByCourseBoardClass,
          (ev) => ev.id === evv.value
        );
        return find;
      }),
      batchDate: _.map(formik.values.batchStartDateId, (evv) => {
        const find = _.find(
          getMultipleBatchDate?.data,
          (ev) => ev.id === evv.value
        );
        return find;
      })
    });
  }, [
    formik.values.courseId,
    formik.values.boardId,
    formik.values.classId,
    formik.values.batchTypeId,
    formik.values.batchStartDateId
  ]);

  return (
    <Container sx={{ pt: "10px" }}>
      <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <BoxGridTwo>
              <AutoCompleteCustom
                name="courseId"
                loading={courseLoader}
                options={_.map(course?.data, (ev) => {
                  return { label: ev.name, value: ev.id };
                })}
                value={formik.values.courseId}
                onChange={(event, value) => {
                  formik.setFieldValue("courseId", value);
                }}
                label="Select Course"
                error={formik.touched.courseId && formik.errors.courseId}
              />
              <AutoCompleteCustom
                name="boardId"
                loading={boardLoader}
                options={_.map(boardByCourse, (ev) => {
                  return { label: ev.name, value: ev.id };
                })}
                value={formik.values.boardId}
                onChange={(event, value) =>
                  formik.setFieldValue("boardId", value)
                }
                label="Select Board"
                error={formik.touched.boardId && formik.errors.boardId}
              />
              <AutoCompleteCustom
                name="classId"
                loading={classLoader}
                options={_.map(classbycourseboard, (ev) => {
                  return { label: ev.name, value: ev.id };
                })}
                value={formik.values.classId}
                onChange={(event, value) =>
                  formik.setFieldValue("classId", value)
                }
                label="Select Class"
                error={formik.touched.classId && formik.errors.classId}
              />

              <AutoCompleteCustom
                name="batchTypeId"
                multiple={true}
                loading={batchLoader}
                options={_.map(batchByCourseBoardClass, (ev) => {
                  return { label: ev.name, value: ev.id };
                })}
                value={formik.values.batchTypeIds}
                onChange={(event, value) => {
                  formik.setFieldValue("batchTypeId", value);
                }}
                label="Select Batch Type"
                error={formik.touched.batchTypeId && formik.errors.batchTypeId}
              />
              <AutoCompleteCustom
                name="batchStartDateId"
                multiple={true}
                loading={batchdateLoader}
                options={_.map(getMultipleBatchDate?.data, (ev) => {
                  return {
                    label: `${moment(ev.date).format("DD MMMM YYYY")}`,
                    value: ev.id
                  };
                })}
                value={formik.values.batchStartDateId}
                onChange={(event, value) =>
                  formik.setFieldValue("batchStartDateId", value)
                }
                label="Select Batch start Date"
                error={
                  formik.touched.batchStartDateId &&
                  formik.errors.batchStartDateId
                }
              />
            </BoxGridTwo>
          </Grid>
        </Grid>
        <Stack alignItems="flex-end" sx={{ my: 3 }}>
          <LoadingButton type="submit" variant="contained">
            Proceed
          </LoadingButton>
        </Stack>
      </form>
    </Container>
  );
}
