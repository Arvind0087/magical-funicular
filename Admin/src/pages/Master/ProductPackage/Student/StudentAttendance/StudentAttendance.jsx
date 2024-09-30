import { Helmet } from "react-helmet-async";
import { Box, Button, Container, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import excelDownload from 'assets/excel/ExcelDownload.png'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllAttendanceAsync } from "redux/slices/StudentAttendanceSlice/AttendanceAsync.api";
import { studentcolumns } from "./utils";
import { PATH_DASHBOARD } from "routes/paths";
import { studentExcelDownloadAsync } from "redux/downloadexcel/excel.async";
import { months } from "./component/utils"
import { getPreviousYearsArr, getPreviousYearsObj } from 'utils/getYears'
import { useNavigate, useParams } from "react-router";

export default function Subject() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const preYears = getPreviousYearsObj()
  const { id } = useParams();
  const [openPopover, setOpenPopover] = useState(null);
  const [getSearchMonths, setSearchMonths] = useState('')
  const [getSearchedYears, setSearchedYears] = useState('')
  const [attendanceinfo, setAttendanceinfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const { attendanceLoader, attendance } = useSelector(
    (state) => state.attendance
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const [searchStudent, setSearchStudent] = useState("");

  const InitialCourse = () => {
    dispatch(
      getAllAttendanceAsync({
        id: id,
        page: paginationpage,
        limit: perPageNumber,
        month: getSearchMonths,
        year: getSearchedYears,
      })
    );
  };
  const Reset = () => {
    dispatch(
      getAllAttendanceAsync({
        id: id,
        page: paginationpage,
        limit: perPageNumber,
        month: "",
        year: "",
      })
    );;
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
    InitialCourse({});
  }, [paginationpage, perPageNumber]);


  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Student Attendance | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Student Attendance"
        links={[
          { name: "Student Manager", href: "" },
          { name: "Student", href: (`${PATH_DASHBOARD.student}`) },
          { name: "Student Attendance" },
        ]}
        action={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              mb: 1,
              mt: 1
            }}
          >
            <Box>
              {/* <FormControl>
                <TextField
                  size="small"
                  sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
                  type="date"
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  label="Search By Date"
                  InputLabelProps={{
                    shrink: true
                  }}
                  inputProps={{
                    format: "dd/MM/yy"
                  }}
                />
              </FormControl> */}
              <FormControl size="small">
                <InputLabel size="small">Months</InputLabel>
                <Select
                  size="small"
                  sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
                  label="Months"
                  value={getSearchMonths}
                  onChange={(e) => setSearchMonths(e.target.value)}
                >
                  <MenuItem value="">Months</MenuItem>
                  {
                    months?.map(ev => (
                      <MenuItem key={ev?.id} value={ev?.value}>{ev?.label}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
              <FormControl size="small">
                <InputLabel size="small">Years</InputLabel>
                <Select
                  size="small"
                  sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
                  label="Years"
                  value={getSearchedYears}
                  onChange={(e) => setSearchedYears(e.target.value)}
                >
                  <MenuItem value="">Years</MenuItem>
                  {
                    preYears?.map((ev, index) => (
                      <MenuItem key={ev?.index} value={ev?.value}>{ev?.label}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
              <Button
                variant="contained"
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                onClick={() => InitialCourse()}
              >
                Filter
              </Button>
              <Button
                variant="contained"
                loading={attendanceLoader}
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                onClick={Reset}
              >
                <AutorenewRoundedIcon />
              </Button>
            </Box>
            <Box
              sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 }, cursor: 'pointer' }}
              onClick={() => studentExcelDownloadAsync(searchStudent)}
            >
              <img src={excelDownload} alt="Download Excel" width='50px' height='50px' borderRadius="40px" />
            </Box>
          </Box>
        }
      />
      <CustomTable
        columnheight="30px"
        loader={attendanceLoader}
        data={attendance?.data}
        columns={studentcolumns({
          openPopover,
          handleOpenPopover,
          setAttendanceinfo,
          paginationpage,
        })}
        totalcount={attendance?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      {/* <MenuPopup
          openPopover={openPopover}
          handleClosePopover={handleClosePopover}
          attendanceinfo={attendanceinfo}
        /> */}
    </Container>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
