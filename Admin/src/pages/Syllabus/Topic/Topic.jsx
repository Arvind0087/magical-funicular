import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  InputAdornment,
  FormControl,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import { useSettingsContext } from "components/settings/SettingsContext";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify/Iconify";
import MenupopupSyllabus from "./component/MenuPopupSyllabus";
import CustomTable from "components/CustomTable";
import { getAllSyllabusTopicAsync } from "redux/syllabuus/syllabus.async";
import { topiccolumns } from "./utils";
import {
  getSubjectFilterAsync,
  getSubjectByClassIdFilterAsync,
  getChapterFilterAsync,
  getChapterBySubjectIdFilterAsync,
  getClassWithBoardFilterAsync
} from "redux/filter/filter.async";
import _ from "lodash";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";


export default function Topic() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [syllabusinfo, setSyllabusinfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [searchTopic, setSearchTopic] = useState("");
  const [searchSubject, setSearchSubject] = useState([]);
  const [searchChapter, setSearchChapter] = useState([]);
  const [searchClass, setSearchClass] = useState([]);
  const [isFind, setIsFind] = useState(false);
  const { modulePermit } = useSelector((state) => state.menuPermission);

  const { syllabusLoader, syllabustopic } = useSelector(
    (state) => state.syllabus
  );

  const { filterLoader, subjectFilter, subjectByClassIdFilter, chapterFilter, ChapterBySubjectId, classWithBoardFilter } =
    useSelector((state) => state.filterInfo);

  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const InitialSyllabusTopic = ({
    pageNo,
    paginateNo,
    isFindManual,
    isReset
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
      getAllSyllabusTopicAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        status : "all",
        ...payload
      })
    );
  };

  const resetFilter = () => {
    setIsFind(false);
    setSearchClass([]);
    setSearchSubject([]);
    setSearchChapter([]);
    setSearchTopic("");
    InitialSyllabusTopic({
      pageNo: 1,
      paginateNo: 10,
      status : "all",
      isReset: true
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
    InitialSyllabusTopic({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    dispatch(getClassWithBoardFilterAsync({}));
    dispatch(getSubjectFilterAsync({}));
    dispatch(getChapterFilterAsync({}));
  }, []);

  useEffect(() => {
    dispatch(getSubjectByClassIdFilterAsync({ classId: [searchClass?.value] }))
  }, [searchClass])

  useEffect(() => {
    dispatch(getChapterBySubjectIdFilterAsync({ subjectId: searchSubject?.value }))
  }, [searchSubject])


  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Topic | {`${tabTitle}`}</title>
      </Helmet>

      <CustomBreadcrumbs
        // heading="Topic"
        links={[
          { name: "Syllabus", href: "" },
          { name: "Topic", href: "" }
        ]}
        action={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Box>
              <FormControl>
                <AutoCompleteCustom
                  size="small"
                  sx={{ width: 150, mr: 2, mb: { xs: 1, md: 1 } }}
                  loading={filterLoader}
                  options={_.map(classWithBoardFilter, (ev) => {
                    return { label: `${ev.className} (${ev.board})`, value: ev.id };
                  })}
                  value={searchClass}
                  onChange={(event, value) => setSearchClass(value)}
                  label="Class"
                />
              </FormControl>
              <FormControl >
                <AutoCompleteCustom
                  size="small"
                  sx={{ width: 150, mr: 2, mb: { xs: 1, sm: 0 } }}
                  loading={filterLoader}
                  options={searchClass?.value ?
                    _.map(subjectByClassIdFilter, (ev) => {
                      return { label: `${ev.subject}`, value: ev.id };
                    }) : _.map(subjectFilter, (ev) => {
                      return { label: `${ev.subjectName}`, value: ev.id };
                    })}
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
                  sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
                  loading={filterLoader}
                  options={searchSubject?.value ? _.map(ChapterBySubjectId, (ev) => {
                    return { label: `${ev.name}`, value: ev.id };
                  }) : _.map(chapterFilter, (ev) => {
                    return { label: `${ev.chapterName}`, value: ev.id };
                  })}
                  value={searchChapter}
                  onChange={(event, value) => setSearchChapter(value)}
                  label="Chapter"
                />
              </FormControl>
              <TextField
                size="small"
                sx={{ width: 150, mr: 2, mb: { xs: 1, sm: 0 } }}
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
                  )
                }}
              />
            </Box>
            <Box>
              <Button
                variant="contained"
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                onClick={() => {
                  setIsFind(true);
                  InitialSyllabusTopic({
                    pageNo: 1,
                    paginateNo: 10,
                    isFindManual: true
                  });
                }}
              >
                Filter
              </Button>
              <Button
                variant="contained"
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                onClick={resetFilter}
              >
                <AutorenewRoundedIcon />
              </Button>

              <Button
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                to={PATH_DASHBOARD.createtopic}
                component={RouterLink}
                variant="contained"
                disabled={!Boolean(modulePermit?.add)}
              >
                <AddIcon />
              </Button>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                alignItems: 'center',
                flexGrow: 1,
              }}
            >
              <Button
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.bulkupload}
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
        data={syllabustopic?.data}
        columns={topiccolumns({
          openPopover,
          handleOpenPopover,
          setSyllabusinfo,
          paginationpage
        })}
        totalcount={syllabustopic?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenupopupSyllabus
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        syllabusinfo={syllabusinfo}
      />
    </Container>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
