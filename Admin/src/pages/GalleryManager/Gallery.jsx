import * as React from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Button,
  Container,
  TextField,
  InputAdornment,
  FormControl,
  Autocomplete,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import Iconify from "components/iconify/Iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  deleteGalleryByIdAsync,
  getAllGalleryAsync,
} from "redux/slices/GallerySlice/gallery.async.api";
import { gallarycolumns, _type } from "./utils";
import MenuPopup from "./component/MenuPopupGallery";
import ConfirmDialog from "../Shorts/component/DeleteShorts";
import { LoadingButton } from "@mui/lab";
import { emptygallery } from "redux/slices/GallerySlice/gallery.slice";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { PATH_DASHBOARD } from "routes/paths";
import { capitalize } from "lodash";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import { Link as RouterLink } from "react-router-dom";

export default function Gallery() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [galleryinfo, setgalleryInfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openView, setopenView] = useState(false);
  const [searchTypes, setSearchTypes] = useState([]);
  const [searchAny, setSearchAny] = useState('');
  const [isFind, setIsFind] = useState(false);
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { galleryLoader, gallery, gallerydelete } = useSelector(
    (state) => state.gallery
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const InitialGallaryManager = ({
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
        type: searchTypes?.value,
        title: searchAny,
      };
    }
    if (isReset) {
      delete payload.type;
      delete payload.title;
    }
    dispatch(
      getAllGalleryAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload,
      })
    );
  };

  const resetFilter = () => {
    setIsFind(false);
    // setSearchTypes();
    // setSearchTypes([]);
    setSearchAny("");
    InitialGallaryManager({
      pageNo: 1,
      paginateNo: 10,
      isReset: true,
    });
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };
  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handlePageChange = (page) => {
    setPaginationpage(page);
  };
  const handlePerRowsChange = async (newPerPage, page) => {
    setperPageNumber(newPerPage);
  };

  useEffect(() => {
    InitialGallaryManager({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    if (gallerydelete.status === 200) {
      toast.success(gallerydelete.message, toastoptions);
      dispatch(emptygallery());
      setOpenConfirm(false);
      InitialGallaryManager({});
    }
  }, [gallerydelete]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Gallery Manager | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Gallery Manager"
        links={[
          // { name: "Dashboard", href: PATH_DASHBOARD.root },
          { name: "Gallery Manager" },
        ]}
        action={
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {/* <FormControl>
              <Autocomplete
                size="small"
                  sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
                loadingText={<CustomComponentLoader padding="0 0" size={20} />}
                value={searchTypes}
                options={_.map(_type, (ev) => {
                  return { label: capitalize(ev.label), value: ev.value };
                })}
                onChange={(event, value) => setSearchTypes(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Type" />
                )}
              />
            </FormControl> */}
            <TextField
              size="small"
              sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
              value={searchAny}
              onChange={(e) => setSearchAny(e.target.value)}
              placeholder="Title"
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
                InitialGallaryManager({
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
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.creategallery}
              disabled={!Boolean(modulePermit?.add)}
            >
              <AddIcon />
            </Button>
          </Box>

        }
      />
      <CustomTable
        columnheight="30px"
        loader={galleryLoader}
        data={gallery?.data}
        columns={gallarycolumns({
          openPopover,
          handleOpenPopover,
          setgalleryInfo,
          paginationpage,
        })}
        totalcount={gallery?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopup
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        galleryinfo={galleryinfo}
        setOpenConfirm={setOpenConfirm}
        setopenView={setopenView}
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
            loading={galleryLoader}
            onClick={() => dispatch(deleteGalleryByIdAsync(galleryinfo.id))}
          >
            Delete
          </LoadingButton>
        }
      />
    </Container>
  );
}

const ExpandedComponent = ({ data }) => {
  return;
};
