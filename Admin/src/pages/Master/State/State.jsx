import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Button,
  Container,
  TextField,
  InputAdornment,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import excelDownload from 'assets/excel/ExcelDownload.png'
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import { useDispatch, useSelector } from "react-redux";
import { emptyById, emptystate } from "redux/state/states.slice";
import { getStateAsync, deleteStateByIdAsync } from "redux/state/states.async";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import CustomTable from "components/CustomTable";
import { columns } from "./utils";
import ConfirmDialog from "../../Shorts/component/DeleteShorts";
import MenuPopupBoard from "./component/MenuPopupState";
import AddState from "./CreateStates/CreateStates";
import { LoadingButton } from "@mui/lab";
import { StateExcelDownloadAsync } from "redux/downloadexcel/excel.async";
import DialogBox from "components/DialogBox/index";

export default function Board() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();

  const [actionModal, setActionModal] = useState(false);
  const [IsFlagAction, setIsFlagAction] = useState(false);
  const [InfoId, setInfoId] = useState("");

  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [searchName, setsearchName] = useState("");
  const [isFind, setIsFind] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { modulePermit } = useSelector((state) => state.menuPermission);

  const { stateLoader, states, deleteStateById } = useSelector(
    (state) => state.state
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle)

  const InitialState = ({ pageNo, paginateNo, isFindManual, isReset }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        search: searchName,
      };
    }
    if (isReset)
      delete payload.search;
    dispatch(
      getStateAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload,
      })
    )
  };
  const resetFilter = () => {
    setIsFind(false);
    setsearchName('');
    InitialState({
      pageNo: 1,
      paginateNo: 10,
      isReset: true,
    });
  };


  const handlePageChange = (page) => {
    setPaginationpage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setperPageNumber(newPerPage);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };
  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  useEffect(() => {
    InitialState({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    if (deleteStateById.status === 200) {
      toast.success(deleteStateById.message, toastoptions);
      dispatch(emptystate());
      setOpenConfirm(false);
      InitialState({});
    }
  }, [deleteStateById]);

  const handleCloseActionModal = () => {
    setInfoId("");
    setActionModal(false);
    setIsFlagAction(false);
    dispatch(emptyById());
  };

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>State | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="State"
        links={[
          { name: "Master", href: PATH_DASHBOARD.root },
          { name: "State" },
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
              <TextField
                size="small"
                sx={{ width: 150, mr: { xs: 20, sm: 2 }, mb: { xs: 1, sm: 0 } }}
                value={searchName}
                onChange={(e) => setsearchName(e.target.value)}
                placeholder="State"
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
                  InitialState({
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
                variant="contained"
                sx={{ borderRadius: "7px", mr: 1 }}
                onClick={() => setActionModal(true)}
                disabled={!Boolean(modulePermit?.add)}
              >
                <AddIcon />
              </Button>
            </Box>
            <Box
              sx={{ borderRadius: "7px", mr: 1 }}
              onClick={() => StateExcelDownloadAsync(searchName)}
            >
              <img src={excelDownload} alt="Download Excel" width='50px' height='50px' borderRadius="40px" />
            </Box>
          </Box>
        }
      />
      <CustomTable
        columnheight="30px"
        loader={stateLoader}
        data={states?.data}
        columns={columns({
          openPopover,
          handleOpenPopover,
          setInfoId,
          paginationpage,
        })}
        totalcount={states?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopupBoard
        {...{
          openPopover,
          handleClosePopover,
          InfoId,
          setActionModal,
          setOpenConfirm,
          setIsFlagAction,
        }}
      />
      <DialogBox
        open={actionModal}
        title={IsFlagAction ? "Update State" : "Create State"}
        onClose={handleCloseActionModal}
      >
        <AddState
          {...{
            setActionModal,
            InfoId,
            setInfoId,
            InitialState,
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
            loading={stateLoader}
            onClick={() => dispatch(deleteStateByIdAsync(InfoId))}
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
