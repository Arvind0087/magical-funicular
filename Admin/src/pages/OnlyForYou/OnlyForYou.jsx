import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Container,
  InputAdornment,
  Box,
  TextField
} from "@mui/material";
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import AddIcon from '@mui/icons-material/Add';
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify/Iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
// import "./Only.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  deleteOnlyByIdAsync,
  getAllOnlyForYouAsync,
  updateOnlyForYouStatusAsync
} from "redux/async.api";
import { onlycolumns } from "./utils";
import MenuPopup from "./component/MenuPopup";
import ConfirmDialog from "../Shorts/component/DeleteShorts";

import { LoadingButton } from "@mui/lab";
import { emptyonly } from "redux/slices/only.slice";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";

export default function Only() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const { modulePermit } = useSelector((state) => state.menuPermission);

  const [onlyinfo, setOnlyInfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [status, setStatus] = useState(false);
  const { onlyLoader, only, onlydelete, updateOnlyForYouStatus } = useSelector(
    (state) => state.only
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const InitialOnlyForYou = () => {
    dispatch(
      getAllOnlyForYouAsync({
        page: paginationpage,
        limit: perPageNumber,
        search: searchTitle
      })
    );
  };

  const Reset = () => {
    setSearchTitle("");
    dispatch(
      getAllOnlyForYouAsync({
        page: paginationpage,
        limit: perPageNumber,
        search: ""
      })
    );
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

  //CALL API OF API FUNCTION
  useEffect(() => {
    InitialOnlyForYou();
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    if (onlydelete.status === 200) {
      toast.success(onlydelete.message, toastoptions);
      dispatch(emptyonly());
      setOpenConfirm(false);
      InitialOnlyForYou();
    }
    if (updateOnlyForYouStatus.status === 200) {
      toast.success(updateOnlyForYouStatus.message, toastoptions);
      dispatch(emptyonly());
      setStatus(false);
      InitialOnlyForYou();
    }
  }, [onlydelete, updateOnlyForYouStatus]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Only For You | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Only For You"
        links={[
          { name: "Only For You", href: "" },
          // { name: "Only For You", href: "" }
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
                )
              }}
            />
            <Button
              variant="contained"
              sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
              onClick={() => InitialOnlyForYou()}
            >
              Filter
            </Button>
            <Button
              variant="contained"
              sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
              onClick={Reset}
            >
              <AutorenewRoundedIcon />
            </Button>
            <Button
              sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
              to={PATH_DASHBOARD.createonlyforyou}
              component={RouterLink}
              variant="contained"
              onClose={() => setOpenConfirm(false)}
              disabled={!Boolean(modulePermit?.add)}
            >
              <AddIcon />
            </Button>
          </Box>

        }
      />
      <CustomTable
        columnheight="30px"
        loader={onlyLoader}
        data={only?.data}
        columns={onlycolumns({
          openPopover,
          handleOpenPopover,
          setOnlyInfo,
          paginationpage
        })}
        totalcount={only?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopup
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        onlyinfo={onlyinfo}
        setOpenConfirm={setOpenConfirm}
        setStatus={setStatus}
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
            loading={onlyLoader}
            onClick={() => dispatch(deleteOnlyByIdAsync(onlyinfo.id))}
          >
            Delete
          </LoadingButton>
        }
      />
      <ConfirmDialog
        open={status}
        onClose={() => setStatus(false)}
        content={
          onlyinfo?.status == "Active"
            ? "Are you sure you want to change status from Active to Inactive?"
            : "Are you sure you want to change status from Inactive to Active?"
        }
        action={
          <LoadingButton
            variant="contained"
            color="primary"
            loading={onlyLoader}
            onClick={() =>
              dispatch(
                updateOnlyForYouStatusAsync({
                  id: onlyinfo.id,
                  // status: Number(0),
                  status: onlyinfo?.status == "Active" ? Number(0) : Number(1)
                })
              )
            }
          >
            Accept
          </LoadingButton>
        }
      />
    </Container>
  );
}

const ExpandedComponent = ({ data }) => {
  return;
};
