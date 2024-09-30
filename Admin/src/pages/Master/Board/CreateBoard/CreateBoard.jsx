import React, { useEffect } from "react";
import {
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
  Container,
  Stack,
} from "@mui/material";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { _initial, _validate } from "./utils";
import { useDispatch, useSelector } from "react-redux";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import { getcourseAsync } from "redux/course/course.async";
import {
  createBoardAsync,
  getBoardByIdAsync,
  updatBoardByIdAsync,
} from "redux/board/board.async";
import { emptyboard } from "redux/board/board.slice";
import { PATH_DASHBOARD } from "routes/paths";

function AddBoards() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { courseLoader, course } = useSelector((state) => state.course);
  const { boardLoader, boardadd, boardId, updateId } = useSelector(
    (state) => state.board
  );

  const getCourseAsync = () => {
    dispatch(getcourseAsync({}));
  };

  const onSubmit = async (value) => {
    const payload = {
      id: id,
      courseId: value.course,
      name: value.board,
    };
    if (id) {
      dispatch(updatBoardByIdAsync(payload));
    } else {
      delete payload.id;
      dispatch(createBoardAsync(payload));
    }
  };

  useEffect(() => {
    getCourseAsync();
  }, []);

  useEffect(() => {
    if (id) dispatch(getBoardByIdAsync(id));
  }, [id]);

  useEffect(() => {
    if (boardadd.status === 200) {
      toast.success(boardadd.message, toastoptions);
      dispatch(emptyboard()); // NEED TO CLEAR MESSAGE FROM STATE
      formik.setFieldValue("board", "");
    }
    if (updateId.status === 200) {
      toast.success(updateId.message, toastoptions);
      dispatch(emptyboard()); // NEED TO CLEAR MESSAGE FROM STATE
      navigate(PATH_DASHBOARD.board);
    }
  }, [boardadd, updateId]);

  useEffect(() => {
    if (id && boardId) {
      formik.setFieldValue("course", boardId.courseId);
      formik.setFieldValue("board", boardId.name);
    }
  }, [boardId, id]);

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate,
  }); // FOMRIK

  return (
    <>
      <Container maxWidth={themeStretch ? "lg" : false}>
        <CustomBreadcrumbs
          // heading={id ? "Update Board" : "Create Board"}
          links={[
            { name: "Master", href: "" },
            {
              name: "Board",
              href: PATH_DASHBOARD.board,
            },
            { name: id ? "Update Board" : "Create Board" },
          ]}
        />

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                  }}
                >
                  <FormControl
                    fullWidth
                    disabled={courseLoader}
                    error={Boolean(
                      formik.touched.course && formik.errors.course
                    )}
                  >
                    <InputLabel>
                      {courseLoader ? (
                        <CustomComponentLoader padding="0 0" size={20} />
                      ) : (
                        "Courses"
                      )}
                    </InputLabel>
                    <Select
                      label="Course"
                      name="course"
                      {...formik.getFieldProps("course")}
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
                  >
                    <TextField
                      name="board"
                      label="Board Name"
                      {...formik.getFieldProps("board")}
                      onChange={formik.handleChange}
                      fullWidth
                      error={formik.touched.board && formik.errors.board}
                    />
                  </FormControl>
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={boardLoader}
                  >
                    {id ? "Update Board" : "Create Board"}
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
}

export default AddBoards;
