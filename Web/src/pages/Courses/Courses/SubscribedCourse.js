import React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllCoursesForWebAppAsync } from "../../../redux/async.api";
import { useSelector } from "react-redux";
import CourseSwitch from "../../../layouts/dashboard/header/CourseSwitch";

function SubscribedCourse({ setState, state, toggleDrawer }) {
  const dispatch = useDispatch();
  const { studentById } = useSelector((state) => state?.student);
  const { allCoursesLoader, allCourses = [] } = useSelector(
    (state) => state.completeProfile
  );
  const [activeCourse, setActiveCourse] = useState({});
  const [courseDialog, setCourseDialog] = useState(false);

  useEffect(() => {
    dispatch(getAllCoursesForWebAppAsync());
  }, []);

  return (
    <>
      <CourseSwitch
        toggleDrawer={toggleDrawer}
        setState={setState}
        state={state}
        allCoursesLoader={allCoursesLoader}
        allCourses={allCourses}
        setActiveCourse={setActiveCourse}
        activeCourse={activeCourse}
        setCourseDialog={setCourseDialog}
        courseDialog={courseDialog}
      />
    </>
  );
}

export default SubscribedCourse;
