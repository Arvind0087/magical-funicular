import { Helmet } from "react-helmet-async";
import { Button, Container, Box, TextField, Autocomplete } from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllDoubtDemoRequestAsync,
  createEventNewAsync
} from "redux/doubtdemorequest/doubtdemorequest.async";
import { useEffect, useState } from "react";
import CustomTable from "components/CustomTable";
import { _status, doubtDemocolumns } from "./utils";
import MenuPopup from "./component/MenuPopup";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { emptydoubtdemorquest } from "redux/doubtdemorequest/doubtdemorequest.slice";
import { getFilterAsync } from "redux/filter/student/student.async";
import { LoadingButton } from "@mui/lab";
import ConfirmDialog from "components/confirm-dialog/ConfirmDialog";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import _ from "lodash";
import DialogBox from "components/DialogBox/index";
import Assign from "./Assign/Assign";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";

export default function DoubtDemoRequest() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [doubtdemorquestinfo, setDoubtdemorquestInfo] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [searchstudent, setSearchstudent] = useState("");
  const [searchstatus, setSearchstatus] = useState("");
  const [isFind, setIsFind] = useState(false);

  const { doubtdemorequestLoader, doubtdemorquest, addEventNew } = useSelector(
    (state) => state.doubtdemorquest
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const [actionModal, setActionModal] = useState(false);
  const [IsFlagAction, setIsFlagAction] = useState(false);

  const { studentFilterLoader, studentFilter } = useSelector(
    (state) => state.studentFilter
  );

  //API FUNCTION
  const InitialDemoRequest = ({
    pageNo,
    paginateNo,
    isFindManual,
    isReset
  }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        student: searchstudent?.value,
        status: searchstatus?.value
      };
    }
    if (isReset) {
      delete payload.student;
      delete payload.status;
    }
    dispatch(
      getAllDoubtDemoRequestAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload
      })
    );
  };

  const InitialStudentFilter = () => {
    dispatch(getFilterAsync({}));
  };

  // FILTER FUNCTION
  const resetFilter = () => {
    setSearchstudent();
    setSearchstatus();
    InitialDemoRequest({
      pageNo: 1,
      paginateNo: 10,
      isReset: true
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
  const [actionfind, setActionfind] = useState();
  //CALL API OF API FUNCTION
  useEffect(() => {
    InitialDemoRequest({});
  }, [paginationpage, perPageNumber, actionfind]);

  useEffect(() => {
    InitialStudentFilter();
  }, []);

  useEffect(() => {
    if (addEventNew.status === 200) {
      toast.success(addEventNew.message, toastoptions);
      dispatch(emptydoubtdemorquest());
      setOpenConfirm(false);
      InitialDemoRequest({});
    }
  }, [addEventNew]);

  const handleCloseActionModal = () => {
    setActionModal(false);
    setIsFlagAction(false);
    dispatch(emptydoubtdemorquest());
  };

  return (
    <>
      <Helmet>
        <title>Doubt Demo Request | {`${tabTitle}`}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? "lg" : false}>
        <CustomBreadcrumbs
          // heading=" Doubt/Demo Request "
          links={[
            // { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Academic", href: PATH_DASHBOARD.root },
            { name: "Doubt/Demo Request " }
          ]}
          action={
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                flexWrap: "wrap"
              }}
            >
              <Autocomplete
                sx={{
                  width: 150,
                  mr: { xs: 20, sm: 2 },
                  mb: { xs: 1, sm: 0 }
                }}
                size="small"
                loading={studentFilterLoader}
                loadingText={<CustomComponentLoader padding="0 0" size={20} />}
                value={searchstudent}
                options={_.map(studentFilter, (ev) => {
                  return { label: `${ev.name} (${ev.class})`, value: ev.id };
                })}
                onChange={(event, value) => setSearchstudent(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Student" />
                )}
              />
              <Autocomplete
                sx={{
                  width: 150,
                  mr: { xs: 20, sm: 2 },
                  mb: { xs: 1, sm: 0 }
                }}
                size="small"
                value={searchstatus}
                options={_status}
                onChange={(event, value) => setSearchstatus(value)}
                renderInput={(params) => (
                  <TextField {...params} label=" Status" />
                )}
              />
              <Box>
                <Button
                  variant="contained"
                  sx={{ borderRadius: "7px", mr: 1 }}
                  onClick={() => {
                    setIsFind(true);
                    InitialDemoRequest({
                      pageNo: 1,
                      paginateNo: 10,
                      isFindManual: true
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
              </Box>
            </Box>
          }
        />

        <CustomTable
          columnheight="30px"
          loader={doubtdemorequestLoader}
          data={doubtdemorquest?.data}
          columns={doubtDemocolumns({
            openPopover,
            handleOpenPopover,
            setDoubtdemorquestInfo,
            paginationpage
          })}
          totalcount={doubtdemorquest?.count}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          expandableRows={false}
          expandableRowsComponent={ExpandedComponent}
        />
        <MenuPopup
          {...{
            openPopover,
            handleClosePopover,
            setOpenConfirm,
            setActionModal,
            InitialDemoRequest
          }}
        />
        <ConfirmDialog
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          content="Are you sure want to Reject?"
          action={
            <LoadingButton
              variant="contained"
              color="error"
              loading={doubtdemorequestLoader}
              onClick={() =>
                dispatch(
                  createEventNewAsync({
                    requestId: doubtdemorquestinfo.id,
                    status: "Rejected"
                  })
                )
              }
            >
              Reject
            </LoadingButton>
          }
        />
        {/* <ConfirmDialog
          open={openAcceptConfirm}
          onClose={() => setOpenAcceptConfirm(false)}
          content="Are you sure want to Accept?"
          action={
            <LoadingButton
              variant="contained"
              color="primary"
              loading={doubtdemorequestLoader}
              onClick={() =>
                dispatch(
                  updateStatusByIdAsync({
                    Id: doubtdemorquestinfo.id,
                    status: "accepted",
                  })
                )
              }
            >
              Accept
            </LoadingButton>
          }
        /> */}

        <DialogBox
          // maxWidth="sm"
          open={actionModal}
          title="Are you sure want to Accept?"
          onClose={(e) => {
            handleCloseActionModal();
            setActionfind(e)
          }}
        >
          <Assign
            {...{
              setActionModal,
              doubtdemorquestinfo,
              setActionfind
            }}
          />
        </DialogBox>
      </Container>
    </>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
