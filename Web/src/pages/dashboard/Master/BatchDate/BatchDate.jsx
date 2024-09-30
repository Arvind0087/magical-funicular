import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Container, Pagination } from "@mui/material";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import { _userList } from "../../../../_mock/arrays";
import Iconify from "../../../../components/iconify";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../../components/settings";
import CustomTable from "../../../../components/CustomTable";
import DataLogo from "../../../../assets/images/photo.jpg";
import "./BatchDate.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllBatchDatesAsync } from "../../../../redux/async.api";
import { batchdatecolumns } from "./utils";
import MenuPopupBatchDate from "./components/MenuPopupBatchDate";

export default function Date() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [batchdateinfo, setBatchdateinfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const { batchdateLoader, batchdate } = useSelector((state) => state.batchdate);

  const InitialCourse = () => {
    dispatch(
      getAllBatchDatesAsync({
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
    InitialCourse();
  }, [paginationpage, perPageNumber]);



  return (
    <>
      {/* <Helmet>
        <title>Batch Date | Lecture Dekho</title>
      </Helmet> */}

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Batch Date"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Batch Date", href: "" },
            { name: "List" },
          ]}
          action={
            <Button
              to={PATH_DASHBOARD.master.addbatchDate}
              component={RouterLink}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Add
            </Button>
          }
        />
        <CustomTable
          columnheight="50px"
          loader={batchdateLoader}
          data={batchdate?.rows}
          columns={batchdatecolumns({
            openPopover,
            handleOpenPopover,
            setBatchdateinfo,
            paginationpage
          })}
          totalcount={batchdate?.count}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          expandableRows={false}
          expandableRowsComponent={ExpandedComponent}
        />
        <MenuPopupBatchDate
          openPopover={openPopover}
          handleClosePopover={handleClosePopover}
          batchdateinfo={batchdateinfo}
        />
      </Container>
    </>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
