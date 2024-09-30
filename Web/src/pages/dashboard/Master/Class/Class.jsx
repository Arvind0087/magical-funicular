import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import { Button, Container } from "@mui/material";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import { _userList } from "../../../../_mock/arrays";
import Iconify from "../../../../components/iconify";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../../components/settings";
import { useDispatch } from "react-redux";
import { getclassAsync } from "../../../../redux/async.api";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomTable from "../../../../components/CustomTable";
import { classcolumns } from "./utils";
import MenuPopupClass from "./component/MenuPopupClass";
import "./Class.css";

export default function Class() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [classinfo, setClassInfo] = useState("");

  const { classLoader, classes } = useSelector((state) => state.class);

  //API FUNCTION
  const InitialClass = () => {
    dispatch(
      getclassAsync({
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
    InitialClass();
  }, [paginationpage, perPageNumber]);

  return (
    <>
      {/* <Helmet>
        <title>Class | Lecture Dekho</title>
      </Helmet> */}

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Classes"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Classes" },
          ]}
          action={
            <Button
              to={PATH_DASHBOARD.master.addClass}
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
          loader={classLoader}
          data={classes?.rows}
          columns={classcolumns({
            openPopover,
            handleOpenPopover,
            setClassInfo,
            paginationpage
          })}
          totalcount={classes?.count}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          expandableRows={false}
          expandableRowsComponent={ExpandedComponent}
        />
        <MenuPopupClass
          openPopover={openPopover}
          handleClosePopover={handleClosePopover}
          classinfo={classinfo}
        />
      </Container>
    </>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);

