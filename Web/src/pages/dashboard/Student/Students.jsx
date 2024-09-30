//
import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Pagination from '@mui/material/Pagination';
import { PATH_DASHBOARD } from "../../../routes/paths";
import { _userList } from "../../../_mock/arrays";
import Iconify from "../../../components/iconify";
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../components/settings";
import CustomTable from "../../../components/CustomTable";
import DataLogo from "../../../assets/images/photo.jpg";
import "./Student.css";
import { getstudentAsync } from "../../../redux/async.api";
import { studentcolumns } from "./utils";
import MenuPopup from "./component/MenuPopup";

export default function Subject() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [studentinfo, setStudentinfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const { studentLoader, students } = useSelector((state) => state.student);

  const InitialCourse = () => {
    dispatch(
      getstudentAsync({
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
        <title>Course | Lecture Dekho</title>
      </Helmet> */}

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Students"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Students", href: PATH_DASHBOARD.user.root },
            { name: "List" },
          ]}
          action={
            <Button
              // to={PATH_DASHBOARD.master.addsubject}
              component={RouterLink}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Add
            </Button>
          }
        />
        <CustomTable
          columnheight="100px"
          loader={studentLoader}
          data={students?.data}
          columns={studentcolumns({
            openPopover,
            handleOpenPopover,
            setStudentinfo,
            paginationpage,
          })}
          totalcount={students?.count}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          expandableRows={false}
          expandableRowsComponent={ExpandedComponent}
        />
        <MenuPopup
          openPopover={openPopover}
          handleClosePopover={handleClosePopover}
          studentinfo={studentinfo}
        />
      </Container>
    </>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
