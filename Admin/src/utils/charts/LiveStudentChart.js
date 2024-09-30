import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardHeader,
  FormControl,
  TextField,
} from "@mui/material";
import moment from "moment";
import { useFormik } from "formik";
import { _initial, _validate } from "./utils";

import { useDispatch, useSelector } from "react-redux";
import { getBoardsByCourseIdAsync } from "redux/async.api";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";
import { getBatchByBoardIdAsync } from "redux/batchtype/batchtype.async";
import { getLiveUserAsync } from "redux/liveUser/live.async";
import AnalyticLive from "./AnalyticLive";

function LiveStudentChart() {
  const dispatch = useDispatch();
  const [date30, setdate30] = useState("");
  const [searchCourse, setSearchCourse] = useState(undefined);
  const [searchBoard, setSearchBoard] = useState(undefined);
  const [searchBatch, setSearchBatch] = useState(undefined);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const courseId = searchCourse && searchCourse.value;
  const boardId = searchBoard && searchBoard.value;
  const batchId = searchBatch && searchBatch.value;

  const { filterLoader, courseFilter, boardFilterInfo } = useSelector(
    (state) => state.filterInfo
  );

  const { boardLoader, boardByCourse } = useSelector((state) => state.board);

  const { getBatchByBoardId, batchLoader } = useSelector(
    (state) => state.batch
  );

  const { liveClassUser } = useSelector((state) => state.liveClassUser);

  const liveClassUserArray =
    liveClassUser && liveClassUser.map((item) => [item.label, item.value]);

  const liveLabelsArray =
    liveClassUser && liveClassUser.map((item) => [item.label]);

  const liveValuesArray =
    liveClassUser && liveClassUser.map((item) => item.value);

  const liveClassUserObject =
    liveClassUser &&
    liveClassUser.map((item) => {
      return { label: item.label, Reports: item.value };
    });

  useEffect(() => {
    if (searchCourse) {
      let payload = { courseId: searchCourse?.value };
      dispatch(getBoardsByCourseIdAsync(payload));
    }
  }, [searchCourse]);

  useEffect(() => {
    if (searchCourse === null) {
      setSearchBoard(undefined);
      setSearchBatch(undefined);
    }
  }, [searchCourse]);

  useEffect(() => {
    if (searchBoard === null) {
      setSearchBatch(undefined);
    }
  }, [searchBoard]);

  // Get current month start and end date
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const startDay = "01";
  const lastDay = new Date(currentYear, currentMonth, 0).getDate();
  const startDateString = `${currentYear}-${currentMonth
    .toString()
    .padStart(2, "0")}-${startDay}`;
  const endDateString = `${currentYear}-${currentMonth
    .toString()
    .padStart(2, "0")}-${lastDay.toString().padStart(2, "0")}`;

  useEffect(() => {
    const payload = {
      course: courseId,
      board: "",
      batch: "",
      fromDate: startDateString,
      toDate: endDateString,
    };
    dispatch(getLiveUserAsync(payload));
  }, []);

  useEffect(() => {
    if (startDate && endDate && searchCourse) {
      const payload = {
        course: courseId,
        board: boardId || "",
        batch: batchId || "",
        fromDate: startDate,
        toDate: endDate,
      };
      dispatch(getLiveUserAsync(payload));
    }
  }, [searchCourse, searchBoard, searchBatch, startDate, endDate]);

  useEffect(() => {
    if (searchBoard) {
      dispatch(
        getBatchByBoardIdAsync({
          boardId: searchBoard.value,
        })
      );
    }
  }, [searchBoard]);

  useEffect(() => {
    if (searchCourse === null) {
      setSearchBoard(undefined);
    }
  }, [searchCourse]);

  const handleChangefromDate = (e) => {
    setStartDate(e.target.value);
  };

  const handleChangeToDate = (e) => {
    setEndDate(e.target.value);
  };

  const currentDateNew = startDateString;
  const lastDateNew = endDateString;
  return (
    <Card elevaltio={7}>
      <CardHeader title="Live Class Report" />
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
          <p
            style={{
              marginTop: "10px",
              marginRight: "10px",
              fontWeight: "bold",
            }}
          >
            From:
          </p>

          <FormControl>
            <TextField
              size="small"
              sx={{ width: 220, mr: 2, mt: 1, mb: { xs: 1, md: 1 } }}
              type="date"
              name="fromDate"
              fullWidth
              inputProps={{
                    max: "9999-12-31",
                // max: new Date(date30).toISOString().split("T")[0],
              }}
              onChange={handleChangefromDate}
              defaultValue={currentDateNew}
            />
          </FormControl>

          <p
            style={{
              marginTop: "10px",
              marginRight: "10px",
              fontWeight: "bold",
            }}
          >
            To:
          </p>
          <FormControl>
            <TextField
              size="small"
              sx={{ width: 220, mr: 2, mb: { xs: 1, md: 0 } }}
              type="date"
              name="toDate"
              fullWidth
              inputProps={{
                // min: addDaysToDate(formik.values.fromDate, 1),
                max: date30 && new Date(date30).toISOString().split("T")[0],
              }}
              onChange={handleChangeToDate}
              defaultValue={lastDateNew}
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
              value={searchCourse ?? ""}
              onChange={(event, value) => setSearchCourse(value)}
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
              value={searchBoard ?? ""}
              onChange={(event, value) => setSearchBoard(value)}
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
              value={searchBatch ?? ""}
              onChange={(event, value) => setSearchBatch(value)}
              label="Batch"
            />
          </FormControl>
        </Box>
      </Box>
      <AnalyticLive
        liveLabelsArray={liveLabelsArray}
        liveValuesArray={liveValuesArray}
      />
    </Card>
  );
}

export default LiveStudentChart;
