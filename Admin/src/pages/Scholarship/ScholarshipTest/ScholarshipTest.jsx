import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Autocomplete,
  FormControl
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Iconify from "components/iconify";
import { assignmentcolumns } from "./utils";
import MenuPopupAssignment from "./CreateScholarshipTest/Components/MenupopupScholarshipTest";
import { PATH_DASHBOARD } from "routes/paths";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import CustomTable from "components/CustomTable";
import { useSettingsContext } from "components/settings";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getClassWithBoardFilterAsync } from "redux/filter/filter.async";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import _ from "lodash";
import { getAllScholarshipTestAsync } from "redux/slices/scholorshipSlice/async.api";

export default function ScholarshipTest() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [assignmentInfo, setAssignmentInfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [searchClass, setSearchClass] = useState([]);
  const [isFind, setIsFind] = useState(false);
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { assignmentLoader, allAssignments } = useSelector(
    (state) => state.assignment
  );
  const { scholorshipLoader, getAllScholarshipTest } = useSelector(
    (state) => state.scholorship
  );
  const { filterLoader, classWithBatchFilter, classWithBoardFilter } =
    useSelector((state) => state.filterInfo);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const InitialAssignment = ({ pageNo, paginateNo, isFindManual, isReset }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        classes: searchClass?.value
      };
    }
    if (isReset) delete payload.classes;
    dispatch(
      getAllScholarshipTestAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload
      })
    );
  };
  const resetFilter = () => {
    setIsFind(false);
    setSearchClass([]);
    InitialAssignment({
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
    InitialAssignment({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    dispatch(getClassWithBoardFilterAsync({}));
  }, []);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title> Scholarship Test | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Scholarship Test"
        links={[
          { name: "Scholarship", href: "" },
          { name: "Scholarship Test", href: "" }
        ]}
        action={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Button
              to={PATH_DASHBOARD.createscholarshiptest}
              component={RouterLink}
              variant="contained"
              disabled={!Boolean(modulePermit?.add)}
            >
              <AddIcon />
            </Button>
          </Box>

        }
      />
      {/* <Box
          sx={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Box>
            <FormControl sx={{ mb: 2 }}>
              <Autocomplete
                filterSelectedOptions
                sx={{ width: 220, mr: 2 }}
                size="small"
                loading={filterLoader}
                loadingText={<CustomComponentLoader padding="0 0" size={20} />}
                value={searchClass}
                options={_.map(classWithBoardFilter, (ev) => {
                  return {
                    label: `${ev.className} (${ev.board})`,
                    value: ev.id
                  };
                })}
                onChange={(event, value) => setSearchClass(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Search By Class" />
                )}
                isOptionEqualToValue={useCallback(
                  (option, value) => option.value === value.value
                )}
              />
            </FormControl>

            <Button
              variant="contained"
              sx={{ ml: 2, mt: 0.25, borderRadius: "7px" }}
              onClick={() => {
                setIsFind(true);
                InitialAssignment({
                  pageNo: 1,
                  paginateNo: 10,
                  isFindManual: true
                });
              }}
            >
              Search
            </Button>
            <Button
              variant="contained"
              sx={{ ml: 0.5, mt: 0.25, borderRadius: "7px" }}
              onClick={resetFilter}
            >
              Reset
            </Button>
          </Box>
        </Box> */}

      <CustomTable
        columnheight="100px"
        loader={scholorshipLoader}
        data={getAllScholarshipTest?.data}
        columns={assignmentcolumns({
          openPopover,
          handleOpenPopover,
          setAssignmentInfo,
          paginationpage
        })}
        totalcount={getAllScholarshipTest?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopupAssignment
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        assignmentInfo={assignmentInfo}
      />
    </Container>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
