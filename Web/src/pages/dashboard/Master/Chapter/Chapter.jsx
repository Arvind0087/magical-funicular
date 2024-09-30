import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import { Button, Container } from "@mui/material";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import { _userList } from "../../../../_mock/arrays";
import Iconify from "../../../../components/iconify";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../../components/settings";
import CustomTable from "../../../../components/CustomTable";
import "./Chapter.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllChaptersAsync } from "../../../../redux/async.api";
import { chaptercolumns } from "./utils";
import MenuPopupChapter from "./component/MenuPopupChapter";

export default function Chapter() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [chapterinfo, setChapterInfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const { chapterLoader, chapter } = useSelector((state) => state.chapter);

  const Chapter = () => {
    dispatch(
      getAllChaptersAsync({
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
    Chapter();
  }, [paginationpage, perPageNumber]);

  return (
    <>
      {/* <Helmet>
        <title>Chapter | Lecture Dekho</title>
      </Helmet> */}

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Chapter"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Chapter", href: "" },
            { name: "List" },
          ]}
          action={
            <Button
              to={PATH_DASHBOARD.master.addchapter}
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
          loader={chapterLoader}
          data={chapter?.rows}
          columns={chaptercolumns({
            openPopover,
            handleOpenPopover,
            setChapterInfo,
            paginationpage,
          })}
          totalcount={chapter?.count}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          expandableRows={false}
          expandableRowsComponent={ExpandedComponent}
        />
        <MenuPopupChapter
          openPopover={openPopover}
          handleClosePopover={handleClosePopover}
          chapterinfo={chapterinfo}
        />
      </Container>
    </>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
