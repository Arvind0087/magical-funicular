import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  FormControl,
  Autocomplete,
  TextField,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Container, Stack, Box } from "@mui/system";
import Iconify from "components/iconify";
import MenuPopupSOQ from "./components/MenuPopupSOQ";
import { ownQuestionColumn } from "./utils";
import { PATH_DASHBOARD } from "routes/paths";
import { Helmet } from "react-helmet-async";
import CustomTable from "components/CustomTable";
import { Link as RouterLink } from "react-router-dom";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import ReactHtmlParser from "react-html-parser";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { useDispatch, useSelector } from "react-redux";
import { getStudentOwnTest } from '../../../redux/StudentOwnTestSlice/StudentOwnTest.async'
export default function StudentOwnQuestion() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [SOQinfo, setSOQinfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const { studentOwnQuestionLoader, getAllStudentOwnQuestions } = useSelector((state) => state.ownTest);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);


  const InitialStudentOwnQuestion = () => {
    dispatch(
      getStudentOwnTest({
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
    InitialStudentOwnQuestion();
  }, [paginationpage, perPageNumber]);


  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Student Own Test | {`${tabTitle}`} </title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Student Own Test"
        links={[
          { name: "Test", href: "" },
          { name: "Student Own Test" },
        ]}
      />
      <CustomTable
        columnheight="30px"
        loader={studentOwnQuestionLoader}
        data={getAllStudentOwnQuestions?.data}
        columns={ownQuestionColumn({
          openPopover,
          handleOpenPopover,
          setSOQinfo,
          paginationpage,
        })}
        totalcount={getAllStudentOwnQuestions?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
      />
      <MenuPopupSOQ
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        SOQinfo={SOQinfo}
      />

    </Container >
  );
}

