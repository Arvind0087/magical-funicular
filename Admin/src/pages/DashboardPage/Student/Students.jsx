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
import {
  getStudentAsync,
  markStudentAttendanceAsync,
  usersBypackageIdAsync,
  deleteStudentCoursePackgeAsync,
} from "redux/async.api";
import {
  emptyStudent,
  emptyStudentAttendance,
} from "../../../redux/slices/student.slice";
import { studentcolumns } from "./utils";
import MenuPopup from "./component/MenuPopup";
import { InputAdornment } from "@mui/material";
import { packageSellsExcelReportAsync } from "redux/downloadexcel/excel.async";
import { PATH_DASHBOARD } from "routes/paths";
import { Link as RouterLink } from "react-router-dom";
import _ from "lodash";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import CustomImageViewer from "utils/customImageViewer";

export default function Students({ packageInfo, startDate, endDate }) {
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
  const [getCheckedStudent, setGetCheckedStudent] = useState([]);
  const [getCheckedAll, setCheckedAll] = useState(false);
  const [Subscription, setSubscription] = useState(false);
  const [Mpin, setMpin] = useState(false);
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const {
    studentLoader,
    studentAttendanceLoader,
    students,
    studentAttendance,
    usersByPackageIdLoader,
    usersByPackageId,
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

  useEffect(() => {
    const payload = {
      page: paginationpage,
      limit: perPageNumber,
      packageId: packageInfo?.id,
      fromDate: startDate || "",
      toDate: endDate || "",
      search: "",
    };
    dispatch(usersBypackageIdAsync(payload));
  }, [paginationpage, perPageNumber]);

  const resetFilter = () => {
    setIsFind(false);
    // setSearchCourse([]);
    // setSearchClass([]);
    setSearchStudent("");
    // searchGetSubscription("");

    const payload = {
      page: 1,
      limit: 10,
      packageId: packageInfo?.id,
      fromDate: startDate || "",
      toDate: endDate || "",
      search: "",
    };
    dispatch(usersBypackageIdAsync(payload));
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

  // Single Checkbox Select Section
  const handleChangeCheckbox = (data) => {
    let parsedData = JSON.parse(data);
    const index = getCheckedValue.indexOf(data);
    setCheckedAll(false);
    if (index === -1) {
      setCheckedValue([...getCheckedValue, data]);
      setGetCheckedStudent([...getCheckedStudent, parsedData?.id]);
    } else {
      setCheckedValue(getCheckedValue.filter((item) => item != data));
      setGetCheckedStudent(
        getCheckedStudent.filter((item) => item != parsedData?.id)
      );
    }
  };

  //Multiple Checkbox Select Section
  const StudentList = usersByPackageId?.data;
  const handleCheckedAll = (data) => {
    setCheckedAll(data);
    if (data === true) {
      const ids = StudentList.map((i) =>
        JSON.stringify({
          id: i?.id,
          type: i?.subscriptionType,
        })
      );
      const onlyIds = StudentList.map((item) => item?.id);

      setCheckedValue(ids);
      setGetCheckedStudent(onlyIds);
    } else {
      setCheckedValue([]);
      setGetCheckedStudent([]);
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

  const isAnyPremium = useMemo(() => {
    return !studentsSubscription?.every((subs) => {
      return subs?.toLowerCase() === SUBSCRIPTION.FREE;
    });
  }, [studentsSubscription]);

  useEffect(() => {
    if (studentAttendance.status === 200) {
      toast.success(studentAttendance.message, toastoptions);
      dispatch(emptyStudentAttendance());
    }
  }, [studentAttendance]);

  const filterStudent = () => {
    let payload = {
      page: 1,
      limit: 10,
      packageId: packageInfo?.id,
      fromDate: startDate || "",
      toDate: endDate || "",
      search: searchStudent,
    };
    dispatch(usersBypackageIdAsync(payload));
  };

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Student Manager | {`${tabTitle}`}</title>
      </Helmet>

      <CustomBreadcrumbs
        links={
          [
            // { name: "Package Manager", href: "" },
            // { name: "Student", href: "" },
          ]
        }
        action={
          <>
            <Box
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: "16px",
                color: "#1976d6",
              }}
            >
              {packageInfo?.packageName}
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
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
                <TextField
                  size="small"
                  sx={{ width: 130, mr: 2, mb: { xs: 1, md: 0 } }}
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  placeholder="Search"
                  InputProps={{
                    sx: {
                      borderRadius: "10px !important",
                    },
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ cursor: "pointer !important" }}
                      >
                        <Iconify
                          icon="eva:search-fill"
                          sx={{
                            color: "text.disabled",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                  onClick={filterStudent}
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
              </Box>

              <Box>
                <Box
                  sx={{ borderRadius: "40px", cursor: "pointer" }}
                  onClick={() =>
                    packageSellsExcelReportAsync({
                      packageId: packageInfo?.id,
                      fromDate: startDate || "",
                      toDate: endDate || "",
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
              </Box>
            </Box>
          </>
        }
      />
      <CustomTable
        columnheight="30px"
        loader={usersByPackageIdLoader}
        data={usersByPackageId?.data}
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
        totalcount={usersByPackageId?.count}
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
        getCheckedValue={getCheckedValue}
      />
      {/*<DialogBox
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
      </DialogBox>*/}
    </Container>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
