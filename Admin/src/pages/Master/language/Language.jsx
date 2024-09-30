import { Helmet } from "react-helmet-async";
import { useState, useEffect, useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  InputAdornment,
  FormControl,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import MenuPopupLanguage from "./component/MenuPopupLanguage";
import { useSelector, useDispatch } from "react-redux";
import { languagecolumns } from "./utils";
import CustomTable from "components/CustomTable";
import { getAllBatchTypes } from "redux/batchtype/batchtype.async";
import { getAllBatchLanguageAsync } from "redux/language/language.async";
import { getClassWithBoardFilterAsync } from "redux/filter/filter.async";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import _ from "lodash";
export default function Batch() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [batchinfo, setBatchInfo] = useState("");
  const [searchBatch, setSearchBatch] = useState("");
  const [searchClass, setSearchClass] = useState([]);
  const [isFind, setIsFind] = useState(false);
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { allLangLoader, getAllLanguage } = useSelector(
    (state) => state.language
  );

  const { batchLoader, batches } = useSelector((state) => state.batch);

  const { filterLoader, classWithBatchFilter, classWithBoardFilter } =
    useSelector((state) => state.filterInfo);

  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const InitialBatchType = ({ pageNo, paginateNo, isFindManual, isReset }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        classes: searchClass?.value,
        search: searchBatch,
      };
    }
    if (isReset) delete payload.classes, delete payload.search;
    dispatch(
      getAllBatchLanguageAsync({
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
    setSearchBatch("");
    InitialBatchType({
      pageNo: 1,
      paginateNo: 10,
      status: "all",
      isReset: true,
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
    InitialBatchType({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    dispatch(getClassWithBoardFilterAsync({}));
  }, []);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Language | {`${tabTitle}`}</title>
      </Helmet>

      <CustomBreadcrumbs
        links={[{ name: "Master", href: "" }, { name: "Language" }]}
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
                sx={{ width: 150, mr: 2, mb: { xs: 1, sm: 0 } }}
                loading={filterLoader}
                loadingText={<CustomComponentLoader padding="0 0" size={20} />}
                value={searchClass}
                options={
                  classWithBoardFilter
                    ? _.map(classWithBoardFilter, (ev) => {
                        return {
                          label: `${ev.className} (${ev.board})`,
                          value: ev.id,
                        };
                      })
                    : []
                }
                onChange={(event, value) => setSearchClass(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Class" />
                )}
                isOptionEqualToValue={useCallback(
                  (option, value) => option.value === value.value
                )}
              />
            </FormControl>

            <TextField
              size="small"
              sx={{ width: 150, mr: 2, mb: { xs: 1, sm: 0 } }}
              value={searchBatch}
              onChange={(e) => setSearchBatch(e.target.value)}
              placeholder="Batch"
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
            <Box>
              <Button
                variant="contained"
                sx={{ borderRadius: "7px", mr: 1 }}
                onClick={() => {
                  setIsFind(true);
                  InitialBatchType({
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
                to={PATH_DASHBOARD.createlanguage}
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box></Box>
      </Box>
      <CustomTable
        columnheight="30px"
        loader={allLangLoader}
        data={getAllLanguage?.data}
        columns={languagecolumns({
          openPopover,
          handleOpenPopover,
          setBatchInfo,
          paginationpage,
        })}
        totalcount={getAllLanguage?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopupLanguage
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        batchinfo={batchinfo}
      />
    </Container>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
