import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  InputAdornment,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { useSettingsContext } from "components/settings/SettingsContext";
import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify/Iconify";
import MenupopupSyllabus from "./component/MenuPopupSyllabus";
import CustomTable from "components/CustomTable";
import { syllabuscollumns } from "./utils";
import { getAllSyllabusContentAsync,deleteSyllabusContentByIdAsync } from "redux/syllabuus/syllabus.async";
import {
  getSubjectFilterAsync,
  getSubjectByClassIdFilterAsync,
  getChapterFilterAsync,
  getChapterBySubjectIdFilterAsync,
  getClassWithBoardFilterAsync,
} from "redux/filter/filter.async";
import _ from "lodash";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";
import ConfirmDialog from "../../Shorts/component/DeleteShorts";
import { LoadingButton } from "@mui/lab";
import { emptysyllabusTopic } from "redux/syllabuus/syllabus.slice"
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";

export default function Content() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [syllabusinfo, setSyllabusinfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [searchSubject, setSearchSubject] = useState([]);
  const [searchChapter, setSearchChapter] = useState([]);
  const [searchClass, setSearchClass] = useState([]);
  const [searchTopic, setSearchTopic] = useState("");
  const [isFind, setIsFind] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { syllabusLoader, syllabuscontent,syllabusContentDelete } = useSelector(
    (state) => state.syllabus
  );
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );
  const {
    filterLoader,
    subjectFilter,
    subjectByClassIdFilter,
    chapterFilter,
    ChapterBySubjectId,
    classWithBoardFilter,
  } = useSelector((state) => state.filterInfo);

  const InitialSyllabusContent = ({
    pageNo,
    paginateNo,
    isFindManual,
    isReset,
  }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        classes: searchClass?.value,
        subject: searchSubject?.value,
        chapter: searchChapter?.value,
        search: searchTopic,
      };
    }
    if (isReset) {
      delete payload.classes;
      delete payload.subject;
      delete payload.chapter;
      delete payload.search;
    }
    dispatch(
      getAllSyllabusContentAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload,
      })
    );
  };

  const resetFilter = () => {
    setIsFind(false);
    setSearchClass([]);
    setSearchSubject([]);
    setSearchChapter([]);
    setSearchTopic("");
    InitialSyllabusContent({
      pageNo: 1,
      paginateNo: 10,
      isReset: true,
    });
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
    InitialSyllabusContent({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    dispatch(getClassWithBoardFilterAsync({}));
    dispatch(getSubjectFilterAsync({}));
    dispatch(getChapterFilterAsync({}));
  }, []);

  useEffect(() => {
    dispatch(getSubjectByClassIdFilterAsync({ classId: [searchClass?.value] }));
  }, [searchClass]);

  useEffect(() => {
    dispatch(
      getChapterBySubjectIdFilterAsync({ subjectId: searchSubject?.value })
    );
  }, [searchSubject]);

  console.log("syllabuscontent?.data", syllabuscontent.data);

  useEffect(() => {
    if (syllabusContentDelete.status === 200) {
      toast.success(syllabusContentDelete.message, toastoptions);
      dispatch(emptysyllabusTopic());
      setOpenConfirm(false);
      InitialSyllabusContent({
        pageNo: 1,
        paginateNo: 10,
      });
    }
  }, [syllabusContentDelete]);



  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Video Manager | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Video Manager"
        links={[
          { name: "Syllabus", href: "" },
          { name: "Video Manager", href: "" },
        ]}
        action={
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Box>
              <FormControl>
                <AutoCompleteCustom
                  size="small"
                  sx={{ width: 150, mr: 2, mb: { xs: 1, md: 1 } }}
                  loading={filterLoader}
                  options={_.map(classWithBoardFilter, (ev) => {
                    return {
                      label: `${ev.className} (${ev.board})`,
                      value: ev.id,
                    };
                  })}
                  value={searchClass}
                  onChange={(event, value) => setSearchClass(value)}
                  label="Class"
                />
              </FormControl>

              <FormControl>
                <AutoCompleteCustom
                  size="small"
                  sx={{ width: 150, mr: 2, mb: { xs: 1, md: 1 } }}
                  loading={filterLoader}
                  options={
                    searchClass?.value
                      ? _.map(subjectByClassIdFilter, (ev) => {
                          return { label: `${ev.subject}`, value: ev.id };
                        })
                      : _.map(subjectFilter, (ev) => {
                          return { label: `${ev.subjectName}`, value: ev.id };
                        })
                  }
                  value={searchSubject}
                  onChange={(event, value) => setSearchSubject(value)}
                  label="Subject"
                />
              </FormControl>
            </Box>
            <Box>
              <FormControl>
                <AutoCompleteCustom
                  size="small"
                  sx={{ width: 150, mr: 2, mb: { xs: 1, md: 1 } }}
                  loading={filterLoader}
                  options={
                    searchSubject?.value
                      ? _.map(ChapterBySubjectId, (ev) => {
                          return { label: `${ev.name}`, value: ev.id };
                        })
                      : _.map(chapterFilter, (ev) => {
                          return { label: `${ev.chapterName}`, value: ev.id };
                        })
                  }
                  value={searchChapter}
                  onChange={(event, value) => setSearchChapter(value)}
                  label="Chapter"
                />
              </FormControl>
              <TextField
                size="small"
                sx={{ width: 150, mr: 2, mb: { xs: 1, md: 1 } }}
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
                placeholder="Topic"
                InputProps={{
                  sx: { borderRadius: "10px !important" },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify
                        icon="eva:search-fill"
                        sx={{ color: "text.disabled" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              <Button
                variant="contained"
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 1 } }}
                onClick={() => {
                  setIsFind(true);
                  InitialSyllabusContent({
                    pageNo: 1,
                    paginateNo: 10,
                    isFindManual: true,
                  });
                }}
              >
                Filter
              </Button>
              <Button
                variant="contained"
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 1 } }}
                onClick={resetFilter}
              >
                <AutorenewRoundedIcon />
              </Button>
              <Button
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 1 } }}
                to={PATH_DASHBOARD.createcontent}
                component={RouterLink}
                variant="contained"
                onClose={() => setOpenConfirm(false)}
                disabled={!Boolean(modulePermit?.add)}
              >
                <AddIcon />
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: { xs: "flex-start", md: "flex-end" },
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <Button
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 1 } }}
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.bulkuploadvideo}
              >
                <FileUploadIcon />
              </Button>
            </Box>
          </Box>
        }
      />
      <CustomTable
        columnheight="30px"
        loader={syllabusLoader}
        data={syllabuscontent?.data}
        columns={syllabuscollumns({
          openPopover,
          handleOpenPopover,
          setSyllabusinfo,
          paginationpage,
        })}
        totalcount={syllabuscontent?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenupopupSyllabus
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        syllabusinfo={syllabusinfo}
        setOpenConfirm={setOpenConfirm}
      />
      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={syllabusLoader}
            onClick={() => dispatch(deleteSyllabusContentByIdAsync(syllabusinfo.id))}
          >
            Delete
          </LoadingButton>
        }
      />
    </Container>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
