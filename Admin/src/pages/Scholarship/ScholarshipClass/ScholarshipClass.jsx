import { Helmet } from "react-helmet-async";
import { useEffect, useState, useCallback } from "react";
import {
  Button,
  FormControl,
  TextField,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import { Container, Box } from "@mui/system";
import Iconify from "components/iconify";
import { scholorshipCreatecolumns } from "./utils";
import MenuPopupScholarshipClass from "./Components/MenuPopupScholarshipClass";
import { PATH_DASHBOARD } from "routes/paths";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import CustomTable from "components/CustomTable";
import { useSettingsContext } from "components/settings";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteClassBasedScholarshipAsync,
  getAllScholorshipByClassAsync,
} from "redux/slices/scholorshipSlice/async.api";
import { getClassWithBatchFilterAsync, getClassWithBoardFilterAsync } from "redux/filter/filter.async";

import _ from "lodash";
import { boardfilterAsync } from "redux/filter/filter.async";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import ConfirmDialog from "components/confirm-dialog/ConfirmDialog";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { emptyScholorship } from "redux/slices/scholorshipSlice/scholorship.slice";

export default function ScholorshipCreate() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [scholorshipInfo, setScholorshipInfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [searchBoard, setSearchBoard] = useState([]);
  const [searchClass, setSearchClass] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [isFind, setIsFind] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { modulePermit } = useSelector((state) => state.menuPermission);

  const {
    scholorshipLoader,
    getAllScholorshipByClass,
    deleteClassScholarship,
  } = useSelector((state) => state.scholorship);
  const { filterLoader, boardFilterInfo } = useSelector(
    (state) => state.filterInfo
  );
  const { classWithBatchFilter, classWithBoardFilter } = useSelector((state) => state.filterInfo);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const InitialScholarshipClass = ({ pageNo, paginateNo, isFindManual, isReset, }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        boards: searchBoard.value,
        classes: searchClass?.value,
        search: searchTitle,
      };
    }
    if (isReset) {
      delete payload.boards;
      delete payload.classes;
      delete payload.search;
    }
    dispatch(
      getAllScholorshipByClassAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload,
      })
    );
  };

  const resetFilter = () => {
    setIsFind(false);
    setSearchBoard([]);
    setSearchClass([]);
    setSearchTitle("");
    InitialScholarshipClass({
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
    InitialScholarshipClass({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    dispatch(boardfilterAsync());
    dispatch(getClassWithBoardFilterAsync({}));

  }, []);

  useEffect(() => {
    if (deleteClassScholarship.status === 200) {
      toast.success(deleteClassScholarship.message, toastoptions);
      dispatch(emptyScholorship());
      setOpenConfirm(false);
      InitialScholarshipClass({});
    }
  }, [deleteClassScholarship]);

  return (
    <>
      <Helmet>
        <title> Scholarship Class | {`${tabTitle}`}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? "lg" : false}>
        <CustomBreadcrumbs
          // heading="Scholarship Class"
          links={[
            { name: "Scholarship", href: "" },
            { name: "Scholarship Class", href: "" },
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
                  sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
                  loading={filterLoader}
                  loadingText={<CustomComponentLoader padding="0 0" size={20} />}
                  value={searchBoard}
                  options={_.map(boardFilterInfo, (ev) => {
                    return { label: `${ev.name} (${ev.course})`, value: ev.id };
                  })}
                  onChange={(event, value) => setSearchBoard(value)}
                  renderInput={(params) => (
                    <TextField {...params} label="Board" />
                  )}
                  isOptionEqualToValue={useCallback(
                    (option, value) => option.value === value.value
                  )}
                />
              </FormControl>
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
              <TextField
                size="small"
                sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                placeholder="Scholarship"
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
                  InitialScholarshipClass({
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
                to={PATH_DASHBOARD.createscholarshipclass}
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
          loader={scholorshipLoader}
          data={getAllScholorshipByClass}
          columns={scholorshipCreatecolumns({
            openPopover,
            handleOpenPopover,
            setScholorshipInfo,
            paginationpage,
          })}
          totalcount={getAllScholorshipByClass?.count}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          expandableRows={false}
          expandableRowsComponent={ExpandedComponent}
        />
        <MenuPopupScholarshipClass
          openPopover={openPopover}
          handleClosePopover={handleClosePopover}
          scholorshipInfo={scholorshipInfo}
          setOpenConfirm={setOpenConfirm}
        />
      </Container>
      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={scholorshipLoader}
            onClick={() =>
              dispatch(deleteClassBasedScholarshipAsync(scholorshipInfo?.id))
            }
          >
            Delete
          </LoadingButton>
        }
      />
    </>
  );
}

const ExpandedComponent = ({ data }) => {
  return;
};
