import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import { Button, Container } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify/Iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  deleteHighlightAsync,
  getAllHighlightAsync,
} from "redux/slices/TopHighlightSlice/highlight.async.api";
import { tophighlightcolumns } from "./utils";
import MenuPopup from "./component/MenuPopup";
import { LoadingButton } from "@mui/lab";
import { emptyhighlight } from "redux/slices/TopHighlightSlice/highlight.slice";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import ConfirmDialog from "components/confirm-dialog/ConfirmDialog";
import { Box } from "../../../../node_modules/@material-ui/core/index";

export default function TopHighlight() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const { modulePermit } = useSelector((state) => state.menuPermission);

  const [topHighlight, setTopHighLight] = useState();
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { highlightLoader, highlight, highlightdelete } = useSelector(
    (state) => state.highlight
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const InitialTopHighlights = () => {
    dispatch(
      getAllHighlightAsync({
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
    InitialTopHighlights();
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    if (highlightdelete.status === 200) {
      toast.success(highlightdelete.message, toastoptions);
      dispatch(emptyhighlight());
      setOpenConfirm(false);
      InitialTopHighlights();
    }
  }, [highlightdelete]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Top Highlight | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Top Highlight"
        links={[
          { name: "Scholarship", href: "" },
          { name: "Top Highlight" },
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
              to={PATH_DASHBOARD.createhighlight}
              component={RouterLink}
              variant="contained"
              onClose={() => setOpenConfirm(false)}
              disabled={!Boolean(modulePermit?.add)}
            >
              <AddIcon />
            </Button>
          </Box>
        }
      />

      <CustomTable
        columnheight="30px"
        loader={highlightLoader}
        data={highlight?.data}
        columns={tophighlightcolumns({
          openPopover,
          handleOpenPopover,
          setTopHighLight,
          paginationpage,
        })}
        totalcount={highlight?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopup
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        topHighlight={topHighlight}
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
            loading={highlightLoader}
            onClick={() => dispatch(deleteHighlightAsync(topHighlight.id))}
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
