import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import { Button, Container } from "@mui/material";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import { _userList } from "../../../../_mock/arrays";
import Iconify from "../../../../components/iconify";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../../components/settings";
import CustomTable from "../../../../components/CustomTable";
import DataLogo from "../../../../assets/images/photo.jpg";
import "./Courses.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getcourseAsync } from "../../../../redux/async.api";
import { coursecolumns } from "./utils";
import MenuPopupCourse from "./component/MenuPopupCourse";

export default function Course() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [courseinfo, setCourseInfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);

  const { courseLoader, course } = useSelector((state) => state.course);

  const InitialCourse = () => {
    dispatch(
      getcourseAsync({
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
      {/* <Helmet>
        <title>Course | Lecture Dekho</title>
      </Helmet> */}

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Course"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Courses" },
          ]}
          action={
            <Button
              to={PATH_DASHBOARD.master.addcourses}
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
          loader={courseLoader}
          data={course?.rows}
          columns={coursecolumns({
            DataLogo,
            openPopover,
            handleOpenPopover,
            setCourseInfo,
            paginationpage,
          })}
          totalcount={course?.count}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          expandableRows={false}
          expandableRowsComponent={ExpandedComponent}
        />
        <MenuPopupCourse
          openPopover={openPopover}
          handleClosePopover={handleClosePopover}
          courseinfo={courseinfo}
        />
      </Container>
    </>
  );
}

const ExpandedComponent = ({ data }) => {
  console.log(data)
  return;
};
