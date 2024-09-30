import React, { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Button,
  Container,
  TextField,
  InputAdornment,
  Autocomplete,
  FormControl,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import excelDownload from '../../../assets/excel/ExcelDownload.png'
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import { useDispatch, useSelector } from "react-redux";
import { emptyByid, emptycity } from "redux/city/cities.slice";
import { CityExcelDownloadAsync } from "redux/downloadexcel/excel.async";
import { getCityAsync, deleteCityByIdAsync } from "redux/city/cities.async";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import CustomTable from "components/CustomTable";
import { columns } from "./utils";
import ConfirmDialog from "../../Shorts/component/DeleteShorts";
import MenuPopupBoard from "./component/MenupopupCity";
import AddState from "./CreateCity/CreateCity";
import { LoadingButton } from "@mui/lab";
import DialogBox from "components/DialogBox/index";
import _ from "lodash";
import { getStateFilterAsync } from "redux/filter/filter.async";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";

export default function City() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [actionModal, setActionModal] = useState(false);
  const [IsFlagAction, setIsFlagAction] = useState(false);
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [InfoId, setInfoId] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [searchName, setsearchName] = useState([]);
  const [searchCity, setsearchCity] = useState("");
  const [isFind, setIsFind] = useState(false);
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { cityLoader, city, deleteCityById } = useSelector(
    (state) => state.city
  );
  const { stateLoader, states } = useSelector((state) => state.state);
  const { filterLoader, stateFilter } = useSelector((state) => state.filterInfo);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle)



  const InitialCities = ({ pageNo, paginateNo, isFindManual, isReset }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        city: searchCity,
        state: searchName?.value,
      };
    }
    if (isReset) {
      delete payload.city, delete payload.state;
    }
    dispatch(
      getCityAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload,
      })
    )
  };
  const resetFilter = () => {
    setIsFind(false);
    setsearchName([]);
    setsearchCity('');
    InitialCities({
      pageNo: 1,
      paginateNo: 10,
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
    InitialCities({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    dispatch(getStateFilterAsync({}));
  }, [])


  useEffect(() => {
    if (deleteCityById.status === 200) {
      toast.success(deleteCityById.message, toastoptions);
      dispatch(emptycity());
      setOpenConfirm(false);
      InitialCities({});
      setInfoId("");
    }
  }, [deleteCityById]);

  const handleCloseActionModal = () => {
    setInfoId("");
    setActionModal(false);
    setIsFlagAction(false);
    dispatch(emptyByid());
  };

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>City | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="City"
        links={[
          { name: "Master", href: "" },
          { name: "City" },
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
                  sx={{ width: 150, mr: 2, mb: { xs: 1, sm: 0 } }}
                  loading={filterLoader}
                  loadingText={<CustomComponentLoader padding="0 0" size={20} />}
                  value={searchName}
                  options={_.map(stateFilter, (ev) => {
                    return { label: `${ev.name}`, value: ev.name };
                  })}
                  onChange={(event, value) => setsearchName(value)}
                  renderInput={(params) => (
                    <TextField {...params} label="State" />
                  )}
                  isOptionEqualToValue={useCallback(
                    (option, value) => option.value === value.value
                  )}
                />
              </FormControl>
              <TextField
                size="small"
                sx={{ width: 150, mr: { xs: 20, sm: 2 }, mb: { xs: 1, sm: 0 } }}
                value={searchCity}
                onChange={(e) => setsearchCity(e.target.value)}
                placeholder="Cities"
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
                sx={{ borderRadius: "7px", mr: 1 }}
                variant="contained"
                onClick={() => {
                  setIsFind(true);
                  InitialCities({
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
                variant="contained"
                onClick={() => setActionModal(true)}
                disabled={!Boolean(modulePermit?.add)}
              >
                <AddIcon />
              </Button>
            </Box>
            <Box
              sx={{ borderRadius: "7px", mr: 1 }}
              onClick={() => CityExcelDownloadAsync({
                state: searchName?.label || '',
                city: searchCity || '',
              })}
            >
              <img src={excelDownload} alt="Download Excel" width='50px' height='50px' borderRadius="40px" />
            </Box>
          </Box>
        }
      />
      <CustomTable
        columnheight="30px"
        loader={cityLoader}
        data={city?.data}
        columns={columns({
          openPopover,
          handleOpenPopover,
          setInfoId,
          paginationpage,
        })}
        totalcount={city?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopupBoard
        {...{
          openPopover,
          handleClosePopover,
          setActionModal,
          setIsFlagAction,
          setOpenConfirm,
        }}
      />
      {/* CITY ADD & EDIT MODAL */}
      <DialogBox
        open={actionModal}
        title={IsFlagAction ? "Update City" : "Create City"}
        onClose={handleCloseActionModal}
      >
        <AddState
          {...{
            setActionModal,
            InfoId,
            InitialCities,
            setInfoId,
            IsFlagAction,
            setIsFlagAction,
          }}
        />
      </DialogBox>

      <ConfirmDialog
        open={openConfirm}
        // onClose={() => false}
        onClose={() => setOpenConfirm(false)}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={cityLoader}
            onClick={() => dispatch(deleteCityByIdAsync(InfoId))}
          >
            Delete
          </LoadingButton>
        }
      />
    </Container >
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
