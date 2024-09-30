import { Helmet } from "react-helmet-async";
import {
  Button,
  Container,
  InputAdornment,
  Box,
  TextField,
  Autocomplete,
  FormControl
} from "@mui/material";
import excelDownload from 'assets/excel/ExcelDownload.png'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify/Iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { getAllScholarshipAppAsync } from "redux/slices/ScholarshipApplicationSlice/scholarshipApp.async.api";
import { scholarshipDownloadAsync } from "redux/downloadexcel/excel.async";
import { getClassWithBatchFilterAsync, getClassWithBoardFilterAsync } from "redux/filter/filter.async";
import MenuPopupView from "./component/MenuPopupView";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import _ from "lodash";
import { applicationcolumns } from "./utils";

export default function ScholarshipApplication() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [searchName, setsearchName] = useState("");
  const [isFind, setIsFind] = useState(false);
  const [reportInfo, setReportinfo] = useState("");
  const [searchClass, setSearchClass] = useState([]);
  const { scholarshipAppLoader, scholarshipApp } = useSelector(
    (state) => state.scholarshipApp
  );
  const { filterLoader, classWithBatchFilter, classWithBoardFilter } = useSelector((state) => state.filterInfo);
  const [openPopover, setOpenPopover] = useState(null);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const InitialApplication = ({
    pageNo,
    paginateNo,
    isFindManual,
    isReset,
  }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        search: searchName,
        classes: searchClass?.value,
      };
    }
    if (isReset) {
      delete payload.search;
      delete payload.classes;
    }
    dispatch(
      getAllScholarshipAppAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload,
      })
    );
  };

  const resetFilter = () => {
    setIsFind(false);
    setsearchName("");
    setSearchClass([])
    InitialApplication({
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

  //CALL API OF API FUNCTION
  useEffect(() => {
    InitialApplication({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    dispatch(getClassWithBoardFilterAsync({}));
  }, [])


  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Scholarship Application | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Scholarship Application"
        links={[
          { name: "Scholarship Application" },
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
              <FormControl>
                <Autocomplete
                  filterSelectedOptions
                  size="small"
                  sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
                  loading={filterLoader}
                  loadingText={<CustomComponentLoader padding="0 0" size={20} />}
                  value={searchClass}
                  options={_.map(classWithBoardFilter, (ev) => {
                    return { label: `${ev.className} (${ev.board})`, value: ev.id };
                  })}
                  onChange={(event, value) => setSearchClass(value)}
                  renderInput={(params) => (
                    <TextField {...params} label="Class" />
                  )}
                  isOptionEqualToValue={useCallback(
                    (option, value) => option.value === value.value
                  )}
                />
              </FormControl>
              <FormControl>
                <TextField
                  size="small"
                  sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
                  value={searchName}
                  onChange={(e) => setsearchName(e.target.value)}
                  placeholder="Student"
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
              </FormControl>
              <Button
                variant="contained"
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                onClick={() => {
                  setIsFind(true);
                  InitialApplication({
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
            </Box>
            <Box
              sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 }, cursor: 'pointer' }}
              onClick={() => scholarshipDownloadAsync({
                search: searchName,
                classes: searchClass?.value,
              })}
            >
              <img src={excelDownload} alt="Download Excel" width='50px' height='50px' borderRadius="40px" />
            </Box>
          </Box>
        }
      />
      <CustomTable
        columnheight="30px"
        loader={scholarshipAppLoader}
        data={scholarshipApp?.data}
        columns={applicationcolumns({
          openPopover,
          handleOpenPopover,
          setReportinfo,
          paginationpage,
        })}
        totalcount={scholarshipApp?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopupView
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        reportInfo={reportInfo}

      />
    </Container >
  );
}

const ExpandedComponent = ({ data }) => {
  return;
};
