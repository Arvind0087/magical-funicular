import React, { useEffect } from "react";
import {
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import CustomBreadcrumbs from "../../../../../components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "../../../../../components/settings";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { BoardValidate, _initialValues } from "./utils";
import { useDispatch } from "react-redux";
import {
  createBoardAsync,
  getBoardByIdAsync,
  getcourseAsync,
  updatBoardByIdAsync,
} from "../../../../../redux/async.api";
import { useSelector } from "react-redux";
import { toastoptions } from "../../../../../utils/toastoptions";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { emptyboard } from "../../../../../redux/slices/boards.slice";
import CustomComponentLoader from "../../../../../components/CustomComponentLoader/CustomComponentLoader";

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
    dispatch(
      getcourseAsync({
        page: "",
        limit: "",
      })
    );
  };

  const onSubmit = async (value) => {
    if (id) {
      dispatch(
        updatBoardByIdAsync({
          id: id,
          courseId: value.course,
          name: value.board,
        })
      );
    } else {
      dispatch(
        createBoardAsync({
          courseId: value.course,
          name: value.board,
        })
      );
    }
  };

  useEffect(() => {
    if (boardadd.status === 200) {
      toast.success(boardadd.message, toastoptions);
      dispatch(emptyboard()); // NEED TO CLEAR MESSAGE FROM STATE
      formik.setFieldValue("board", "");
      // navigate("/app/master/board");
    }
    if (updateId.status === 200) {
      toast.success(updateId.message, toastoptions);
      dispatch(emptyboard()); // NEED TO CLEAR MESSAGE FROM STATE
      navigate("/app/master/board");
    }
  }, [boardadd, updateId]);

  useEffect(() => {
    getCourseAsync();
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(getBoardByIdAsync(id));
    }
  }, [id]);

  useEffect(() => {
    // VALUE SET
    if (id) {
      if (boardId) {
        formik.setFieldValue("course", boardId.courseId);
        formik.setFieldValue("board", boardId.name);
      }
    } else {
      formik.setFieldValue("course", "");
      formik.setFieldValue("board", "");
    }
  }, [boardId, id]);

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: BoardValidate,
  }); // FOMRIK

  return (
    <>
      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={id ? "Update Board" : "Create Board"}
          links={[
            {
              name: "Dashboard",
              href: "/app/master",
            },
            {
              name: "Board",
              href: "/app/master/board",
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
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl
                      fullWidth
                      disabled={courseLoader || boardLoader}
                    >
                      <InputLabel>
                        {courseLoader || boardLoader ? (
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
                        {course?.rows?.map((ev, index) => {
                          return (
                            <MenuItem value={ev.id} key={ev.index}>
                              {ev.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {formik.touched.course && formik.errors.course && (
                        <small className="formikerror">
                          {formik.errors.course}
                        </small>
                      )}
                    </FormControl>
                  </Box>
                  <FormControl fullWidth disabled={courseLoader || boardLoader}>
                    <TextField
                      name="board"
                      label={
                        courseLoader || boardLoader ? (
                          <CustomComponentLoader padding="0 0" size={20} />
                        ) : (
                          "Board Name"
                        )
                      }
                      {...formik.getFieldProps("board")}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                    {formik.touched.board && formik.errors.board && (
                      <small className="formikerror">
                        {formik.errors.board}
                      </small>
                    )}
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
