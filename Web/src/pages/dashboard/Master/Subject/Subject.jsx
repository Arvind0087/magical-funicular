import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Container } from "@mui/material";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import { _userList } from "../../../../_mock/arrays";
import Iconify from "../../../../components/iconify";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../../components/settings";
import CustomTable from "../../../../components/CustomTable";
import "./Subject.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllSubjectsAsync } from "../../../../redux/async.api";
import { studentcolumns } from "./utils";
import MenuPopupStudent from "./component/MenuPopupStudent";

export default function Subject() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [subjectinfo, setSubjectinfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const { subjectLoader, subject } = useSelector((state) => state.subject);

  const InitialCourse = () => {
    dispatch(
      getAllSubjectsAsync({
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
        <title>Subject | Lecture Dekho</title>
      </Helmet> */}

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Subject"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Subject", href: "" },
            { name: "List" },
          ]}
          action={
            <Button
              to={PATH_DASHBOARD.master.addsubject}
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
          loader={subjectLoader}
          data={subject?.rows}
          columns={studentcolumns({
            openPopover,
            handleOpenPopover,
            setSubjectinfo,
            paginationpage,
          })}
          totalcount={subject?.count}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          expandableRows={false}
          expandableRowsComponent={ExpandedComponent}
        />
        <MenuPopupStudent
          openPopover={openPopover}
          handleClosePopover={handleClosePopover}
          subjectinfo={subjectinfo}
        />
      </Container>
    </>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
