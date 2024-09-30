import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import { Button, Container } from "@mui/material";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { _userList } from "../../../_mock/arrays";
import Iconify from "../../../components/iconify";
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../components/settings";
import CustomTable from "../../../components/CustomTable";

import "./Teacher.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllTeachersAsync } from "../../../redux/async.api";
import { teachercolumns } from "./utils";
import MenuPopup from "./component/MenuPopup";

export default function Subject() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [teacherinfo, setTeacherinfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const { teacherLoader, teachers } = useSelector((state) => state.teachers);
  const { getOnlySiteSettingLoader, getOnlySiteSettingData = [] } = useSelector((state) => state.getOnlySiteSetting)
  const { siteLogo, siteAuthorName, favicon, siteTitle } = getOnlySiteSettingData

  const InitialCourse = () => {
    dispatch(
      getAllTeachersAsync({
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
      <Helmet>
        <title>Teachers | {`${siteTitle}`}</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Staff"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Staff", href: "" },
            { name: "List" },
          ]}
          action={
            <Button
              to={PATH_DASHBOARD.master.addteacher}
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
          loader={teacherLoader}
          data={teachers?.data}
          columns={teachercolumns({
            openPopover,
            handleOpenPopover,
            setTeacherinfo,
            paginationpage,
          })}
          totalcount={teachers?.count}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          expandableRows={false}
          expandableRowsComponent={ExpandedComponent}
        />
        <MenuPopup
          openPopover={openPopover}
          handleClosePopover={handleClosePopover}
          teacherinfo={teacherinfo}
        />
      </Container>
    </>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);