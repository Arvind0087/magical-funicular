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
  getAllHelpsAsync,
  deleteHelpAsync,
} from "redux/slices/Helps/helps.async";
import { howithelpcolumns } from "./utils";
import MenuPopupMaster from "./component/MenuPopupHelps";
import { LoadingButton } from "@mui/lab";
import { emptyHelps } from "redux/slices/Helps/helps.slice";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
import ConfirmDialog from "components/confirm-dialog/ConfirmDialog";

export default function Helps() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [Idinfo, setIdinfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { helpsLoader, helps, helpsdelete } = useSelector(
    (state) => state.helps
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const [openConfirm, setOpenConfirm] = useState(false);

  const InitialHowItHelps = () => {
    dispatch(
      getAllHelpsAsync({
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
    InitialHowItHelps();
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    if (helpsdelete.status === 200) {
      toast.success(helpsdelete.message, toastoptions);
      dispatch(emptyHelps());
      setOpenConfirm(false);
      InitialHowItHelps();
    }
  }, [helpsdelete]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>How It Helps? | {`${tabTitle}`} </title>
      </Helmet>

      <CustomBreadcrumbs
        // heading="How it helps?"
        links={[
          { name: "Mentorship", href: "" },
          { name: "How It Helps" },
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
              to={PATH_DASHBOARD.createhowithelp}
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
        loader={helpsLoader}
        data={helps?.data}
        columns={howithelpcolumns({
          openPopover,
          handleOpenPopover,
          setIdinfo,
          paginationpage,
        })}
        totalcount={helps?.count}
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
            loading={helpsLoader}
            onClick={() => dispatch(deleteHelpAsync(Idinfo.id))}
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
