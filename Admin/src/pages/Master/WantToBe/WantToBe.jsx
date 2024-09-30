import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  InputAdornment,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { noticecolumns } from "./utils";
import MenuPopup from "./component/MenuPopup";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import {
  deleteWantToBeByIdAsync,
  getAllWantToBeAsync,
} from "redux/wantotbe/wantotbe.async";
import { emptywants } from "redux/wantotbe/wantotbe.slice";
import ConfirmDialog from "components/confirm-dialog/ConfirmDialog";

export default function Want() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [wantInfo, setWantinfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [isFind, setIsFind] = useState(false);
  const { wantLoader, wants, wantdelete } = useSelector((state) => state.wants);
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle)

  const InitialWantToBe = ({ pageNo, paginateNo, isFindManual, isReset }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        search: searchTitle,
      };
    }
    if (isReset)
      delete payload.search;
    dispatch(
      getAllWantToBeAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload,
      })
    )
  }
  const resetFilter = () => {
    setIsFind(false);
    setSearchTitle('');
    InitialWantToBe({
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
    if (wantdelete.status === 200) {
      toast.success(wantdelete.message, toastoptions);
      dispatch(emptywants());
      setOpenConfirm(false);
      InitialCourse();
    }
  }, [wantdelete]);



  useEffect(() => {
    InitialWantToBe({});
  }, [paginationpage, perPageNumber]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Want To Be | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading=" Want To Be"
        links={[
          { name: "Master", href: "" },
          { name: " Want To Be", href: "" },
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
              sx={{ width: 150, mr: { xs: 20, sm: 2 }, mb: { xs: 1, sm: 0 } }}
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
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
            <Box>
              <Button
                sx={{ borderRadius: "7px", mr: 1 }}
                variant="contained"
                onClick={() => {
                  setIsFind(true);
                  InitialWantToBe({
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
                to={PATH_DASHBOARD.createwanttobe}
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
        loader={wantLoader}
        data={wants?.data}
        columns={noticecolumns({
          openPopover,
          handleOpenPopover,
          setWantinfo,
          paginationpage,
        })}
        totalcount={wants?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopup
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        wantInfo={wantInfo}
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
            loading={wantLoader}
            onClick={() => dispatch(deleteWantToBeByIdAsync(wantInfo.id))}
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
