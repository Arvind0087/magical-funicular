import { Helmet } from "react-helmet-async";
import { Container, Box, Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { InputAdornment } from "@mui/material";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import {
  getAllTestAsync,
  deleteTestByIdAsync,
} from "redux/slices/TestSlice/async.api";
import { testcolumns } from "./utils";
import MenuPopupTest from "./component/MenuPopup";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { emptytests } from "redux/slices/TestSlice/test.slice";
import ConfirmDialog from "components/confirm-dialog/ConfirmDialog";
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify";
import { getTestQuestionsFilterAsync } from "redux/filter/TestQuestions/TestQuestions.async";
import CreateTest from "./CreateTest";
import DialogBox from "components/DialogBox/index";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";
import { _papertype } from "./Questions/utils";

export default function TestQuestions() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();

  const [actionModal, setActionModal] = useState(false);
  const [IsFlagAction, setIsFlagAction] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);
  const [testInfo, setTestinfo] = useState("");
  const [isFind, setIsFind] = useState(false);
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const { testLoader, tests, testdelete } = useSelector((state) => state.tests);
  const [searchPaperType, setSearchPaperType] = useState([]);
  const [searchPaperName, setsearchPaperName] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const InitialTestQuestion = ({
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
        category: searchPaperType?.value,
        title: searchPaperName,
      };
    }
    if (isReset) {
      delete payload.category;
      delete payload.title;
    }
    dispatch(
      getAllTestAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload,
      })
    );
  };

  const resetFilter = () => {
    setIsFind(false);
    setSearchPaperType([]);
    setsearchPaperName("");
    InitialTestQuestion({
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
    InitialTestQuestion({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    if (testdelete.status === 200) {
      toast.success(testdelete.message, toastoptions);
      dispatch(emptytests());
      setOpenConfirm(false);
      InitialTestQuestion({});
    }
  }, [testdelete]);

  useEffect(() => {
    dispatch(getTestQuestionsFilterAsync({}));
  }, []);

  const handleCloseActionModal = () => {
    setActionModal(false);
    setIsFlagAction(false);
  };

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Create Test | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Create Test"
        links={[
          // { name: "Dashboard", href: PATH_DASHBOARD.root },
          { name: "Create Test" },
        ]}
        action={
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <AutoCompleteCustom
              size="small"
              sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
              value={searchPaperType}
              options={_papertype}
              onChange={(event, value) => setSearchPaperType(value)}
              label="Paper Type"
            />
            <TextField
              size="small"
              sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
              value={searchPaperName}
              onChange={(e) => setsearchPaperName(e.target.value)}
              placeholder=" Paper Name "
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
                InitialTestQuestion({
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
              onClick={() => setActionModal(true)}
              disabled={!Boolean(modulePermit?.add)}
            >
              <AddIcon />
            </Button>
          </Box>
        }
      />
      <CustomTable
        columnheight="30px"
        loader={testLoader}
        data={tests?.data}
        columns={testcolumns({
          openPopover,
          handleOpenPopover,
          setTestinfo,
          paginationpage,
        })}
        totalcount={tests?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopupTest
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        testInfo={testInfo}
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
            loading={testLoader}
            onClick={() => dispatch(deleteTestByIdAsync(testInfo.id))}
          >
            Delete
          </LoadingButton>
        }
      />
      <DialogBox
        open={actionModal}
        maxWidth="lg"
        title={IsFlagAction ? "Update Test" : "Create Test"}
        onClose={handleCloseActionModal}
      >
        <CreateTest />
      </DialogBox>
    </Container>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
