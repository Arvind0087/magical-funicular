import { Helmet } from "react-helmet-async";
import { Button, Container,Box } from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllPackagesForBoardAsync } from "redux/async.api";
import { subscriptionListcolumns } from "./utils";
import MenuPopupView from "./component/MenuPopupView";
import { useParams, useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

export default function SubscriptionList() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [openPopover, setOpenPopover] = useState(null);
  const [packageboardinfo, setPackageboardinfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { packageboardLoader, packageboard } = useSelector(
    (state) => state.packageboard
  );
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const InitialCourse = () => {
    dispatch(
      getAllPackagesForBoardAsync({
        page: paginationpage,
        limit: perPageNumber
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
    InitialCourse();
  }, [paginationpage, perPageNumber]);

  return (
    <>
      <Helmet>
        <title>Subscription Plan | {`${tabTitle}`}</title>
      </Helmet>
      <Container maxWidth={themeStretch ? "lg" : false}>
        <CustomBreadcrumbs
          // heading="Subscription Plan"
          links={[
            { name: "Subscription", href: "" },

            { name: "Subscription Plan" }
          ]}
          action={
            <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              flexWrap: "wrap"
            }}
          >
           <Button
               sx={{ borderRadius: "7px", mr: 1 }}
              to={PATH_DASHBOARD.createsubscriptionList}
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
          columnheight="50px"
          loader={packageboardLoader}
          data={packageboard?.data}
          columns={subscriptionListcolumns({
            openPopover,
            handleOpenPopover,
            setPackageboardinfo,
            paginationpage
          })}
          totalcount={packageboard?.count}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          expandableRows={false}
          expandableRowsComponent={ExpandedComponent}
        />
        <MenuPopupView
          openPopover={openPopover}
          handleClosePopover={handleClosePopover}
          packageboardinfo={packageboardinfo}
        />
      </Container>
    </>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
