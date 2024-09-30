import { Helmet } from "react-helmet-async";
import React, { useEffect, useState, useCallback } from "react";
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
import { LoadingButton } from "@mui/lab";
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import CustomTable from "components/CustomTable";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import DialogBox from "components/DialogBox/index";
import { columns } from "./utils";
import ConfirmDialog from "../../Shorts/component/DeleteShorts";
import _ from "lodash";
import {
  getSubGrievancesCategoryAsync, deleteGrievancesSubCategoryByIdAsync
} from 'redux/grievances/grievances.async';
import { emptyGrievances } from "redux/grievances/grievances.slice";
import MenupopupSubCategory from './components/MenupopupSubCategory'
import CreateSubCategory from './CreateSubCategory/CreateSubCategory'
import { getGrievanceCategoryFilterAsync } from "redux/filter/filter.async";


export default function SubCategory() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [isFind, setIsFind] = useState(false);
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [actionModal, setActionModal] = useState(false);
  const [IsFlagAction, setIsFlagAction] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle)
  const [getSubCategory, setSubCategory] = useState("");
  const [getSearchCategory, setSearchCategory] = useState([]);
  const [getSearchSubCategory, setSearchSubCategory] = useState("");
  const {
    grievancesLoader,
    allSubGrievancesCategory,
    deleteGrievancesSubCategoryById
  } = useSelector((state) => state.grievances)

  const { filterLoader, grievanceCategoryFilter } = useSelector((state) => state.filterInfo);

  const InitialSubCategory = ({ pageNo, paginateNo, isFindManual, isReset }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        search: getSearchSubCategory,
        category: getSearchCategory?.value,
      };
    }
    if (isReset) {
      delete payload.search, delete payload.category;
    }
    dispatch(
      getSubGrievancesCategoryAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload,
      })
    )
  };
  const resetFilter = () => {
    setIsFind(false);
    setSearchCategory([]);
    setSearchSubCategory('');
    InitialSubCategory({
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
    InitialSubCategory({});
  }, [paginationpage, perPageNumber]);

  // useEffect(() => {
  //   dispatch(getStateFilterAsync({}));
  // }, [])

  useEffect(() => {
    dispatch(getGrievanceCategoryFilterAsync({}));
  }, [])



  useEffect(() => {
    if (deleteGrievancesSubCategoryById.status === 200) {
      toast.success(deleteGrievancesSubCategoryById.message, toastoptions);
      dispatch(emptyGrievances());
      setOpenConfirm(false);
      InitialSubCategory({});
      setSubCategory("");
    }
  }, [deleteGrievancesSubCategoryById]);

  const handleCloseActionModal = () => {
    setSubCategory("");
    setActionModal(false);
    setIsFlagAction(false);
  };

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Sub Category | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Sub Category"
        links={[
          { name: "Master", href: "" },
          { name: "Sub Category" },
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
                sx={{ width: 150, mr: 2, mb: { xs: 1, sm: 0 } }}
                loading={filterLoader}
                loadingText={<CustomComponentLoader padding="0 0" size={20} />}
                value={getSearchCategory}
                options={_.map(grievanceCategoryFilter, (ev) => {
                  return { label: `${ev.category}`, value: ev.id };
                })}
                onChange={(event, value) => setSearchCategory(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Category" />
                )}
                isOptionEqualToValue={useCallback(
                  (option, value) => option.value === value.value
                )}
              />
            </FormControl>
            <TextField
              size="small"
              sx={{ width: 150, mr: { xs: 15, sm: 2 }, mb: { xs: 1, sm: 0 } }}
              value={getSearchSubCategory}
              onChange={(e) => setSearchSubCategory(e.target.value)}
              placeholder="Subcategory"
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
                  InitialSubCategory({
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
          flexWrap: 'wrap'
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >

        </Box>
      </Box>

      <CustomTable
        columnheight="50px"
        loader={grievancesLoader}
        data={allSubGrievancesCategory?.data}
        columns={columns({
          openPopover,
          handleOpenPopover,
          setSubCategory,
          paginationpage,
        })}
        totalcount={allSubGrievancesCategory?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenupopupSubCategory
        {...{
          openPopover,
          handleClosePopover,
          setActionModal,
          setIsFlagAction,
          setOpenConfirm,
        }}
      />

      <DialogBox
        open={actionModal}
        title={IsFlagAction ? "Update Sub Sategory" : "Create Sub Category"}
        onClose={handleCloseActionModal}
      >
        <CreateSubCategory
          {...{
            setActionModal,
            getSubCategory,
            setSubCategory,
            InitialSubCategory,
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
            onClick={() => dispatch(deleteGrievancesSubCategoryByIdAsync(getSubCategory))}
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
