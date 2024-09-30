import { Helmet } from "react-helmet-async";
import {
  Button,
  Container,
  Box,
  TextField,
  FormControl,
  Autocomplete
} from "@mui/material";
import excelDownload from '../../../assets/excel/ExcelDownload.png'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify/Iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllStudentRequestAsync } from "redux/StudentRequest/StudentRequest.async";
import { StudentRequestcolumns } from "./utils";
import { studentCallRequestExcelAsync } from "redux/downloadexcel/excel.async";
import { getStudentFilterAsync } from '../../../redux/filter/filter.async'


export default function StudentRequest() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [studentRequestinfo, setStudentRequestInfo] = useState("");
  const [isFind, setIsFind] = useState(false);
  const [searchStudent, setSearchStudent] = useState([]);

  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const { studentRequestLoader, studentRequest } = useSelector(
    (state) => state.StudentRequest
  );

  const { filterLoader, studentFilter } = useSelector(
    (state) => state.filterInfo
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const InitialStudentRequest = ({ pageNo, paginateNo, isFindManual, isReset }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        search: searchStudent?.value
      };
    }
    if (isReset) {
      delete payload.search;
    }
    dispatch(
      getAllStudentRequestAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload
      })
    );
  }

  const resetFilter = () => {
    setIsFind(false);
    setSearchStudent([]);
    InitialStudentRequest({
      pageNo: 1,
      paginateNo: 10,
      isReset: true
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
    InitialStudentRequest({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    dispatch(getStudentFilterAsync())
  }, []);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Student Call Request | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Student Call Request"
        links={[
          { name: "Student Manager", href: "" },
          { name: "Student Call Request" },
        ]}
        action={
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <Box>
              <FormControl >
                <Autocomplete
                  size="small"
                  sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
                  disablePortal
                  value={searchStudent}
                  options={studentFilter?.map((ev) => {
                    return { label: `${ev.name}(${ev.class})`, value: ev.id };
                  })}
                  onChange={(event, value) => setSearchStudent(value)}
                  renderInput={(params) => (
                    <TextField {...params} label="Student" />
                  )}
                />
              </FormControl>
              <Button
                variant="contained"
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                onClick={() => {
                  setIsFind(true);
                  InitialStudentRequest({
                    pageNo: 1,
                    paginateNo: 10,
                    isFindManual: true
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
            </Box>
            <Box
              sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 }, cursor: 'pointer' }}
              onClick={() =>
                studentCallRequestExcelAsync({ search: searchStudent?.value })
              }
            >
              <img src={excelDownload} alt="Download Excel" width='50px' height='50px' borderRadius="40px" />
            </Box>
          </Box>
        }
      />
      <CustomTable
        columnheight="30px"
        loader={studentRequestLoader}
        data={studentRequest?.data}
        columns={StudentRequestcolumns({
          openPopover,
          handleOpenPopover,
          setStudentRequestInfo,
          paginationpage,
        })}
        totalcount={studentRequest?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
    </Container>
  );
}

const ExpandedComponent = ({ data }) => {
  return;
};
