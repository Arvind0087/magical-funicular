import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";

import {
  Button,
  Container,
  FormControl,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import {
  addDaysToDate,
  generateDateFromTo,
  get30DateFromTodate,
} from "utils/generateDateFromTo";
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllLiveEventAsync,
  deleteLiveEventAsync,
} from "redux/liveclass/liveclass.async";
import { getAllStaffFilterAsync } from "redux/filter/filter.async";
import { deleteEventAsync } from "redux/async.api";
import { useEffect, useState } from "react";
import CustomTable from "components/CustomTable";
import { liveclasscolumns } from "./utilsFree";
import FreeMenuPopup from "./component/FreeMenuPopup";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { emptyliveclass } from "redux/liveclass/liveclass.slice";
import { allCoursePackagesAsync } from "redux/productPackage/productPackage.async";
import { LoadingButton } from "@mui/lab";
import ConfirmDialog from "components/confirm-dialog/ConfirmDialog";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";
import _ from "lodash";
import { capitalize } from "lodash";
import AddIcon from "@mui/icons-material/Add";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";

export default function Liveclass() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [liveclassinfo, setliveclassInfo] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [getCheckedValue, setCheckedValue] = useState([]);
  const [getCheckedEvent, setGetCheckedEvent] = useState([]);
  const [getCheckedAll, setCheckedAll] = useState(false);
  const [searchStaff, setSearchStaff] = useState({});
  const [searchPackage, setSearchPackage] = useState({});
  const [searchType, setSearchType] = useState({});
  const [searchRoles, setSearchRoles] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFind, setIsFind] = useState(false);
  const [date30, setdate30] = useState("");

  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { liveclassLoader, liveclass, liveclassdelete } = useSelector(
    (state) => state.liveclass
  );
  const { filterLoader, allStaff } = useSelector((state) => state.filterInfo);
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const { getPackageLoader, getAllPackage } = useSelector(
    (state) => state.package
  );

  const InitialLiveClass = ({ pageNo, paginateNo, isFindManual, isReset }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = { type: "Free_Live_Class" };

    if (isFind || isFindManual) {
      payload = {
        type: "Free_Live_Class",
        teacherId: !isReset ? searchStaff?.value : "",
        package: !isReset ? searchPackage?.value : "",
        fromDate: !isReset ? startDate : "",
        toDate: !isReset ? endDate : "",
      };
    }
    if (isReset) {
      delete payload.teacherId;
    }
    dispatch(
      getAllLiveEventAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload,
      })
    );
  };

  const resetFilter = () => {
    setIsFind(false);
    setSearchStaff({});
    setSearchPackage({});
    setSearchType({});
    setStartDate("");
    setEndDate("");
    InitialLiveClass({
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

  // PAGINATION
  const handlePageChange = (page) => {
    setPaginationpage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setperPageNumber(newPerPage);
  };

  useEffect(() => {
    InitialLiveClass({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    dispatch(getAllStaffFilterAsync({}));
  }, []);

  useEffect(() => {
    dispatch(
      allCoursePackagesAsync({
        page: "",
        limit: "",
      })
    );
  }, []);

  useEffect(() => {
    if (liveclassdelete.status === 200) {
      toast.success(liveclassdelete.message, toastoptions);
      dispatch(emptyliveclass());
      setOpenConfirm(false);
      InitialLiveClass({});
    }
  }, [liveclassdelete]);

  const handleChangefromDate = (e) => {
    setStartDate(e.target.value);
  };

  const handleChangeToDate = (e) => {
    setEndDate(e.target.value);
  };

  const _type = [
    {
      value: "Free_Live_Class",
      label: "Free Live Class",
    },
    {
      value: "Live Class",
      label: "Live Class",
    },
    {
      value: "Doubt Class",
      label: "Doubt Class",
    },
    {
      value: "Demo Class",
      label: "Demo Class",
    },
    {
      value: "Mentorship",
      label: "Mentorship",
    },
  ];

  const handleChangeCheckbox = (data) => {
    let parsedData = JSON.parse(data);
    const index = getCheckedValue.indexOf(data);
    setCheckedAll(false);
    if (index === -1) {
      setCheckedValue([...getCheckedValue, data]);
      setGetCheckedEvent([...getCheckedEvent, parsedData?.id]);
    } else {
      setCheckedValue(getCheckedValue.filter((item) => item != data));
      setGetCheckedEvent(
        getCheckedEvent.filter((item) => item != parsedData?.id)
      );
    }
  };

  //Multiple Checkbox Select Section
  const eventList = liveclass?.data;
  const handleCheckedAll = (data) => {
    setCheckedAll(data);
    if (data === true) {
      const ids = eventList?.map((i) =>
        JSON.stringify({
          id: i?.id,
        })
      );
      const onlyIds = eventList?.map((item) => item?.id);

      setCheckedValue(ids);
      setGetCheckedEvent(onlyIds);
    } else {
      setCheckedValue([]);
      setGetCheckedEvent([]);
    }
  };

  const removeEvent = () => {
    dispatch(deleteLiveEventAsync({ events: getCheckedEvent })).then((res) => {
      if (res?.payload?.status == 200) {
        setGetCheckedEvent([]);
      }
    });
  };

  return (
    <>
      <Container maxWidth={themeStretch ? "lg" : false}>
        <Helmet>
          <title>Free Live Class | {`${tabTitle}`}</title>
        </Helmet>

        <CustomBreadcrumbs
          links={[{ name: "Academic", href: "" }, { name: "Free Live Class" }]}
          action={
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mt: 1,
              }}
            >
              <FormControl>
                <AutoCompleteCustom
                  size="small"
                  sx={{
                    width: 170,
                    // mr: { xs: 1, sm: 1 },
                    // mb: { xs: 1, sm: 0 },
                  }}
                  loading={filterLoader}
                  options={_.map(allStaff, (ev) => {
                    return {
                      label: `${ev.name} (${_?.capitalize?.(ev.department)})`,
                      value: ev.id,
                    };
                  })}
                  value={searchStaff}
                  onChange={(event, value) => setSearchStaff(value)}
                  label="Staffs"
                />
              </FormControl>
              <FormControl>
                <AutoCompleteCustom
                  size="small"
                  sx={{
                    width: 150,
                    // mr: { xs: 1, sm: 1 },
                    mb: { xs: 1, sm: 0 },
                  }}
                  loading={getPackageLoader}
                  options={_.map(getAllPackage?.data, (ev) => {
                    return {
                      label: `${ev?.package_title}`,
                      value: ev?.id,
                    };
                  })}
                  value={searchPackage}
                  onChange={(event, value) => setSearchPackage(value)}
                  label="Package"
                />
              </FormControl>
              {/*<FormControl>
                <AutoCompleteCustom
                  size="small"
                  sx={{
                    width: 130,
                    // mr: { xs: 20, sm: 2 },
                    mb: { xs: 1, sm: 0 },
                  }}
                  options={_.map(_type, (ev) => {
                    return {
                      label: `${ev?.label}`,
                      value: ev?.label,
                    };
                  })}
                  value={searchType}
                  onChange={(event, value) => setSearchType(value)}
                  label="Type"
                />
              </FormControl> */}
              <Typography
                sx={{
                  marginRight: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                From:
              </Typography>
              <FormControl>
                <TextField
                  size="small"
                  sx={{
                    width: 140,
                  }}
                  type="date"
                  name="fromDate"
                  value={startDate}
                  fullWidth
                  inputProps={{
                    max: "9999-12-31",
                    // max: new Date(date30).toISOString().split("T")[0],
                    sx: { fontSize: "14px" },
                  }}
                  onChange={handleChangefromDate}
                  // defaultValue={currentDateNew}
                />
              </FormControl>

              <Typography
                sx={{
                  marginRight: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                To:
              </Typography>
              <FormControl>
                <TextField
                  size="small"
                  sx={{ width: 140 }}
                  type="date"
                  name="toDate"
                  value={endDate}
                  fullWidth
                  inputProps={{
                    min: addDaysToDate(startDate, 0),
                    max: date30 && new Date(date30).toISOString().split("T")[0],
                    sx: { fontSize: "14px" },
                  }}
                  onChange={handleChangeToDate}
                  // defaultValue={lastDateNew}
                />
              </FormControl>
              <Box>
                <Button
                  variant="contained"
                  sx={{ borderRadius: "7px", mr: 1 }}
                  onClick={() => {
                    setIsFind(true);
                    InitialLiveClass({
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
                  sx={{ borderRadius: "7px", mr: 1 }}
                  to={PATH_DASHBOARD.createfreelive}
                  component={RouterLink}
                  variant="contained"
                  disabled={!Boolean(modulePermit?.add)}
                >
                  <AddIcon />
                </Button>
                <Button
                  variant="contained"
                  disabled={getCheckedEvent?.length > 0 ? false : true}
                  sx={{
                    borderRadius: "7px",
                    mr: 1,
                    mb: { xs: 1, md: 0 },
                    color: "#fff",
                  }}
                  onClick={removeEvent}
                  color="error"
                >
                  Delete
                </Button>
              </Box>
            </Box>
          }
        />
        <CustomTable
          columnheight="60px"
          loader={liveclassLoader}
          data={liveclass?.data}
          columns={liveclasscolumns({
            openPopover,
            handleOpenPopover,
            setliveclassInfo,
            paginationpage,
            handleChangeCheckbox,
            handleCheckedAll,
            getCheckedAll,
            getCheckedValue,
          })}
          totalcount={liveclass?.count}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          expandableRows={false}
          expandableRowsComponent={ExpandedComponent}
        />
        <FreeMenuPopup
          openPopover={openPopover}
          handleClosePopover={handleClosePopover}
          liveclassinfo={liveclassinfo}
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
              loading={liveclassLoader}
              onClick={() =>
                dispatch(deleteLiveEventAsync({ events: [liveclassinfo.id] }))
              }
            >
              Delete
            </LoadingButton>
          }
        />
      </Container>
    </>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
