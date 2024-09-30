import React, { useState, useEffect } from "react";
import { Box, Card, CardHeader, FormControl } from "@mui/material";
import moment from "moment";
import { useFormik } from "formik";
import { _initial, _validate } from "./utils";
import { Theme, useTheme, makeStyles } from "@mui/material/styles";
import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import { getBoardsByCourseIdAsync } from "redux/async.api";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";
import { getBatchByBoardIdAsync } from "redux/batchtype/batchtype.async";
import { getSubjectByBatchTypeIdAsync } from "redux/subject/subject.async";
import AnalyticLive from "./AnalyticLive";
import { getAllCityByMultipleStateId } from "redux/city/cities.async";
import { getStateFilterAsync } from "redux/filter/filter.async";
import { liveTestContentAsync } from "redux/liveTestContentReport/liveTestContent.async";
import { getCityByMultipleStateIdAsync } from "redux/city/cities.async";

function LiveStudentChart() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [selectCourse, setSelectCourse] = useState(undefined);
  const [selectBoard, setSelectBoard] = useState(undefined);
  const [selectBatch, setSelectBatch] = useState(undefined);
  const [selectSubject, setSelectSubject] = useState(undefined);
  const [searchType, setSearchType] = useState(undefined);
  const [searchCategory, setSearchCategory] = useState(undefined);
  const [selectState, setSelectState] = React.useState([]);
  const [selectCity, setSelectCity] = React.useState([]);

  const { filterLoader, courseFilter, boardFilterInfo, stateFilter } =
    useSelector((state) => state.filterInfo);

  const { boardLoader, boardByCourse } = useSelector((state) => state.board);

  const { getBatchByBoardId, batchLoader } = useSelector(
    (state) => state.batch
  );

  const { cityLoader, cityByMultipleStateId } = useSelector(
    (state) => state.city
  );

  const { subjectLoader, subjectCourseBoardClassBatch } = useSelector(
    (state) => state.subject
  );

  const { liveTestContent } = useSelector((state) => state.liveTestContent);

  const typeFilter = ["test", "learningContent"];
  const categoryFilter = ["gender", "state", "city"];

  const courseId = selectCourse && selectCourse.value;
  const boardId = selectBoard && selectBoard.value;
  const batchId = selectBatch && selectBatch.value;
  const subjectId = selectSubject && selectSubject.value;

  // Extracting IDs into a new array
  const idState = selectState && selectState?.map((obj) => obj.id);
  const idCity = selectCity && selectCity?.map((obj) => obj.id);

  const liveLabelsArray =
    liveTestContent && liveTestContent.map((item) => [item.label]);

  const liveValuesArray =
    liveTestContent && liveTestContent.map((item) => item.value);

  useEffect(() => {
    dispatch(getStateFilterAsync({}));
  }, []);

  useEffect(() => {
    dispatch(
      getAllCityByMultipleStateId({
        stateIds: idState,
      })
    );
  }, [selectState]);

  useEffect(() => {
    if (selectCourse) {
      let payload = { courseId: selectCourse?.value };
      dispatch(getBoardsByCourseIdAsync(payload));
    }
  }, [selectCourse]);

  useEffect(() => {
    if (selectCourse === null) {
      setSelectBoard(undefined);
    }
  }, [selectCourse]);

  useEffect(() => {
    if (selectBoard) {
      dispatch(
        getBatchByBoardIdAsync({
          boardId: selectBoard.value,
        })
      );
    }
  }, [selectBoard]);

  useEffect(() => {
    if (batchId) {
      dispatch(
        getSubjectByBatchTypeIdAsync({
          batchTypeId: batchId,
        })
      );
    }
  }, [batchId]);

  useEffect(() => {
    let payload = {
      type: searchType?.label,
      category: searchCategory?.label,
      stateId: idState || [],
      cityId: idCity || [],
      courseId: courseId ? courseId : "",
      boardId: boardId ? boardId : "",
      batchTypeId: batchId ? batchId : "",
      subjectId: subjectId ? subjectId : "",
    };

    if (searchCategory?.label === "gender") {
      if (searchType && selectCourse) {
        dispatch(liveTestContentAsync(payload));
      }
    }

    if (searchCategory?.label === "state") {
      if (selectState?.length !== 0) {
        if (searchType && selectCourse) {
          dispatch(liveTestContentAsync(payload));
        }
      }
    }

    if (searchCategory?.label === "city") {
      if (selectCity?.length !== 0) {
        dispatch(liveTestContentAsync(payload));
      }
    }
  }, [
    searchType,
    searchCategory,
    selectState,
    selectCity,
    selectCourse,
    selectBoard,
    selectBatch,
    selectSubject,
  ]);

  useEffect(() => {
    if (selectCourse === null) {
      setSelectBoard(undefined);
      setSelectBatch(undefined);
      setSelectSubject(undefined);
    }
  }, [selectCourse]);

  useEffect(() => {
    if (selectBoard === null) {
      setSelectBatch(undefined);
      setSelectSubject(undefined);
    }
  }, [selectBoard]);

  useEffect(() => {
    if (selectBatch === null) {
      setSelectSubject(undefined);
    }
  }, [selectBatch]);

  const handelStatChange = (value) => {
    setSelectState(value);
    const payload = {
      stateId: value?.map((ev) => ev.value) || [],
      cityId: [],
    };

    let statePayload = { stateIds: value?.map((ev) => ev.value) || [] };
    dispatch(getCityByMultipleStateIdAsync(statePayload));
  };

  const handelCityChange = (value) => {
    setSelectCity(value);
    const payload = {
      stateId: selectState,
      cityId: value?.map((ev) => ev.value) || [],
    };
  };

  return (
    <div className="liveTestContentReport">
      <Card elevaltio={7}>
        <CardHeader title="Test and Learning Content Report" />
        <Box sx={{ overflowX: "auto", maxWidth: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              flexWrap: "wrap",
              mt: 2,
            }}
          >
            <FormControl>
              <AutoCompleteCustom
                size="small"
                sx={{ width: 130, mr: 2, mb: { xs: 1, md: 0 } }}
                loading={filterLoader}
                options={_.map(typeFilter, (ev) => {
                  return {
                    label: `${ev}`,
                    value: ev,
                  };
                })}
                value={searchType ?? ""}
                onChange={(event, value) => setSearchType(value)}
                label="Type"
              />
            </FormControl>

            <FormControl>
              <AutoCompleteCustom
                size="small"
                sx={{ width: 130, mr: 2, mb: { xs: 1, md: 0 } }}
                loading={filterLoader}
                options={_.map(categoryFilter, (ev) => {
                  return {
                    label: `${ev}`,
                    value: ev,
                  };
                })}
                value={searchCategory ?? ""}
                onChange={(event, value) => setSearchCategory(value)}
                label="Category"
              />
            </FormControl>

            <FormControl>
              <AutoCompleteCustom
                size="small"
                sx={{ width: 130, mr: 2, mb: { xs: 1, md: 0 } }}
                loading={filterLoader}
                options={_.map(courseFilter, (ev) => {
                  return {
                    label: `${ev.name}`,
                    value: ev.id,
                  };
                })}
                value={selectCourse ?? ""}
                onChange={(event, value) => setSelectCourse(value)}
                label="Course"
              />
            </FormControl>

            <FormControl>
              <AutoCompleteCustom
                size="small"
                sx={{ width: 130, mr: 2, mb: { xs: 1, md: 0 } }}
                loading={boardLoader}
                options={_.map(boardByCourse, (ev) => {
                  return {
                    label: `${ev.name}`,
                    value: ev.id,
                  };
                })}
                value={selectBoard ?? ""}
                onChange={(event, value) => setSelectBoard(value)}
                label="Board"
              />
            </FormControl>

            <FormControl>
              <AutoCompleteCustom
                size="small"
                sx={{ width: 130, mr: 2, mb: { xs: 1, md: 0 } }}
                loading={batchLoader}
                options={_.map(getBatchByBoardId, (ev) => {
                  return {
                    label: `${ev.class} (${ev.name})`,
                    value: ev.id,
                  };
                })}
                value={selectBatch ?? ""}
                onChange={(event, value) => setSelectBatch(value)}
                label="Batch"
              />
            </FormControl>

            <FormControl>
              <AutoCompleteCustom
                size="small"
                sx={{ width: 130, mr: 2, mb: { xs: 1, md: 0 } }}
                loading={subjectLoader}
                options={_.map(subjectCourseBoardClassBatch, (ev) => {
                  return {
                    label: `${ev.course} (${ev.name})`,
                    value: ev.id,
                  };
                })}
                value={selectSubject ?? ""}
                onChange={(event, value) => setSelectSubject(value)}
                label="Subject"
              />
            </FormControl>

            <FormControl>
              <AutoCompleteCustom
                multiple={true}
                size="small"
                sx={{ width: 130, mr: 2, mb: { xs: 1, md: 0 } }}
                loading={filterLoader}
                InputLabelLoader={filterLoader}
                options={_.map(stateFilter, (ev) => {
                  return {
                    label: `${ev.name}`,
                    value: ev.id,
                  };
                })}
                value={selectState ?? ""}
                onChange={(event, value) => handelStatChange(value)}
                label="State"
                disabled={searchCategory?.label === "gender"}
              />
            </FormControl>

            <FormControl>
              <AutoCompleteCustom
                multiple={true}
                size="small"
                sx={{ width: 130, mr: 2, mb: { xs: 1, md: 0 } }}
                loading={cityLoader}
                options={_.map(cityByMultipleStateId, (ev) => {
                  return {
                    label: `${ev.name}`,
                    value: ev.id,
                  };
                })}
                value={selectCity ?? ""}
                onChange={(event, value) => handelCityChange(value)}
                label="City"
                disabled={searchCategory?.label === "gender"}
              />
            </FormControl>
          </Box>
        </Box>
        <AnalyticLive
          liveLabelsArray={liveLabelsArray}
          liveValuesArray={liveValuesArray}
        />
      </Card>
    </div>
  );
}

export default LiveStudentChart;
