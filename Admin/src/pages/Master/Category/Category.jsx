import { Helmet } from "react-helmet-async";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  InputAdornment,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import { LoadingButton } from "@mui/lab";
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import CustomTable from "components/CustomTable";
import { getGrievancesCategoryAsync, deleteGrievancesCategoryByIdAsync } from 'redux/grievances/grievances.async';
import MenuPopupgetCategory from './components/MenuPopupCategory';
import ConfirmDialog from "./components/DeleteCategory";
import { emptyGrievances } from "redux/grievances/grievances.slice";
import AddCategory from "./CreateCategory/CreateCategory";
import { columns } from "./utils";
import DialogBox from "components/DialogBox/index";

export default function GrievancesCategory() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [actionModal, setActionModal] = useState(false);
  const [IsFlagAction, setIsFlagAction] = useState(false);
  const [getCategoryInfo, setCategoryInfo] = useState("");

  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [searchCategory, setSearchCategory] = useState("");
  const [isFind, setIsFind] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle)
  const { grievancesLoader, allGrievancesCategory, deleteGrievancesCategory } = useSelector((state) => state.grievances)
  const Initialgrievances = ({ pageNo, paginateNo, isFindManual, isReset }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        search: searchCategory,
      };
    }
    if (isReset)
      delete payload.search;
    dispatch(
      getGrievancesCategoryAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload,
      })
    )
  };
  const resetFilter = () => {
    setIsFind(false);
    setSearchCategory('');
    Initialgrievances({
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
    Initialgrievances({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    if (deleteGrievancesCategory.status === 200) {
      toast.success(deleteGrievancesCategory.message, toastoptions);
      dispatch(emptyGrievances());
      setOpenConfirm(false);
      Initialgrievances({});
    }
  }, [deleteGrievancesCategory]);

  const handleCloseActionModal = () => {
    setCategoryInfo("");
    setActionModal(false);
    setIsFlagAction(false);
  };

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Category | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Category"
        links={[
          { name: "Master", href: "" },
          { name: "Category" },
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
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              placeholder="Category"
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
                  Initialgrievances({
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
                sx={{ borderRadius: "7px", mr: 1 }}
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
          </Box>
        }
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>

        </Box>
        {/* <Box>
            <Button
              variant="contained"
              sx={{ ml: 2, mt: 0.25, borderRadius: "7px" }}
              onClick={() => StateExcelDownloadAsync(searchCategory)}
            >
              Download Excel
            </Button>
          </Box> */}
      </Box>
      <CustomTable
        columnheight="50px"
        loader={grievancesLoader}
        data={allGrievancesCategory?.data}
        columns={columns({
          openPopover,
          handleOpenPopover,
          setCategoryInfo,
          paginationpage,
        })}
        totalcount={allGrievancesCategory?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopupgetCategory
        {...{
          openPopover,
          handleClosePopover,
          getCategoryInfo,
          setActionModal,
          setOpenConfirm,
          setIsFlagAction,
        }}
      />
      <DialogBox
        open={actionModal}
        title={IsFlagAction ? "Update Category" : "Create Category"}
        onClose={handleCloseActionModal}
      >
        <AddCategory
          {...{
            setActionModal,
            getCategoryInfo,
            setCategoryInfo,
            Initialgrievances,
            IsFlagAction,
            setIsFlagAction,
          }}
        />
      </DialogBox>

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={grievancesLoader}
            onClick={() => dispatch(deleteGrievancesCategoryByIdAsync(getCategoryInfo))}
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
