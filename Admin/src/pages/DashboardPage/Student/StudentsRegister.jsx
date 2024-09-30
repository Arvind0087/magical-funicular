import { Helmet } from "react-helmet-async";
import { Box, Button, Container, TextField } from "@mui/material";
import excelDownload from "../../../assets/excel/ExcelDownload.png";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { useSettingsContext } from "components/settings";
import Iconify from "components/iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { usersBypackageIdAsync, getStudentAsync } from "redux/async.api";
import { emptyStudentAttendance } from "../../../redux/slices/student.slice";
import { studentcolumns } from "./utilsRegister";
import MenuPopup from "./component/MenuPopup";
import { InputAdornment } from "@mui/material";
import { packageSellsExcelReportAsync } from "redux/downloadexcel/excel.async";
import { PATH_DASHBOARD } from "routes/paths";
import { Link as RouterLink } from "react-router-dom";
import _ from "lodash";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import CustomImageViewer from "utils/customImageViewer";

export default function StudentsRegister({ courseInfo }) {
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
  const [getCheckedValue, setCheckedValue] = useState([]);
  const [getCheckedStudent, setGetCheckedStudent] = useState([]);
  const [getCheckedAll, setCheckedAll] = useState(false);
  const { studentLoader, students } = useSelector((state) => state.student);

  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  useEffect(() => {
    const payload = {
      page: paginationpage,
      limit: perPageNumber,
      courseId: courseInfo?.courseId,
      search: "",
    };
    dispatch(getStudentAsync(payload));
  }, [paginationpage, perPageNumber, courseInfo?.courseId]);

  const resetFilter = () => {
    // setSearchCourse([]);
    // setSearchClass([]);
    setSearchStudent("");
    setPaginationpage(1);
    // searchGetSubscription("");

    const payload = {
      page: 1,
      limit: 10,
      courseId: courseInfo?.courseId,
      search: "",
    };
    dispatch(getStudentAsync(payload));
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
      const onlyIds = StudentList.map((item) => item?.id);

      setCheckedValue(ids);
      setGetCheckedStudent(onlyIds);
    } else {
      setCheckedValue([]);
      setGetCheckedStudent([]);
    }
  };

  const filterStudent = () => {
    let payload = {
      page: 1,
      limit: 10,
      courseId: courseInfo?.courseId,
      search: searchStudent,
    };
    dispatch(getStudentAsync(payload));
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
              {courseInfo?.courseName}
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
            </Box>
          </>
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
        getCheckedValue={getCheckedValue}
      ></MenuPopup>
    </Container>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
