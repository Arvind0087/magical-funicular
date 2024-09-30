import React from "react";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Container,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import MenuPopupBoard from "./component/MenuPopupBoard";
import { useSelector, useDispatch } from "react-redux";
import { Banners, bannercolumns } from "./utils";
import CustomTable from "components/CustomTable";
import {
  getAllBannerAsync,
  deleteBannerByIdAsync
} from "redux/banner/banner.async";
import { emptybanner } from "redux/banner/banner.slice";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";
import { getClassWithBoardFilterAsync } from "redux/filter/filter.async";
import ConfirmDialog from "../../Shorts/component/DeleteShorts";

function Banner() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [bannerinfo, setBannerinfo] = useState("");
  const [searchBanner, SetSearchBanner] = useState([]);
  const [searchClass, setSearchClass] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isFind, setIsFind] = useState(false);
  const { modulePermit } = useSelector((state) => state.menuPermission);

  const { bannerLoader, banner, deleteBannerById } = useSelector(
    (state) => state.banner
  );
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );
  const { filterLoader, classWithBatchFilter, classWithBoardFilter } =
    useSelector((state) => state.filterInfo);



  const InitialBanner = ({ pageNo, paginateNo, isFindManual, isReset }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        search: searchBanner,
        classes: searchClass?.value
      };
    }
    if (isReset) {
      delete payload.search;
      delete payload.classes;
    }
    dispatch(
      getAllBannerAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload
      })
    );
  };

  const resetFilter = () => {
    setIsFind(false);
    SetSearchBanner([]);
    setSearchClass([]);
    InitialBanner({
      pageNo: 1,
      paginateNo: 10,
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

  const handlempty = () => {
    dispatch(emptybanner());
  };

  useEffect(() => {
    InitialBanner({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    dispatch(getClassWithBoardFilterAsync({}));
  }, []);

  useEffect(() => {
    if (deleteBannerById.status === 200) {
      toast.success(deleteBannerById.message, toastoptions);
      dispatch(emptybanner());
      setOpenConfirm(false);
      InitialBanner({});
    }
  }, [deleteBannerById]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Banner | {`${tabTitle}`}</title>
      </Helmet>

      <CustomBreadcrumbs
        // heading="Banner"
        links={[
          { name: "Master", href: "" },
          { name: "Banner" }
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
              <AutoCompleteCustom
                size="small"
                sx={{ width: 150, mr: 2, mb: { xs: 1, sm: 0 } }}
                loading={filterLoader}
                options={_.map(classWithBoardFilter, (ev) => {
                  return {
                    label: `${ev.className} (${ev.board})`,
                    value: ev.id
                  };
                })}
                value={searchClass}
                onChange={(event, value) => setSearchClass(value)}
                label="Class"
              />
            </FormControl>
            <FormControl
              size="small"
              sx={{ width: 150, mr: { xs: 15, sm: 2 }, mb: { xs: 1, sm: 0 } }}
            >
              <InputLabel id="demo-simple-select-label" size="small">
                Banner
              </InputLabel>
              <Select
                label="Banner"
                value={searchBanner}
                onChange={(e) => SetSearchBanner(e.target.value)}
                size="small"
              >
                {Banners.map((ev, index) => (
                  <MenuItem key={ev.id} value={ev.value}>
                    {ev.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box>
              <Button
                sx={{ borderRadius: "7px", mr: 1 }}
                variant="contained"
                onClick={() => {
                  setIsFind(true);
                  InitialBanner({
                    pageNo: 1,
                    paginateNo: 10,
                    isFindManual: true
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
                to={PATH_DASHBOARD.createbanner}
                component={RouterLink}
                variant="contained"
                onClick={handlempty}
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
        loader={bannerLoader}
        data={banner?.data}
        columns={bannercolumns({
          openPopover,
          handleOpenPopover,
          setBannerinfo,
          paginationpage
        })}
        totalcount={banner?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />

      <MenuPopupBoard
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        bannerinfo={bannerinfo}
        setOpenConfirm={setOpenConfirm}
      />
      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={bannerLoader}
            onClick={() => dispatch(deleteBannerByIdAsync(bannerinfo.id))}
          >
            Delete
          </LoadingButton>
        }
      />
    </Container>
  );
}

export default Banner;

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
