import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useSelector, useDispatch } from "react-redux";
import {
  getAssignmentsByStudentIdAsync,
  getSubjectsByStudentAsync,
} from "redux/async.api";
import SubjectBlockCustom from "components/SubjectBlockCustom/SubjectBlockCustom";
import { WorkStatus } from "./WorkStatus";

const TABS = [
  {
    value: "completed",
    label: "completed",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "upcoming",
    label: "upcoming",
  },
];

const MyAssignment = (props) => {
  // const { subjectInfo } = props;
  const dispatch = useDispatch();
  const [id, setId] = useState();
  const { studentById = [] } = useSelector((state) => state?.student);
  const { courseId, boardId, classId, batchTypeId } = studentById;
  const { subjectLoader } = useSelector((state) => state?.subject);
  const { assignment } = useSelector((state) => state);
  // state
  const [subjectInfo, setSubjectInfo] = useState([]);
  const [subjectInformation, setSubjectInformation] = useState({});
  const [currentTab, setCurrentTab] = useState("upcoming");
  const [subjectId, setSubjectId] = useState({ id: null });

  const handleClick = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const showStatus = (studentId) => {
    setId(studentId);
  };

  // GET SUBJECTS
  useEffect(() => {
    if (courseId) {
      dispatch(
        getSubjectsByStudentAsync({
          courseId: courseId,
          boardId: boardId,
          classId: classId,
          batchTypeId: batchTypeId,
        })
      ).then((res) => {
        const { payload } = res || {};
        const { status, data } = payload || {};
        if (status === 200) {
          setSubjectInfo(data);
          data?.map((item) => {
            if (item?.isAllSubject) {
              setSubjectId({ id: item?.id });
              dispatch(
                getAssignmentsByStudentIdAsync({
                  status: currentTab,
                  subjectId: item?.id,
                })
              );
            }
          });
        }
      });
    }
  }, [studentById]);

  // for all subject assignment
  useEffect(() => {
    if (subjectId.id) {
      dispatch(
        getAssignmentsByStudentIdAsync({
          status: currentTab,
          subjectId: subjectId?.id,
        })
      );
    }
  }, [currentTab]);
  // on subject click
  const handleEvent = (ev) => {
    setSubjectInformation(ev);
    setSubjectId({ id: ev.id });
    dispatch(
      getAssignmentsByStudentIdAsync({
        status: currentTab,
        subjectId: ev.id,
      })
    );
  };
  // useMemo(() => {
  //   // GET chapter
  //   if (subjectInformation?.id) {
  //     dispatch(
  //       getChapterByStudentAsync({
  //         courseId: courseId,
  //         boardId: boardId,
  //         classId: classId,
  //         batchTypeId: batchTypeId,
  //         subjectId: subjectInformation?.id,
  //       })
  //     );
  //   }
  // }, [subjectInformation]);

  return (
    <>
      <Container sx={{ ml: "30px" }}>
        <SubjectBlockCustom
          loader={subjectLoader}
          data={subjectInfo}
          handleEvent={handleEvent}
          selectsubject={subjectId}
        />
      </Container>
      <Box sx={{ mt: "30px" }}>
        <WorkStatus
          statusTabs={TABS}
          showStatus={showStatus}
          id={id}
          subjectId={subjectId}
          onValueChange={handleClick}
          currentTab={currentTab}
        />
      </Box>
    </>
  );
};
export default MyAssignment;
