import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Container } from "@mui/material";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import { _userList } from "../../../../_mock/arrays";
import Iconify from "../../../../components/iconify";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../../components/settings";
import { useDispatch } from "react-redux";
import { getboardAsync } from "../../../../redux/async.api";
import { useSelector } from "react-redux";
import CustomTable from "../../../../components/CustomTable";
import { boardcolumns } from "./utils";
import "./Board.css";
import MenuPopupBoard from "./component/MenuPopupBoard";

export default function Board() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [boardinfo, setBoardInfo] = useState("");
  const { boardLoader, boards } = useSelector((state) => state.board);
  const { getOnlySiteSettingLoader, getOnlySiteSettingData = [] } = useSelector((state) => state.getOnlySiteSetting)
  const { siteLogo, siteAuthorName,favicon,siteTitle  } = getOnlySiteSettingData


  const handlePageChange = (page) => {
    setPaginationpage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setperPageNumber(newPerPage);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };
  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const InitialCourse = () => {
    dispatch(
      getboardAsync({
        page: paginationpage,
        limit: perPageNumber,
      })
    );
  };

  useEffect(() => {
    InitialCourse();
  }, [paginationpage, perPageNumber]);

  return (
    <>
      <Helmet>
        <title>Board | {`${siteTitle}`}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Board"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Boards" },
          ]}
          action={
            <Button
              to={PATH_DASHBOARD.master.addboards}
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
          loader={boardLoader}
          data={boards?.rows}
          columns={boardcolumns({
            openPopover,
            handleOpenPopover,
            setBoardInfo,
            paginationpage
          })}
          totalcount={boards?.count}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          expandableRows={false}
          expandableRowsComponent={ExpandedComponent}
        />
        <MenuPopupBoard
          openPopover={openPopover}
          handleClosePopover={handleClosePopover}
          boardinfo={boardinfo}
        />
      </Container>
    </>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
