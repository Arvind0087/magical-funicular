import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Container,
  Box,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllCredentialAsync, deleteCredentialByTeacherIdAsync } from "redux/ZoomSetting/ZoomSetting.async";
import emptyzoomSetting from "redux/ZoomSetting/ZoomSetting.slice"
import { columns } from "./utils";
import MenuPopupRevision from "./component/MenuPopupZoomSetting";
import _ from "lodash";
import ConfirmDialog from "components/confirm-dialog/ConfirmDialog";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";


export default function Revision() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [InfoId, setInfoId] = useState("");

  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { zoomSettingLoader, zoomSetting, zoomSettingdelete } = useSelector(
    (state) => state.zooSetting
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const InitialZoomSetting = ({ pageNo, paginateNo }) => {

    dispatch(
      getAllCredentialAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
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

  useEffect(() => {
    InitialZoomSetting({});
  }, [paginationpage, perPageNumber]);



  useEffect(() => {
    if (zoomSettingdelete.status === 200) {
      toast.success(zoomSettingdelete.message, toastoptions);
      setOpenConfirm(false);
      dispatch(emptyzoomSetting());
      InitialZoomSetting({});

    }
  }, [zoomSettingdelete]);

  return (

    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Zoom Setting | {`${tabTitle}`} </title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Zoom Setting"
        links={[
          { name: "General Settings", href: "" },
          { name: "Zoom Setting" },
        ]}
        action={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
            <Button
              to={PATH_DASHBOARD.createzoomsetting}
              component={RouterLink}
              variant="contained"
              disabled={!Boolean(modulePermit?.add)}
            >
              <AddIcon />
            </Button>
          </Box>
        }
      />

      <CustomTable
        columnheight="100px"
        loader={zoomSettingLoader}
        data={zoomSetting?.data}
        columns={columns({
          openPopover,
          handleOpenPopover,
          setInfoId,
          paginationpage,
        })}
        totalcount={zoomSetting?.count}
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
          zoomSetting

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
            loading={zoomSettingLoader}
            onClick={() => dispatch(deleteCredentialByTeacherIdAsync(InfoId))}
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
