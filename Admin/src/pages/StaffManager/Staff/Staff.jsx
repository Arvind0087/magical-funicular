import { Helmet } from "react-helmet-async";
import {
  Box,
  Button,
  Container,
  InputAdornment,
  FormControl,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import excelDownload from "../../../assets/excel/ExcelDownload.png";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { Link as RouterLink } from "react-router-dom";
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { teachercolumns } from "./utils";
import MenuPopup from "./component/MenuPopup";
import {
  getAllStaffsAsync,
  markStaffAttendanceAsync,
} from "redux/staff/staff.async";
import { emptystaff, emptystaffAttendance } from "redux/staff/staff.slice";

import {
  getClassWithBatchFilterAsync,
  getRolesFilterAsync,
  getClassWithBoardFilterAsync,
} from "redux/filter/filter.async";
import { staffExcelDownloadAsync } from "redux/downloadexcel/excel.async";
import { capitalize } from "lodash";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import _ from "lodash";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";
import TextFieldCustom from "components/TextFieldCustom/TextFieldCustom";
import DialogBox from "components/DialogBox/index";
import AddBatch from "./component/AddBatch/AddBatch";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";

export default function Staff() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [teacherinfo, setTeacherinfo] = useState("");
  const [getCheckedValue, setCheckedValue] = useState([]);
  const [getCheckedAll, setCheckedAll] = useState(false);
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const { modulePermit } = useSelector((state) => state.menuPermission);

  const [searchPhoneNumber, setSearchPhoneNumber] = useState("");
  const [searchRoles, setSearchRoles] = useState([]);
  const [searchClass, setSearchClass] = useState([]);
  const [isFind, setIsFind] = useState(false);
  const [actionModal, setActionModal] = useState(false);
  const [IsFlagAction, setIsFlagAction] = useState(false);

  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );
  const { staffLoader, staffs, staffAttendance, staffAttendanceLoader } =
    useSelector((state) => state.staff);
  const {
    filterLoader,
    classWithBatchFilter,
    roleFilter,
    classWithBoardFilter,
  } = useSelector((state) => state.filterInfo);

  const InitialStaff = ({ pageNo, paginateNo, isFindManual, isReset }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        search: searchPhoneNumber,
        department: searchRoles?.value,
        classes: searchClass?.value,
      };
    }
    if (isReset) {
      delete payload.search;
      delete payload.department;
      delete payload.classes;
    }
    dispatch(
      getAllStaffsAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload,
      })
    );
  };
  const resetFilter = () => {
    setIsFind(false);
    setSearchPhoneNumber("");
    setSearchRoles([]);
    setSearchClass([]);
    InitialStaff({
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
    InitialStaff({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    dispatch(getClassWithBoardFilterAsync({}));
    dispatch(getRolesFilterAsync({}));
  }, []);

  // Single Check Box Selection
  const handleChangeCheckbox = (data) => {
    const index = getCheckedValue.indexOf(data);
    setCheckedAll(false);
    if (index === -1) {
      setCheckedValue([...getCheckedValue, data]);
    } else {
      setCheckedValue(getCheckedValue.filter((item) => item != data));
    }
  };

  //Checkbox Muilt Selection
  const staffList = staffs?.data;
  const handleCheckedAll = (data) => {
    setCheckedAll(data);
    if (data === true) {
      const ids = staffList.map((ev) => ev.id);
      setCheckedValue(ids);
    } else {
      setCheckedValue([]);
    }
  };
  const handleStaffAttendance = () => {
    let payload = { teacherIds: getCheckedValue };
    dispatch(markStaffAttendanceAsync(payload));
  };

  useEffect(() => {
    if (staffAttendance.status === 200) {
      toast.success(staffAttendance.message, toastoptions);
      dispatch(emptystaffAttendance());
    }
  }, [staffAttendance]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Staff Manager | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Staff"
        links={[{ name: "Staff", href: "" }, { name: "Staff List" }]}
        action={
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Box>
              <FormControl>
                <AutoCompleteCustom
                  size="small"
                  sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
                  loading={filterLoader}
                  options={_.map(classWithBoardFilter, (ev) => {
                    return {
                      label: `${ev.className} (${ev.board})`,
                      value: ev.id,
                    };
                  })}
                  value={searchClass}
                  onChange={(event, value) => setSearchClass(value)}
                  label="Class"
                />
              </FormControl>
              <FormControl>
                <AutoCompleteCustom
                  size="small"
                  sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
                  loading={filterLoader}
                  options={_.map(roleFilter, (ev) => {
                    return { label: `${capitalize(ev.role)}`, value: ev.id };
                  })}
                  value={searchRoles}
                  onChange={(event, value) => setSearchRoles(value)}
                  label="Role"
                />
              </FormControl>
              <TextFieldCustom
                size="small"
                sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
                label="Phone"
                value={searchPhoneNumber}
                onChange={(e) => setSearchPhoneNumber(e.target.value)}
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
                  InitialStaff({
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
                to={PATH_DASHBOARD.createstaff}
                component={RouterLink}
                variant="contained"
                disabled={!Boolean(modulePermit?.add)}
              >
                <PersonAddRoundedIcon />
              </Button>
              {getCheckedValue?.length > 0 && !staffLoader && (
                <LoadingButton
                  loading={staffAttendanceLoader}
                  onClick={handleStaffAttendance}
                  variant="contained"
                >
                  Add Attendance
                </LoadingButton>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  borderRadius: "7px",
                  mr: 1,
                  mb: { xs: 1, md: 0 },
                  cursor: "pointer",
                }}
                onClick={() =>
                  staffExcelDownloadAsync({
                    search: searchPhoneNumber || "",
                    department: searchRoles?.value || "",
                    classes: searchClass?.value || "",
                  })
                }
              >
                <img
                  src={excelDownload}
                  alt="Download Excel"
                  width="50px"
                  height="50px"
                  borderRadius="40px"
                />
              </Box>
              <Button
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.bulkuploadstaff}
              >
                <FileUploadIcon />
              </Button>
            </Box>
          </Box>
        }
      />
      <CustomTable
        columnheight="30px"
        loader={staffLoader}
        data={staffs?.data}
        columns={teachercolumns({
          openPopover,
          handleOpenPopover,
          setTeacherinfo,
          paginationpage,
          getCheckedAll,
          setCheckedAll,
          getCheckedValue,
          setCheckedValue,
          handleChangeCheckbox,
          handleCheckedAll,
        })}
        totalcount={staffs?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopup
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        teacherinfo={teacherinfo}
        setActionModal={setActionModal}
        setIsFlagAction={setIsFlagAction}
      />

      <DialogBox
        open={actionModal}
        title={teacherinfo?.batch ? "Update Batch" : "Add Batch"}
        onClose={() => setActionModal(false)}
      >
        <AddBatch
          {...{
            setActionModal,
            teacherinfo,
            InitialStaff,
            IsFlagAction,
            setIsFlagAction,
          }}
        />
      </DialogBox>
    </Container>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
