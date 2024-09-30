import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import { Button, Container, Box, TextField, FormControl, Autocomplete } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import { InputAdornment } from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { getAllShortsAsync, deleteShortAsync } from "redux/async.api";
import { shortscollumns } from "./utils";
import MenuPopupShorts from "./component/MenuPopupShorts";
import { getFilterAsync } from "redux/filter/shorts/shorts.async";

import { getClassWithBatchFilterAsync, getClassWithBoardFilterAsync, getSubjectFilterAsync } from "redux/filter/filter.async";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import _ from "lodash";
export default function Subject() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [shortsinfo, setShortsinfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);

  const [searchClass, setSearchClass] = useState([]);
  const [searchSubject, setSearchSubject] = useState([]);
  const [searchShortsTitle, setSearchShortsTitle] = useState("");
  const [isFind, setIsFind] = useState(false);
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { shortsLoader, shorts, shortsdelete } = useSelector(
    (state) => state.shorts
  );
  const { shortsFilter } = useSelector((state) => state.shortsFilter);
  const { filterLoader, classWithBatchFilter, subjectFilter, classWithBoardFilter } = useSelector((state) => state.filterInfo);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const InitialShorts = ({ pageNo, paginateNo, isFindManual, isReset }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        classes: searchClass?.value,
        subjects: searchSubject?.value,
        search: searchShortsTitle,
      };
    }
    if (isReset) {
      delete payload.classes;
      delete payload.subjects;
      delete payload.search;
    }
    dispatch(
      getAllShortsAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload,
      })
    )
  };

  const resetFilter = () => {
    setIsFind(false);
    setSearchClass([]);
    setSearchSubject([]);
    setSearchShortsTitle('');
    InitialShorts({
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

  useEffect(() => {
    InitialShorts({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    dispatch(getClassWithBoardFilterAsync({}));
    dispatch(getSubjectFilterAsync({}))
  }, [])


  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Shorts | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Shorts"
        links={[
          { name: "Shorts", href: "" },
          { name: "Shorts List", href: "" },
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
            <FormControl >
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
            <FormControl >
              <Autocomplete
                filterSelectedOptions
                size="small"
                sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
                loading={filterLoader}
                loadingText={<CustomComponentLoader padding="0 0" size={20} />}
                value={searchSubject}
                options={_.map(subjectFilter, (ev) => {
                  return { label: `${ev.subjectName} (${ev.class})`, value: ev.id };
                })}
                onChange={(event, value) => setSearchSubject(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Subject" />
                )}
                isOptionEqualToValue={useCallback(
                  (option, value) => option.value === value.value
                )}
              />
            </FormControl>

            <TextField
              size="small"
              sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
              value={searchShortsTitle}
              onChange={(e) => setSearchShortsTitle(e.target.value)}
              placeholder="Shorts Title"
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
            <Button
              variant="contained"
              sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
              onClick={() => {
                setIsFind(true);
                InitialShorts({
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
            <Button
              sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
              to={PATH_DASHBOARD.createshort}
              component={RouterLink}
              variant="contained"
              disabled={!Boolean(modulePermit?.add)}
            >
              <AddIcon />
            </Button>
          </Box>
        }
      />
      <CustomTable
        columnheight="30px"
        loader={shortsLoader}
        data={shorts?.data}
        columns={shortscollumns({
          openPopover,
          handleOpenPopover,
          setShortsinfo,
          paginationpage,
        })}
        totalcount={shorts?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopupShorts
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        shortsinfo={shortsinfo}
        deleteShortAsync={deleteShortAsync}
        shortsdelete={shortsdelete}
        getAllShortsAsync={getAllShortsAsync}
        paginationpage={paginationpage}
        perPageNumber={perPageNumber}
      />
    </Container>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
