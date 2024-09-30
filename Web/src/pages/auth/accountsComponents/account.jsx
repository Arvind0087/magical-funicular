import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import "./AccountStyle.css";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllCoursesAsync,
  getAllCoursesForWebAppAsync,
} from "../../../redux/async.api";
import CustomComponentLoader from "../../../components/CustomComponentLoader/CustomComponentLoader";
import { useLocation } from "react-router";
import { PATH_AUTH } from "../../../routes/paths";
import CourseCard from "./courseCard";

export default function Account(props) {
  const { setActiveTab, activeTab, formik } = props;
  const { allCoursesLoader, allCourses = [] } = useSelector(
    (state) => state.completeProfile
  );
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (location?.pathname === PATH_AUTH.createAccount) {
      dispatch(getAllCoursesForWebAppAsync());
    } else {
      dispatch(getAllCoursesForWebAppAsync());
    }
  }, []);

  return (
    <>
      <Box
        sx={{
          pt: 2,
          pb: 4,
          width: "100%",
          height: "auto",
          overflowY: "auto",
        }}
      >
        {allCoursesLoader ? (
          <>
            <CustomComponentLoader padding="0" size={40} />
          </>
        ) : (
          <Grid container sx={{ pr: "20px" }} spacing={2}>
            {allCourses &&
              allCourses?.map((course) => {
                return (
                  <CourseCard
                    course={course}
                    setActiveTab={setActiveTab}
                    formik={formik}
                  />
                );
              })}
          </Grid>
        )}
      </Box>
    </>
  );
}
