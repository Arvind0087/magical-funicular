import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Container,
  FormControl,
  Box,
  Autocomplete,
  TextField,
} from "@mui/material";
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddIcon from '@mui/icons-material/Add';
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { deleteRevisionAsync, getAllRevisionAsync } from "redux/async.api";
import { columns } from "./utils";
import MenuPopupRevision from "./components/MenuPopupRevision";
import { getFilterAsync } from "redux/filter/subject/subject.async";
import _ from "lodash";
import ConfirmDialog from "components/confirm-dialog/ConfirmDialog";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";

export default function Revision() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [InfoId, setInfoId] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [searchSubject, setSearchSubject] = useState([]);
  const [isFind, setIsFind] = useState(false);
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { revisionLoader, getAllRevision, deleteRevision } = useSelector(
    (state) => state.revision
  );
  const { subjectfilterLoader, subjectFilter } = useSelector(
    (state) => state.subjectFilter
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const InitialRevision = ({ pageNo, paginateNo, isFindManual, isReset }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        subject: searchSubject?.value,
      };
    }
    if (isReset) delete payload.subject;
    dispatch(
      getAllRevisionAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload,
      })
    );
  };

  const resetFilter = () => {
    setIsFind(false);
    setSearchSubject([]);
    InitialRevision({
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
    InitialRevision({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    dispatch(getFilterAsync({}));
  }, []);

  useEffect(() => {
    if (deleteRevision.status === 200) {
      toast.success(deleteRevision.message, toastoptions);
      setOpenConfirm(false);
      InitialRevision({});
    }
  }, [deleteRevision]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Revision | {`${tabTitle}`} </title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Revision"
        links={[
          { name: "Revision", href: "" },
          { name: "Revision List" },
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
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <AutoCompleteCustom
                size="small"
                sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
                loading={subjectfilterLoader}
                options={_.map(subjectFilter, (ev) => {
                  return {
                    label: `${ev.subjectName} (${ev.class})`,
                    value: ev.subjectName,
                  };
                })}
                value={searchSubject}
                onChange={(event, value) => setSearchSubject(value)}
                label="Subject"
              />
              <Button
                variant="contained"
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                onClick={() => {
                  setIsFind(true);
                  InitialRevision({
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
                to={PATH_DASHBOARD.createrevision}
                component={RouterLink}
                variant="contained"
                disabled={!Boolean(modulePermit?.add)}
              >
                <AddIcon />
              </Button>
            </Box>
            <Box>
              <Button
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.uploadbulk}
              >
                <FileUploadIcon />
              </Button>
            </Box>
          </Box>
        }
      />
      <CustomTable
        columnheight="30px"
        loader={revisionLoader}
        data={getAllRevision?.data}
        columns={columns({
          openPopover,
          handleOpenPopover,
          setInfoId,
          paginationpage,
        })}
        totalcount={getAllRevision?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopupRevision
        {...{
          openPopover,
          handleClosePopover,
          InfoId,
          setOpenConfirm,
        }}
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
            loading={revisionLoader}
            onClick={() => dispatch(deleteRevisionAsync(InfoId))}
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
