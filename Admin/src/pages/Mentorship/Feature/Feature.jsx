import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import { Button, Container, Box } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getAllFeatureAsync,
  deletefeaturesAsync,
} from "redux/slices/FeatureSlice/feature.async";
import { featurecolumns } from "./utils";
import { LoadingButton } from "@mui/lab";
import { emptyfeature } from "redux/slices/FeatureSlice/feature.slice";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import MenuPopupFeature from "./component/MenuPopupFeature";
import ConfirmDialog from "components/confirm-dialog/ConfirmDialog";

export default function Feature() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [featureinfo, setFeatureInfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { modulePermit } = useSelector((state) => state.menuPermission);

  const { featureLoader, feature, featuredelete } = useSelector(
    (state) => state.feature
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const InitialFeature = () => {
    dispatch(
      getAllFeatureAsync({
        page: paginationpage,
        limit: perPageNumber,
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
    InitialFeature();
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    if (featuredelete.status === 200) {
      toast.success(featuredelete.message, toastoptions);
      dispatch(emptyfeature());
      setOpenConfirm(false);
      InitialFeature();
    }
  }, [featuredelete]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Features | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Features"
        links={[
          { name: "Mentorship", href: "" },
          { name: "Features" },
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
              to={PATH_DASHBOARD.createfeature}
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
        columnheight="30px"
        loader={featureLoader}
        data={feature?.data}
        columns={featurecolumns({
          openPopover,
          handleOpenPopover,
          setFeatureInfo,
          paginationpage,
        })}
        totalcount={feature?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopupFeature
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        featureinfo={featureinfo}
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
            loading={featureLoader}
            onClick={() => dispatch(deletefeaturesAsync(featureinfo.id))}
          >
            Delete
          </LoadingButton>
        }
      />
    </Container>
  );
}

const ExpandedComponent = ({ data }) => {
  return;
};
