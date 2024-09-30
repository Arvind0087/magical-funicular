import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from "@mui/material";
import { Autocomplete } from "@mui/lab";
import { useSelector } from "react-redux";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import { useParams } from "react-router";

const Assign = ({ formik }) => {
  const { id } = useParams();
  const { courseLoader, course } = useSelector((state) => state.course);
  const { boardLoader, boardByCourse } = useSelector((state) => state.board);
  const { classLoader, classbycourseboard } = useSelector(
    (state) => state.class
  );
  const { batchLoader, batchByCourseBoardClass } = useSelector(
    (state) => state.batch
  );
  const { assignmentLoader, multipleStudents, multipleChapler } = useSelector(
    (state) => state.assignment
  );
  const { subjectLoader, subjectCourseBoardClassBatch } = useSelector(
    (state) => state.subject
  );

  return (
    <Box>
      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)"
        }}
      >
        <FormControl
          fullWidth
          disabled={assignmentLoader}
          error={Boolean(
            formik.touched.assingmenttype && formik.errors.assingmenttype
          )}
        >
          <InputLabel>Assignment Type</InputLabel>
          <Select
            name="assingmenttype"
            label="Assignment Type"
            {...formik.getFieldProps("assingmenttype")}
            onChange={formik.handleChange}
          >
            <MenuItem value="weeklyTest">Weekly Test</MenuItem>
            <MenuItem value="mockTest">Mock Test</MenuItem>
            <MenuItem value="homeWork">Home Work</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          fullWidth
          disabled={Boolean(id) || courseLoader}
          error={Boolean(formik.touched.courseId && formik.errors.courseId)}
        >
          <InputLabel>Select Course</InputLabel>
          <Select
            name="courseId"
            label={
              courseLoader ? (
                <CustomComponentLoader padding="0 0" size={20} />
              ) : (
                "Select Course"
              )
            }
            {...formik.getFieldProps("courseId")}
            onChange={formik.handleChange}
          >
            <MenuItem defaultValue value="">
              Select Course
            </MenuItem>
            {course?.data?.map((ev, index) => {
              return (
                <MenuItem value={ev.id} key={ev.index}>
                  {ev.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl
          fullWidth
          disabled={Boolean(id) || boardLoader}
          error={Boolean(formik.touched.boardId && formik.errors.boardId)}
        >
          <InputLabel>
            {boardLoader ? (
              <CustomComponentLoader padding="0 0" size={20} />
            ) : (
              "Select Board"
            )}
          </InputLabel>
          <Select
            label="Select Board"
            name="boardId"
            {...formik.getFieldProps("boardId")}
            onChange={formik.handleChange}
          >
            <MenuItem defaultValue value="">
              Select Board
            </MenuItem>
            {boardByCourse?.map((ev, index) => {
              return (
                <MenuItem value={ev.id} key={ev.index}>
                  {ev.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl
          fullWidth
          disabled={classLoader}
          error={Boolean(formik.touched.classId && formik.errors.classId)}
        >
          <InputLabel>
            {classLoader ? (
              <CustomComponentLoader padding="0 0" size={20} />
            ) : (
              "Select Class"
            )}
          </InputLabel>
          <Select
            label="Select Class"
            name="classId"
            {...formik.getFieldProps("classId")}
            onChange={formik.handleChange}
          >
            <MenuItem defaultValue value="">
              Select Class
            </MenuItem>
            {classbycourseboard?.map((ev, index) => {
              return (
                <MenuItem value={ev.id} key={ev.index}>
                  {ev.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl
          fullWidth
          disabled={batchLoader}
          error={Boolean(formik.touched.batchId && formik.errors.batchId)}
        >
          <InputLabel>
            {batchLoader ? (
              <CustomComponentLoader padding="0 0" size={20} />
            ) : (
              "Select Batch"
            )}
          </InputLabel>
          <Select
            label="Select Batch"
            name="batchId"
            {...formik.getFieldProps("batchId")}
            onChange={formik.handleChange}
          >
            <MenuItem defaultValue value="">
              Select Batch
            </MenuItem>
            {batchByCourseBoardClass?.map((ev, index) => {
              return (
                <MenuItem value={ev.id} key={ev.index}>
                  {ev.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <Autocomplete
          multiple
          disablePortal
          loading={assignmentLoader}
          name="students"
          options={
            multipleStudents?.data?.map((ev) => {
              return { label: ev.name, value: ev.id };
            }) || []
          }
          value={formik.values.students}
          onChange={(e, ev) => formik.setFieldValue("students", ev)}
          renderInput={(params) => (
            <TextField
              {...params}
              error={Boolean(formik.touched.students && formik.errors.students)}
              label={
                assignmentLoader ? (
                  <CustomComponentLoader padding="0 0" size={20} />
                ) : (
                  "Select Student"
                )
              }
            />
          )}
        />
        {/* <TextField
          type="date"
          name="date"
          label="Date"
          error={Boolean(formik.touched.date && formik.errors.date)}
          {...formik.getFieldProps("date")}
          onChange={formik.handleChange}
        /> */}
        <TextField
          InputLabelProps={{ shrink: true }}
          name="date"
          type="datetime-local"
          label="Start Date and Time"
          inputProps={{
            min: new Date().toISOString().slice(0, 16)
          }}
          fullWidth
          {...formik.getFieldProps("date")}
          onChange={formik.handleChange}
          error={Boolean(formik.touched.date && formik.errors.date)}
        />

        {formik.values.method === "upload" && (
          <>
            <Autocomplete
              multiple
              name="subjects"
              options={
                subjectCourseBoardClassBatch?.map((ev) => {
                  return { label: ev.name, value: ev.id };
                }) || []
              }
              value={formik.values.subjects}
              onChange={(e, ev) => formik.setFieldValue("subjects", ev)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Subjects"
                  error={Boolean(
                    formik.touched.subjects && formik.errors.subjects
                  )}
                />
              )}
            />
            <Autocomplete
              multiple
              name="chapters"
              options={
                multipleChapler?.data?.map((ev) => {
                  return { label: ev.name, value: ev.id };
                }) || []
              }
              value={formik.values.chapters}
              onChange={(e, ev) => formik.setFieldValue("chapters", ev)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Chapters"
                  error={Boolean(
                    formik.touched.chapters && formik.errors.chapters
                  )}
                />
              )}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default Assign;
