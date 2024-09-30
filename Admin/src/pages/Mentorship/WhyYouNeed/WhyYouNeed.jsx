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
  getAllWhyYouNeedAsync,
  deleteWhyYouNeedAsync,
} from "redux/slices/WhyYouNeedSlice/youNeed.async";
import { WhyYouNeedcolumns } from "./utils";
import { LoadingButton } from "@mui/lab";
import { emptyYouneed } from "redux/slices/WhyYouNeedSlice/youneed.slice";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import ConfirmDialog from "components/confirm-dialog/ConfirmDialog";
import MenuPopupMaster from "./component/MenuPopupWhyYouNeed";

export default function WhyYouNeed() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [Idinfo, setIdinfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { youNeedLoader, youneed, youneeddelete } = useSelector(
    (state) => state.youneed
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const [openConfirm, setOpenConfirm] = useState(false);

  const InitialWhyYouNeed = () => {
    dispatch(
      getAllWhyYouNeedAsync({
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

  useEffect(() => {
    InitialWhyYouNeed();
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    if (youneeddelete.status === 200) {
      toast.success(youneeddelete.message, toastoptions);
      dispatch(emptyYouneed());
      setOpenConfirm(false);
      InitialWhyYouNeed();
    }
  }, [youneeddelete]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Why You Need | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Why You Need "
        links={[
          { name: "Mentorship", href: "" },
          { name: "Why You Need" },
        ]}
        action={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Button
              to={PATH_DASHBOARD.createwhyyouneed}
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
        loader={youNeedLoader}
        data={youneed?.data}
        columns={WhyYouNeedcolumns({
          openPopover,
          handleOpenPopover,
          setIdinfo,
          paginationpage,
        })}
        totalcount={youneed?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopupMaster
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        Idinfo={Idinfo}
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
            loading={youNeedLoader}
            onClick={() =>
              dispatch(deleteWhyYouNeedAsync(Idinfo.id))
            }
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
