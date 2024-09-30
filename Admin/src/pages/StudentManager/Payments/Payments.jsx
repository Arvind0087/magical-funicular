import React, { useEffect, useState } from "react";
import { Button, Container, Box, FormControl } from "@mui/material";
import { useDispatch } from "react-redux";
import { useSettingsContext } from "components/settings";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import CustomTable from "components/CustomTable";
import { PATH_DASHBOARD } from "routes/paths";
import { paymentcolumns } from "./utils";
import { getAllpaymentsAsync } from "redux/payment/payments.async";
import excelDownload from "../../../assets/excel/ExcelDownload.png";
import { paymentExcelDownloadAsync } from "redux/downloadexcel/excel.async";

const Payments = () => {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [paymentinfo, setPaymentInfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);

  const { paymentLoader, payments } = useSelector((state) => state.payments);
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

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
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Payments | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        links={[{ name: "Student Manager", href: "" }, { name: "Payments" }]}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <FormControl>
          <Button
            sx={{
              borderRadius: "7px",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "transparent !important",
              },
            }}
            onClick={() => paymentExcelDownloadAsync({})}
          >
            <img
              src={excelDownload}
              alt="Download Excel"
              width="50px"
              height="50px"
              borderRadius="40px"
            />
          </Button>
        </FormControl>
      </Box>
      <CustomTable
        columnheight="30px"
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
  );
};

export default Payments;

const ExpandedComponent = ({ data }) => {
  return;
};
