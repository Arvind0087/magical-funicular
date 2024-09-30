import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  FormControl,
  Autocomplete
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import { useEffect, useState, useCallback } from "react";
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "components/CustomTable";
import { classcolumns } from "./utils";
import MenuPopupClass from "./component/MenuPopupClass";
import { getclassAsync } from "redux/class/class.async";

import {
  getClassWithBoardFilterAsync
} from "redux/filter/filter.async";

import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import _ from "lodash";

export default function Class() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [classinfo, setClassInfo] = useState("");
  const [searchClass, setSearchClass] = useState([]);
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle)

  const [isFind, setIsFind] = useState(false);

  const { classLoader, classes } = useSelector((state) => state.class);
  const { filterLoader, classWithBatchFilter, classWithBoardFilter } =
    useSelector((state) => state.filterInfo);

  const InitialClasses = ({ pageNo, paginateNo, isFindManual, isReset }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        search: searchClass?.value
      };
    }
    if (isReset) delete payload.search;
    dispatch(
      getclassAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        status : "all",
        ...payload
      })
    );
  };

  const resetFilter = () => {
    setIsFind(false);
    setSearchClass([]);
    InitialClasses({
      pageNo: 1,
      paginateNo: 10,
      status : "all",
      isReset: true
    });
  };

  // POPUPOVER
  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };
  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  // PAGINATION
  const handlePageChange = (page) => {
    setPaginationpage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setperPageNumber(newPerPage);
  };

  useEffect(() => {
    InitialClasses({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    dispatch(getClassWithBoardFilterAsync({}));
  }, []);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Class | {`${tabTitle}`}</title>
      </Helmet>

      <CustomBreadcrumbs
        // heading="Class"
        links={[
          { name: "Master", href: "" },
          { name: "Class" }
        ]}
        action={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            <FormControl>
              <Autocomplete
                filterSelectedOptions
                size="small"
                sx={{ width: 150, mr: { xs: 20, sm: 2 }, mb: { xs: 1, sm: 0 } }}
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
                  <TextField {...params} label="Class" />
                )}
                isOptionEqualToValue={useCallback(
                  (option, value) => option.value === value.value
                )}
              />
            </FormControl>
            <Box>
              <Button
                variant="contained"
                sx={{ borderRadius: "7px", mr: 1 }}
                onClick={() => {
                  setIsFind(true);
                  InitialClasses({
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
                sx={{ borderRadius: "7px", mr: 1 }}
                onClick={resetFilter}
              >
                <AutorenewRoundedIcon />
              </Button>
              <Button
                sx={{ borderRadius: "7px", mr: 1 }}
                to={PATH_DASHBOARD.createclass}
                component={RouterLink}
                variant="contained"
                disabled={!Boolean(modulePermit?.add)}
              >
                <AddIcon />
              </Button>
            </Box>
          </Box>
        }
      />
      <CustomTable
        columnheight="30px"
        loader={classLoader}
        data={classes?.data}
        columns={classcolumns({
          openPopover,
          handleOpenPopover,
          setClassInfo,
          paginationpage
        })}
        totalcount={classes?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopupClass
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        classinfo={classinfo}
      />
    </Container>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
