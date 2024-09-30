import { Helmet } from "react-helmet-async";
import {
  Box,
  Button,
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ButtonGroup,
  IconButton,
  Grid,
  Card,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import excelDownload from "../../../assets/excel/ExcelDownload.png";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { useSettingsContext } from "components/settings";
import Iconify from "components/iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { getStudentAsync, markStudentAttendanceAsync } from "redux/async.api";
import {
  emptyStudent,
  emptyStudentAttendance,
} from "../../../redux/slices/student.slice";
import {
  getClassWithBoardFilterAsync,
  getCheckedStudentAsync,
  coursefilterAsync,
} from "redux/filter/filter.async";
import { studentcolumns } from "./utils";
import MenuPopup from "./component/MenuPopup";
import { InputAdornment } from "@mui/material";
import { studentExcelDownloadAsync } from "redux/downloadexcel/excel.async";
import { PATH_DASHBOARD } from "routes/paths";
import { Link as RouterLink } from "react-router-dom";
import _ from "lodash";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";
import SubscriptionChange from "../SubscriptionChange/SubscriptionChange";
import MpinChange from "../MpinChange/MpinChange";
import DialogBox from "components/DialogBox/index";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import CustomImageViewer from "utils/customImageViewer";
const SUBSCRIPTION = {
  FREE: "free",
  PREMIUM: "premium",
};
export default function Subject() {
  const [getUserName, setUserName] = useState("");
  const [getUserImage, setUserImage] = useState("");
  const [openImageViewer, setOpenImageViewer] = useState(false);
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [studentInfo, setStudentInfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [searchStudent, setSearchStudent] = useState("");
  const [searchClass, setSearchClass] = useState([]);
  const [searchCourse, setSearchCourse] = useState([]);
  const [isFind, setIsFind] = useState(false);
  const [getSubscription, searchGetSubscription] = useState("");
  const [getCheckedValue, setCheckedValue] = useState([]);
  const [getCheckedAll, setCheckedAll] = useState(false);
  const [Subscription, setSubscription] = useState(false);
  const [Mpin, setMpin] = useState(false);
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const {
    studentLoader,
    studentAttendanceLoader,
    students,
    studentAttendance,
  } = useSelector((state) => state.student);
  const {
    filterLoader,
    classWithBatchFilter,
    classWithBoardFilter,
    checkedStudents,
    courseFilter,
  } = useSelector((state) => state.filterInfo);
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const InitialStudents = ({ pageNo, paginateNo, isFindManual, isReset }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        course: searchCourse?.value,
        classes: searchClass?.value,
        search: searchStudent,
        type: getSubscription,
      };
    }
    if (isReset) {
      delete payload.course;
      delete payload.classes;
      delete payload.search;
      delete payload.type;
    }
    dispatch(
      getStudentAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload,
      })
    );
  };

  const resetFilter = () => {
    setIsFind(false);
    setSearchCourse([]);
    setSearchClass([]);
    setSearchStudent("");
    searchGetSubscription("");
    InitialStudents({
      pageNo: 1,
      paginateNo: 10,
      isReset: true,
    });
  };

  // POPUPOVER
  const handleClosePopover = () => {
    setOpenPopover(null);
  };
  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  // PAGINATION
  const handlePageChange = (page) => {
    setPaginationpage(page);
  };
  const handlePerRowsChange = async (newPerPage, page) => {
    setperPageNumber(newPerPage);
  };

  useEffect(() => {
    InitialStudents({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    dispatch(coursefilterAsync({}));
    dispatch(getClassWithBoardFilterAsync({}));
  }, []);

  const subscription = [
    {
      value: "Free",
      label: "Free",
    },
    {
      value: "Premium",
      label: "Premium",
    },
  ];

  // Single Checkbox Select Section
  const handleChangeCheckbox = (data) => {
    const index = getCheckedValue.indexOf(data);
    setCheckedAll(false);
    if (index === -1) {
      setCheckedValue([...getCheckedValue, data]);
    } else {
      setCheckedValue(getCheckedValue.filter((item) => item != data));
    }
  };
  //Multiple Checkbox Select Section
  const StudentList = students?.data;
  const handleCheckedAll = (data) => {
    setCheckedAll(data);
    if (data === true) {
      const ids = StudentList.map((i) =>
        JSON.stringify({
          id: i?.id,
          type: i?.subscriptionType,
        })
      );
      setCheckedValue(ids);
    } else {
      setCheckedValue([]);
    }
  };
  const studentsSubscription = useMemo(() => {
    return getCheckedValue.map((ev) => JSON.parse(ev).type);
  }, [getCheckedValue]);
  const isAnyFree = useMemo(() => {
    return !studentsSubscription?.every((subs) => {
      return subs?.toLowerCase() === SUBSCRIPTION.PREMIUM;
    });
  }, [studentsSubscription]);

  const handleToFreeBtn = () => {
    if (getCheckedValue.length < 1)
      return toast.error("Please Select Atleast 01 Student!", toastoptions);
    if (isAnyFree)
      return toast.error("Not All Selected Options Are Premium!", toastoptions);
    handleClosePopover();
    setSubscription(true);
  };

  const isAnyPremium = useMemo(() => {
    return !studentsSubscription?.every((subs) => {
      return subs?.toLowerCase() === SUBSCRIPTION.FREE;
    });
  }, [studentsSubscription]);
  const handleToPremiumBtn = () => {
    if (getCheckedValue.length < 1)
      return toast.error("Please Select Atleast 01 Student!", toastoptions);
    if (isAnyPremium)
      return toast.error("Not All Selected Options Are Free!", toastoptions);
    handleClosePopover();
    setSubscription(true);
  };

  useEffect(() => {
    if (studentAttendance.status === 200) {
      toast.success(studentAttendance.message, toastoptions);
      dispatch(emptyStudentAttendance());
    }
  }, [studentAttendance]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Student Manager | {`${tabTitle}`}</title>
      </Helmet>

      <CustomBreadcrumbs
        // heading="Student"
        links={[
          { name: "Student Manager", href: "" },
          { name: "Student", href: "" },
        ]}
        action={
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
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
                  value={searchCourse}
                  onChange={(event, value) => setSearchCourse(value)}
                  label="Course"
                />
              </FormControl>
              <FormControl>
                <AutoCompleteCustom
                  size="small"
                  sx={{ width: 130, mr: 2, mb: { xs: 1, md: 0 } }}
                  loading={filterLoader}
                  options={_.map(classWithBoardFilter, (ev) => {
                    return {
                      label: `${ev.className} (${ev.board})`,
                      value: ev.id,
                    };
                  })}
                  value={searchClass}
                  onChange={(event, value) => setSearchClass(value)}
                  label="Class"
                />
              </FormControl>
              <TextField
                size="small"
                sx={{ width: 130, mr: 2, mb: { xs: 1, md: 0 } }}
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                placeholder="Search"
                InputProps={{
                  sx: { borderRadius: "10px !important" },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify
                        icon="eva:search-fill"
                        sx={{ color: "text.disabled" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl
                sx={{ width: 130, mr: 2, mb: { xs: 1, md: 0 } }}
                size="small"
              >
                <InputLabel size="small">Subscription</InputLabel>
                <Select
                  InputLabelProps={{ shrink: false }}
                  label="Subscription"
                  value={getSubscription}
                  onChange={(e) => searchGetSubscription(e.target.value)}
                  size="small"
                >
                  <MenuItem value="">Select Subscription</MenuItem>
                  {_.map(subscription, (evv) => {
                    return <MenuItem value={evv.value}>{evv.label}</MenuItem>;
                  })}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                onClick={() => {
                  setIsFind(true);
                  InitialStudents({
                    pageNo: 1,
                    paginateNo: 10,
                    isFindManual: true,
                  });
                }}
              >
                Filter
              </Button>
              <Button
                variant="contained"
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                onClick={resetFilter}
              >
                <AutorenewRoundedIcon />
              </Button>

              <Button
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                to={PATH_DASHBOARD.createStudent}
                component={RouterLink}
                variant="contained"
                disabled={!Boolean(modulePermit?.add)}
              >
                <PersonAddRoundedIcon />
              </Button>
              <ButtonGroup
                variant="contained"
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                orientation="horizontal"
                aria-aria-label="alignment button group"
              >
                <Button onClick={handleToFreeBtn} sx={{ mr: 1 }}>
                  To Free
                </Button>
                <Button onClick={handleToPremiumBtn}>To Premium</Button>
              </ButtonGroup>
              {getCheckedValue?.length > 0 && !studentLoader && (
                <LoadingButton
                  variant="contained"
                  loading={studentAttendanceLoader}
                  onClick={() =>
                    dispatch(
                      markStudentAttendanceAsync({
                        studentIds: getCheckedValue.map(
                          (ev) => JSON.parse(ev).id
                        ),
                      })
                    )
                  }
                >
                  Add Attendance
                </LoadingButton>
              )}

              <FormControl sx={{ mr: 0, mt: 0 }}>
                <Button
                  sx={{
                    borderRadius: "7px",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "transparent !important",
                    },
                  }}
                  onClick={() =>
                    studentExcelDownloadAsync({
                      classes: searchClass.value || "",
                      search: searchStudent || "",
                    })
                  }
                >
                  <img
                    src={excelDownload}
                    alt="Download Excel"
                    width="50px"
                    height="50px"
                    borderRadius="40px"
                  />
                </Button>
              </FormControl>
              <FormControl sx={{ mr: 0, mt: 0 }}>
                <IconButton
                  sx={{ borderRadius: "40px", cursor: "pointer" }}
                  component={RouterLink}
                  to={PATH_DASHBOARD.studentbulkupload}
                  size="large"
                >
                  <FileUploadIcon
                    sx={{
                      width: "35px",
                      height: "35px",
                      color: "primary.main",
                    }}
                  />
                </IconButton>
              </FormControl>
            </Box>

            {/*<Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box
                sx={{ borderRadius: "40px", cursor: "pointer" }}
                onClick={() =>
                  studentExcelDownloadAsync({
                    classes: searchClass.value || "",
                    search: searchStudent || "",
                  })
                }
              >
                <img
                  src={excelDownload}
                  alt="Download Excel"
                  width="50px"
                  height="50px"
                  borderRadius="40px"
                />
              </Box>
              <Box>
                <IconButton
                  sx={{ borderRadius: "40px", cursor: "pointer" }}
                  component={RouterLink}
                  to={PATH_DASHBOARD.studentbulkupload}
                  size="large"
                >
                  <FileUploadIcon
                    sx={{
                      width: "35px",
                      height: "35px",
                      color: "primary.main",
                    }}
                  />
                </IconButton>
              </Box>
                  </Box> */}
          </Box>
        }
      />
      <CustomTable
        columnheight="30px"
        loader={studentLoader}
        data={students?.data}
        columns={studentcolumns({
          openPopover,
          handleOpenPopover,
          setStudentInfo,
          paginationpage,
          handleChangeCheckbox,
          handleCheckedAll,
          getCheckedAll,
          getCheckedValue,
          setUserName,
          setUserImage,
          setOpenImageViewer,
        })}
        totalcount={students?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <CustomImageViewer
        {...{ getUserName, getUserImage, setOpenImageViewer, openImageViewer }}
      />

      <MenuPopup
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        studentInfo={studentInfo}
        setSubscription={setSubscription}
        setMpin={setMpin}
      />
      <DialogBox
        open={Subscription}
        title="Change Existing Subscription To :"
        onClose={() => setSubscription(false)}
      >
        <SubscriptionChange
          {...{
            setSubscription,
            studentInfo,
            searchStudent,
            searchClass,
            getSubscription,
            getCheckedValue,
            setCheckedValue,
            setCheckedAll,
          }}
        />
      </DialogBox>
      <DialogBox
        open={Mpin}
        title="Are you sure want to change M-Pin?"
        onClose={() => setMpin(false)}
      >
        <MpinChange
          {...{
            setMpin,
            studentInfo,
          }}
        />
      </DialogBox>
    </Container>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
