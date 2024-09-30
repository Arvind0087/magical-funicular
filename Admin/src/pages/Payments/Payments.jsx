import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSettingsContext } from "components/settings";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { Container } from "@mui/material";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import CustomTable from "components/CustomTable";
import { PATH_DASHBOARD } from "routes/paths";
import { paymentcolumns } from "./utils";
import { getAllpaymentsAsync } from "redux/payment/payments.async";

const Payments = () => {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [paymentinfo, setPaymentInfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);

  const { paymentLoader, payments } = useSelector((state) => state.payments);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const InitialCourse = () => {
    dispatch(
      getAllpaymentsAsync({
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
        <title>Payments | {`${tabTitle}`}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Payments"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Payments" },
          ]}
        />
        <CustomTable
          columnheight="100px"
          loader={paymentLoader}
          data={payments?.data}
          columns={paymentcolumns({
            openPopover,
            handleOpenPopover,
            setPaymentInfo,
            paginationpage,
          })}
          totalcount={payments?.count}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          expandableRows={false}
          expandableRowsComponent={ExpandedComponent}
        />
      </Container>
    </>
  );
};

export default Payments;

const ExpandedComponent = ({ data }) => {
  return;
};
