import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  InputAdornment,
  Autocomplete
} from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import AddIcon from "@mui/icons-material/Add";
import Iconify from "components/iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllSubscriptionsAsync } from "redux/async.api";
import { subscriptioncolumns } from "./utils";
import MenuPopupSub from "./component/MenuPopupSub";
import { getPackageFilterAsync } from "redux/filter/PackageMaster/packageMaster.async";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";

export default function PackageSub() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [subscriptioninfo, setSubscriptioninfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchPackagename, setSearchPackagename] = useState([]);
  const [isFind, setIsFind] = useState(false);
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { subscriptionLoader, subscription } = useSelector(
    (state) => state.subscription
  );

  const { packageFilterLoader, packageFilter } = useSelector(
    (state) => state.PackageFilter
  );
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const InitialPackageSubscription = ({
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
        title: searchTitle,
        package: searchPackagename?.value
      };
    }
    if (isReset) {
      delete payload.package;
      delete payload.title;
    }

    dispatch(
      getAllSubscriptionsAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload
      })
    );
  };

  const InitialPackageMasterFilter = () => {
    dispatch(getPackageFilterAsync({}));
  };

  const resetFilter = () => {
    setIsFind(false);
    setSearchTitle("");
    setSearchPackagename("");
    InitialPackageSubscription({
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

  useEffect(() => {
    InitialPackageSubscription({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    InitialPackageMasterFilter();
  }, []);

  return (
    <>
      <Helmet>
        <title>Package Details | {`${tabTitle}`}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? "lg" : false}>
        <CustomBreadcrumbs
          // heading="Package Details"
          links={[
            { name: "Subscription", href: "" },
            { name: "Package Details", href: "" }
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
                sx={{ width: 150, mr: 2, mb: { xs: 1, sm: 0 } }}
                size="small"
                loading={packageFilterLoader}
                loadingText={<CustomComponentLoader padding="0 0" size={20} />}
                value={searchPackagename}
                options={_.map(packageFilter, (ev) => {
                  return { label: `${ev.name}`, value: ev.id };
                })}
                onChange={(event, value) => setSearchPackagename(value)}
                renderInput={(params) => (
                  <TextField {...params} label=" Package " />
                )}
              />

              <TextField
                width={220}
                size="small"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                placeholder=" Title"
                sx={{ width: 150, mr: { xs: 15, sm: 2 }, mb: { xs: 1, sm: 0 } }}
                InputProps={{
                  sx: { borderRadius: "10px !important" },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify
                        icon="eva:search-fill"
                        sx={{ color: "text.disabled" }}
                      />
                    </InputAdornment>
                  )
                }}
              />
              <Box>
                <Button
                  variant="contained"
                  sx={{ borderRadius: "7px", mr: 1 }}
                  onClick={() => {
                    setIsFind(true);
                    InitialPackageSubscription({
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
                <Button
                  sx={{ borderRadius: "7px", mr: 1 }}
                  to={PATH_DASHBOARD.createpackagesubscription}
                  component={RouterLink}
                  variant="contained"
                  disabled={!Boolean(modulePermit?.add)}
                >
                  <AddIcon />
                </Button>
              </Box>
            </Box>
          }
        />
        <CustomTable
          columnheight="30px"
          loader={subscriptionLoader}
          data={subscription?.data}
          columns={subscriptioncolumns({
            openPopover,
            handleOpenPopover,
            setSubscriptioninfo,
            paginationpage
          })}
          totalcount={subscription?.count}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          expandableRows={false}
          expandableRowsComponent={ExpandedComponent}
        />
        <MenuPopupSub
          openPopover={openPopover}
          handleClosePopover={handleClosePopover}
          subscriptioninfo={subscriptioninfo}
        />
      </Container>
    </>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
