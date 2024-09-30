import { Helmet } from "react-helmet-async";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
} from "@mui/material";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import React, { useEffect, useState } from "react";
import { InputAdornment } from "@mui/material";
import { columns } from "./rows";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  addDaysToDate,
  generateDateFromTo,
  get30DateFromTodate,
} from "utils/generateDateFromTo";
import moment from "moment";
import { useFormik } from "formik";
import { _initial, _validate } from "./utils";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { createScheduleAsync } from "redux/schedule/schedule.async";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
import { PATH_DASHBOARD } from "routes/paths";
import { emptyschedule } from "redux/schedule/schedule.slice";
import { useNavigate } from "react-router-dom";
import { getAllStaffFilterAsync } from "redux/filter/filter.async";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";
import _ from "lodash";

const CreateSchedule = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { themeStretch } = useSettingsContext();
  const [date30, setdate30] = useState("");
  const [daysTotal, setDaysTotal] = useState([]);
  const [searchStaff, setSearchStaff] = useState([])
  const { filterLoader, allStaff } = useSelector((state) => state.filterInfo);
  const { userinfo } = useSelector((state) => state.userinfo);
  const { scheduleLoader, schedulescreate } = useSelector(
    (state) => state.schedule
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  useEffect(() => {
    dispatch(getAllStaffFilterAsync({}));
  }, []);

  const generateDate = (from, to) => {
    const dates = generateDateFromTo({
      start: from,
      end: to,
    });
    const MapDates = dates.map((ev) => {
      return {
        date: ev,
        availability: false,
        slots: [{ from: "", to: "" }],
      };
    });
    setDaysTotal(MapDates);
  };

  const handleCheckBox = (e, index) => {
    let updatedRow;
    const findIndex = daysTotal.at(index);
    if (!e) {
      updatedRow = {
        ...findIndex,
        availability: e,
        slots: [{ from: "", to: "" }],
      };
    } else {
      updatedRow = { ...findIndex, availability: e };
    }

    const stateInfo = [...daysTotal];
    stateInfo.splice(index, 1, { ...stateInfo[index], ...updatedRow });
    setDaysTotal(stateInfo);
  };

  const handleInputSlot = (index, evvindex) => {
    const findIndex = daysTotal.at(index);
    let updatedRow = {
      ...findIndex,
      slots: [...findIndex.slots, { from: "", to: "" }],
    };
    const stateInfo = [...daysTotal];
    stateInfo.splice(index, 1, { ...stateInfo[index], ...updatedRow });
    setDaysTotal(stateInfo);
  };

  const handleRemoveSlot = (index, evvindex) => {
    const findIndex = daysTotal.at(index);
    const IndexSlot = findIndex.slots;
    IndexSlot.splice(evvindex, 1);
    let updatedRow = {
      ...findIndex,
      slots: IndexSlot,
    };
    const stateInfo = [...daysTotal];
    stateInfo.splice(index, 1, { ...stateInfo[index], ...updatedRow });
    setDaysTotal(stateInfo);
  };

  const handleInputTime = (event, index, evvindex) => {
    const { name, value } = event.target;
    daysTotal[index].slots[evvindex][name] = value;
    const stateInfo = [...daysTotal];
    setDaysTotal(stateInfo);
  };

  const onSubmit = async (values) => {
    if (searchStaff?.value) {
      let payload = {
        teacherId: searchStaff?.value,
        breakTime: values.breakTime,
        duration: values.duration,
        date: daysTotal,
      }
      dispatch(createScheduleAsync(payload));
    } else {
      let payload = {
        teacherId: userinfo.id,
        breakTime: values.breakTime,
        duration: values.duration,
        date: daysTotal,
      }
      dispatch(createScheduleAsync(payload));
    }
  };

  useEffect(() => {
    if (schedulescreate.status === 200) {
      toast.success(schedulescreate.message, toastoptions);
      dispatch(emptyschedule());
      navigate(PATH_DASHBOARD.schedule);
    }
  }, [schedulescreate]);

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate,
  }); // FOMRIK

  useEffect(() => {
    if (formik.values.fromDate) {
      const date30val = get30DateFromTodate(formik.values.fromDate);
      setdate30(date30val);
    }
  }, [formik.values.fromDate]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title> Teacher Availability | {`${tabTitle}`} </title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Create Schedules"
        links={[
          // { name: "Dashboard", href: PATH_DASHBOARD.root },
          { name: "Schedules", href: `${PATH_DASHBOARD.schedule}` },
          { name: "Create Schedules" },
        ]}
      />
      <form onSubmit={formik.handleSubmit}>
        <Box s={{
          display: 'flex', flexDirection: 'row',
          flexWrap: 'wrap', justifyContent: 'center',
          alignItems: 'center'
        }} >
          {
            userinfo?.userType === 'superAdmin' || userinfo?.userType === 'admin' ? (
              <FormControl>
                <AutoCompleteCustom
                  size="small"
                  sx={{ width: 220, mr: 2, mb: { xs: 1, md: 1 } }}
                  loading={filterLoader}
                  options={_.map(allStaff, (ev) => {
                    return {
                      label: `${ev?.name} (${_?.capitalize?.(ev.department)})`,
                      value: ev.id,
                    };
                  })}
                  value={searchStaff}
                  onChange={(event, value) => setSearchStaff(value)}
                  label="Search Staff"
                />
              </FormControl>
            ) : null
          }
          <FormControl>
            <TextField
              size="small"
              sx={{ width: 220, mr: 2, mb: { xs: 1, md: 1 } }}
              type="date"
              name="fromDate"
              fullWidth
              inputProps={{
                min: new Date().toISOString().split("T")[0],
                max: "9999-12-31"
                // max: new Date(date30).toISOString().split("T")[0],
              }}
              error={formik.touched.fromDate && formik.errors.fromDate}
              {...formik.getFieldProps("fromDate")}
              onChange={formik.handleChange}
            />
          </FormControl>
          <FormControl>
            <TextField
              size="small"
              sx={{ width: 220, mr: 2, mb: { xs: 1, md: 0 } }}
              type="date"
              name="toDate"
              fullWidth
              inputProps={{
                min: addDaysToDate(formik.values.fromDate, 1),
                max: date30 && new Date(date30).toISOString().split("T")[0],
              }}
              error={formik.touched.toDate && formik.errors.toDate}
              {...formik.getFieldProps("toDate")}
              onChange={formik.handleChange}
              disabled={Boolean(formik.values.fromDate === "")}
            />
          </FormControl>
          <FormControl>
            <InputLabel size="small">
             Live Class Duration
            </InputLabel>
            <Select
              label="Live Class Duration"
              size="small"
              sx={{ width: 220, mr: 2, mb: { xs: 1, md: 0 } }}
              name="duration"
              error={formik.touched.duration && formik.errors.duration}
              {...formik.getFieldProps("duration")}
              onChange={formik.handleChange}
            >
              <MenuItem value="15">15 mins</MenuItem>
              <MenuItem value="30">30 mins</MenuItem>
              <MenuItem value="45">45 mins</MenuItem>
              <MenuItem value="60">60 mins</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel size="small">Break Time</InputLabel>
            <Select
              label="Break Time"
              size="small"
              sx={{ width: 220, mr: 2, mb: { xs: 1, md: 0 } }}
              name="breakTime"
              error={formik.touched.breakTime && formik.errors.breakTime}
              {...formik.getFieldProps("breakTime")}
              onChange={formik.handleChange}
            >
              <MenuItem value="0">0 mins</MenuItem>
              <MenuItem value="5">Quick 5 mins</MenuItem>
              <MenuItem value="10">10 mins</MenuItem>
              <MenuItem value="15">15 mins</MenuItem>
              <MenuItem value="20">20 mins</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
            onClick={() =>
              generateDate(formik.values.fromDate, formik.values.toDate)
            }
            disabled={Boolean(
              formik.values.fromDate === "" || formik.values.toDate === ""
            )}
          >
            Schedule
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ maxWidth: "100%" }}>
          <Box sx={{ display: "flex" }}></Box>
          <Table aria-label="customized table" sx={{ marginTop: "21px" }}>
            <TableHeading columns={columns({})} />
            <TableBody>
              {daysTotal.map((ev, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell sx={{ py: "0px !important" }}>
                      <Checkbox
                        checked={ev.availability}
                        onChange={(e) => {
                          const availability = ev.availability ? false : true;
                          handleCheckBox(availability, index);
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: "0px !important" }}>
                      {moment(ev.date).format("DD MMMM YYYY")}
                    </TableCell>
                    <TableCell sx={{ py: "0px !important" }}>
                      {moment(ev.date).format("dddd")}
                    </TableCell>
                    <TableCell sx={{ py: "0px !important" }}>
                      {ev.availability ? "Available" : "Unavailable"}
                    </TableCell>
                    <TableCell sx={{ py: "0px !important" }}>
                      {ev.slots.map((evv, evvindex) => {
                        return (
                          <Box display="flex">
                            <TimeTextField
                              width={220}
                              placeholder="From Time"
                              disabled={!ev.availability}
                              name="from"
                              value={evv.from}
                              onChange={(e) =>
                                handleInputTime(e, index, evvindex)
                              }
                              sx={{
                                margin: "10px",
                              }}
                            />
                            <TimeTextField
                              width={220}
                              placeholder="To Time"
                              disabled={!ev.availability}
                              name="to"
                              value={evv.to}
                              onChange={(e) =>
                                handleInputTime(e, index, evvindex)
                              }
                              sx={{
                                margin: "10px",
                              }}
                            />
                            <Box
                              sx={{
                                pl: "10px",
                              }}
                              display="flex"
                              alignItems="center"
                            >
                              <AddIcon
                                sx={{
                                  backgroundColor: ev.availability
                                    ? evv.from !== "" && evv.to !== ""
                                      ? "#00ab55"
                                      : "#F3F3F3"
                                    : "#F3F3F3",
                                  color: "white",
                                  margin: "5px",
                                  cursor: ev.availability
                                    ? "pointer"
                                    : "default",
                                }}
                                onClick={() => {
                                  if (ev.availability) {
                                    if (evv.from !== "" && evv.to !== "") {
                                      handleInputSlot(index, evvindex);
                                    }
                                  }
                                }}
                              />
                              <CloseIcon
                                sx={{
                                  backgroundColor: ev.availability
                                    ? ev.slots.length > 1
                                      ? "#00ab55"
                                      : "#F3F3F3"
                                    : "#F3F3F3",
                                  color: "white",
                                  margin: "5px",
                                  cursor: ev.availability
                                    ? ev.slots.length > 1
                                      ? "pointer"
                                      : "default"
                                    : "default",
                                }}
                                onClick={() => {
                                  if (ev.availability) {
                                    if (ev.length !== 1) {
                                      handleRemoveSlot(index, evvindex);
                                    }
                                  }
                                }}
                              />
                            </Box>
                          </Box>
                        );
                      })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton
            type="submit"
            variant="contained"
            disabled={
              !Boolean(
                daysTotal.find((ev) =>
                  ev.slots.every(
                    (element, index) =>
                      element.from !== "" && element.to !== ""
                  )
                )
              )
            }
            loading={scheduleLoader}
          >
            Create Schedules
          </LoadingButton>
        </Stack>
      </form>
    </Container>
  );
};
export default CreateSchedule;

const TableHeading = ({ columns }) => {
  return (
    <TableHead>
      <TableRow>
        {columns.map((ev) => {
          return (
            <TableCell
              sx={{
                backgroundColor: "#F2F3F7 !important",
                color: "#000000 !important",
                fontWeight: 700,
              }}
            >
              {ev.name}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

const TimeTextField = ({ width, placeholder, sx, disabled, ...other }) => {
  return (
    <TextField
      width={width}
      size="small"
      type="time"
      placeholder={placeholder}
      InputProps={{
        sx: { borderRadius: "10px !important" },
        startAdornment: <InputAdornment position="start"></InputAdornment>,
      }}
      sx={sx}
      disabled={disabled}
      {...other}
    />
  );
};
