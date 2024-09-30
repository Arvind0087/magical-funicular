import { Container } from "@mui/material";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { PATH_DASHBOARD } from "routes/paths";
import CustomTable from "components/CustomTable";
import { useSettingsContext } from "components/settings";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { ordercolumns } from "./utils";
import { getAllordersAsync } from "redux/async.api";

const Orders = () => {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [orderinfo, setOrderInfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);

  const { orderLoader, orders } = useSelector((state) => state.orders);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const InitialCourse = () => {
    dispatch(
      getAllordersAsync({
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
    InitialCourse();
  }, [paginationpage, perPageNumber]);

  return (
    <>
      <Helmet>
        <title>Orders | {`${tabTitle}`}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Orders"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Orders" },
          ]}
        />
        <CustomTable
          columnheight="60px"
          loader={orderLoader}
          data={orders?.data}
          columns={ordercolumns({
            openPopover,
            handleOpenPopover,
            setOrderInfo,
            paginationpage,
          })}
          totalcount={orders?.count}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          expandableRows={false}
          expandableRowsComponent={ExpandedComponent}
        />
      </Container>
    </>
  );
};

export default Orders;

const ExpandedComponent = ({ data }) => {
  return;
};
