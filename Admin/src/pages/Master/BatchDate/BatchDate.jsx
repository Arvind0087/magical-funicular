import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Autocomplete,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { batchdatecolumns } from "./utils";
import MenuPopupBatchDate from "./components/MenuPopupBatchDate";
import { getAllBatchDatesAsync } from "redux/batchdate/batchdate.async";
import { getClassWithBoardFilterAsync } from "redux/filter/filter.async";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import _ from "lodash";

export default function Date() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [batchdateinfo, setBatchdateinfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [searchClass, setSearchClass] = useState([]);
  const [isFind, setIsFind] = useState(false);
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const { batchdateLoader, batchdate } = useSelector(
    (state) => state.batchdate
  );
  const { filterLoader, classWithBatchFilter, classWithBoardFilter } =
    useSelector((state) => state.filterInfo);

  const InitialBatchDate = ({ pageNo, paginateNo, isFindManual, isReset }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        classes: searchClass?.value,
      };
    }
    if (isReset) delete payload.search;
    dispatch(
      getAllBatchDatesAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        status: "all",
        ...payload,
      })
    );
  };
  const resetFilter = () => {
    setIsFind(false);
    setSearchClass([]);
    InitialBatchDate({
      pageNo: 1,
      paginateNo: 10,
      status: "all",
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
    InitialBatchDate({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    dispatch(getClassWithBoardFilterAsync({}));
  }, []);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Batch Date | {`${tabTitle}`}</title>
      </Helmet>

      <CustomBreadcrumbs
        // heading="Batch Date"
        links={[
          { name: "Master", href: "" },
          { name: "Batch Date", href: "" },
        ]}
        action={
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              flexWrap: "wrap",
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
                    value: ev.id,
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
                sx={{ borderRadius: "7px", mr: 1 }}
                variant="contained"
                onClick={() => {
                  setIsFind(true);
                  InitialBatchDate({
                    pageNo: 1,
                    paginateNo: 10,
                    isFindManual: true,
                  });
                }}
              >
                Filter
              </Button>
              <Button
                sx={{ borderRadius: "7px", mr: 1 }}
                variant="contained"
                onClick={resetFilter}
              >
                <AutorenewRoundedIcon />
              </Button>
              <Button
                sx={{ borderRadius: "7px", mr: 1 }}
                to={PATH_DASHBOARD.createbatchdate}
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
        loader={batchdateLoader}
        data={batchdate?.data}
        columns={batchdatecolumns({
          openPopover,
          handleOpenPopover,
          setBatchdateinfo,
          paginationpage,
        })}
        totalcount={batchdate?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopupBatchDate
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        batchdateinfo={batchdateinfo}
      />
    </Container>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
