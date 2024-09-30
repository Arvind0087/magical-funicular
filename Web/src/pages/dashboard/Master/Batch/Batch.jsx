import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import { Button, Container } from "@mui/material";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import Iconify from "../../../../components/iconify";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../../components/settings";
import MenuPopupBoard from "./component/MenuPopupBoard";
import { useSelector, useDispatch } from "react-redux";
import { getAllBatchTypes } from "../../../../redux/async.api";
import { batchcolumns } from "./utils";
import CustomTable from "../../../../components/CustomTable";

export default function Batch() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [batchinfo, setBatchInfo] = useState("");

  const { batchLoader, batches } = useSelector((state) => state.batch);

  //API FUNCTION
  const InitialBatch = () => {
    dispatch(
      getAllBatchTypes({
        page: paginationpage,
        limit: perPageNumber,
      })
    );
  };

  // POPUPOVER
  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };
  const handleClosePopover = () => {
    setOpenPopover(null);
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
    InitialBatch();
  }, [paginationpage, perPageNumber]);

  return (
    <>
      {/* <Helmet>
        <title>Batch | Lecture Dekho</title>
      </Helmet> */}

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Batch"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Batch" },
          ]}
          action={
            <Button
              to={PATH_DASHBOARD.master.addbatch}
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
          loader={batchLoader}
          data={batches?.rows}
          columns={batchcolumns({
            openPopover,
            handleOpenPopover,
            setBatchInfo,
            paginationpage
          })}
          totalcount={batches?.count}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          expandableRows={false}
          expandableRowsComponent={ExpandedComponent}
        />
        <MenuPopupBoard
          openPopover={openPopover}
          handleClosePopover={handleClosePopover}
          batchinfo={batchinfo}
        />
      </Container>
    </>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);