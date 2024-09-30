import React from "react";
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
import { getAllBannerAsync } from "../../../../redux/async.api";
import { bannercolumns } from "./utils";
import CustomTable from "../../../../components/CustomTable";

function Banner() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [bannerinfo, setBannerinfo] = useState("");

  const { bannerLoader, banner } = useSelector((state) => state.banner);

  //API FUNCTION
  const InitialBatch = () => {
    dispatch(
      getAllBannerAsync({
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

  // CALL API OF API FUNCTION
  useEffect(() => {
    InitialBatch();
  }, [paginationpage, perPageNumber]);

  return (
    <>
      {/* <Helmet>
        <title>Banner | Lecture Dekho</title>
      </Helmet> */}

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Banners"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Banners" },
          ]}
          action={
            <Button
              to={PATH_DASHBOARD.master.addbanner}
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
          loader={bannerLoader}
          data={banner?.rows}
          columns={bannercolumns({
            openPopover,
            handleOpenPopover,
            setBannerinfo,
            paginationpage
          })}
          totalcount={banner?.count}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          expandableRows={false}
          expandableRowsComponent={ExpandedComponent}
        />

        <MenuPopupBoard
          openPopover={openPopover}
          handleClosePopover={handleClosePopover}
          bannerinfo={bannerinfo}
        />
      </Container>
    </>
  );
}

export default Banner;

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);