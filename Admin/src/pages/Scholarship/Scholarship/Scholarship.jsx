import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  InputAdornment,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import Iconify from "components/iconify";
import { scholorshipAddcolumns } from "./utils";
import MenuPopupScholarship from "./Components/MenuPopupScholarship";
import { PATH_DASHBOARD } from "routes/paths";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import CustomTable from "components/CustomTable";
import { useSettingsContext } from "components/settings";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteScholarshipAddAsync,
  getAllScholorshipAddAsync,
} from "redux/slices/scholorshipSlice/async.api";
import ConfirmDialog from "components/confirm-dialog/ConfirmDialog";
import { emptyScholorship } from "redux/slices/scholorshipSlice/scholorship.slice";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";

export default function ScholarshipAdd() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [scholorshipInfo, setScholorshipInfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [isFind, setIsFind] = useState(false);
  const [searchScholarship, setSearchScholarship] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { scholorshipLoader, getAllScholorshipAdd, deleteScholarshipMaster } =
    useSelector((state) => state.scholorship);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const InitialScholarship = ({
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
        search: searchScholarship,
      };
    }
    if (isReset) delete payload.search;
    dispatch(
      getAllScholorshipAddAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload,
      })
    );
  };

  const resetFilter = () => {
    setIsFind(false);
    setSearchScholarship("");
    InitialScholarship({
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
    InitialScholarship({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    if (deleteScholarshipMaster.status === 200) {
      toast.success(deleteScholarshipMaster.message, toastoptions);
      setOpenConfirm(false);
      dispatch(emptyScholorship());
      InitialScholarship({});
    }
  }, [deleteScholarshipMaster]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Scholarship | {`${tabTitle}`}</title>
      </Helmet>

      <CustomBreadcrumbs
        // heading="Scholarship"
        links={[
          { name: "Scholarship", href: "" },
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
            <TextField
              size="small"
              sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
              value={searchScholarship}
              onChange={(e) => setSearchScholarship(e.target.value)}
              placeholder="Scholarship Title"
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
                InitialScholarship({
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
              to={PATH_DASHBOARD.createscholarship}
              component={RouterLink}
              variant="contained"
              disabled={!Boolean(modulePermit?.add)}
            >
              <AddIcon/>
            </Button>
          </Box>

        }
      />
      <CustomTable
        columnheight="30px"
        loader={scholorshipLoader}
        data={getAllScholorshipAdd?.data}
        columns={scholorshipAddcolumns({
          openPopover,
          handleOpenPopover,
          setScholorshipInfo,
          paginationpage,
        })}
        totalcount={getAllScholorshipAdd?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopupScholarship
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        scholorshipInfo={scholorshipInfo}
        paginationpage={paginationpage}
        perPageNumber={perPageNumber}
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
            loading={scholorshipLoader}
            onClick={() =>
              dispatch(deleteScholarshipAddAsync(scholorshipInfo.id))
            }
          >
            Delete
          </LoadingButton>
        }
      />
    </Container>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
