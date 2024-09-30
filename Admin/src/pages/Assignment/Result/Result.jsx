import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import { assignmentcolumns } from "./utils";
import MenuPopupAssignment from "./Components/MenupopupResult";
import { PATH_DASHBOARD } from "routes/paths";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import CustomTable from "components/CustomTable";
import { useSettingsContext } from "components/settings";
import { useDispatch, useSelector } from "react-redux";
import { getAllAssignmentResultAsync } from "redux/slices/assignment/assignmentAsync";
export default function Result() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [assignmentInfo, setAssignmentInfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const { assignmentLoader, AssignmentResult } = useSelector(
    (state) => state.assignment
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const initialAssignment = () => {
    dispatch(
      getAllAssignmentResultAsync({
        page: paginationpage,
        limit: perPageNumber
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
    initialAssignment();
  }, [paginationpage, perPageNumber]);


  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title> Assignment Result | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Assignment Result"
        links={[
          { name: "Assignment", href: "" },
          { name: "Assignment Result" }
        ]}
      />

      <CustomTable
        columnheight="100px"
        loader={assignmentLoader}
        data={AssignmentResult?.data}
        columns={assignmentcolumns({
          openPopover,
          handleOpenPopover,
          setAssignmentInfo,
          paginationpage
        })}
        totalcount={AssignmentResult?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopupAssignment
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        assignmentInfo={assignmentInfo}
      />
    </Container>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
