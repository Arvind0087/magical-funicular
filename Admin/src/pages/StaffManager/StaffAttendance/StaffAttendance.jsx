import { Helmet } from "react-helmet-async";
import { Box, Button, Container, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import excelDownload from '../../../assets/excel/ExcelDownload.png'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getStaffAttendanceAsync } from "redux/slices/StaffAttendanceSlice/AttendanceAsync.api";
import { months } from "./utils";
import { studentcolumns } from "./utils";
import { PATH_DASHBOARD } from "routes/paths";
import { useNavigate, useParams } from "react-router";
import { getPreviousYearsArr, getPreviousYearsObj } from 'utils/getYears'


// import { studentExcelDownloadAsync } from "redux/downloadexcel/excel.async";

export default function StaffAttendance() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const preYears = getPreviousYearsObj()
  const [getSearchMonths, setSearchMonths] = useState('')
  const [getSearchedYears, setSearchedYears] = useState('')
  const [openPopover, setOpenPopover] = useState(null);
  const [dateValue, setDateValue] = useState("");
  const [attendanceinfo, setAttendanceinfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const { attendanceLoader, attendance } = useSelector(
    (state) => state.staffAttendance
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);


  const handleDateChange = (event) => {
    const newDateValue = event.target.value;
    setDateValue(newDateValue);
  };

  const InitialAttendance = () => {
    dispatch(
      getStaffAttendanceAsync({
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
      getStaffAttendanceAsync({
        id: id,
        page: paginationpage,
        limit: perPageNumber,
        month: "",
        year: "",
      })
    );
  };

  // PAGINATION
  const handlePageChange = (page) => {
    setPaginationpage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setperPageNumber(newPerPage);
  };

  useEffect(() => {
    InitialAttendance();
  }, [paginationpage, perPageNumber]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Staff Attendance | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Staff Attendance"
        links={[
          { name: "Staff", href: "" },
          { name: "Staff List", href: `${PATH_DASHBOARD.staff}` },
          { name: "Staff Attendance" }
        ]}
        action={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Box>
              {/* <FormControl>
                <TextField
                  type="date"
                  label="Search By Date"
                  size="small"
                  sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
                  onChange={handleDateChange}
                  value={dateValue}
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
                onClick={() => InitialAttendance()}
              >
                Filter
              </Button>
              <Button
                variant="contained"
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                onClick={Reset}
              >
                <AutorenewRoundedIcon />
              </Button>
            </Box>
            <Box
              sx={{ ml: 2, mt: 0.25, borderRadius: "7px", cursor: 'pointer' }}
            // onClick={() => studentExcelDownloadAsync(searchStudent)}
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
          setAttendanceinfo,
          paginationpage
        })}
        totalcount={attendance?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
    </Container>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
