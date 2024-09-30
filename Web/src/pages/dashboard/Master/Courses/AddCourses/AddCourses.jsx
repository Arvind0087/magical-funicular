import {
  Button,
  Card,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import CustomBreadcrumbs from "../../../../../components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "../../../../../components/settings";
import { LoadingButton } from "@mui/lab";
import { UploadAvatar } from "../../../../../components/upload";
import "./AddCourses.css";
import Iconify from "../../../../../components/iconify/Iconify";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  createcourseAsync,
  getcoursebyidAsync,
  updatecoursebyidAsync,
} from "../../../../../redux/async.api";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-hot-toast";
import { toastoptions } from "../../../../../utils/toastoptions";
import { isJson } from "../../../../../utils/isJson";
import { isObject } from "../../../../../utils/isObject";
import { emptycourse } from "../../../../../redux/slices/course.slice";
import CustomComponentLoader from "../../../../../components/CustomComponentLoader/CustomComponentLoader";

const AddCourses = ({}) => {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [listData, setListData] = useState([{ name: "" }]);
  const [imageupload, seImageUpload] = useState();
  const [coursename, setCourseName] = useState("");
  const [courseshortDescription, setCourseshortDescription] = useState("");
  const { courseLoader, courseadd, courseId, updateId } = useSelector(
    (state) => state.course
  );
  const [errorhandle, setErrorhandle] = useState({
    image: false,
    name: false,
    short: false,
    list: false,
  });

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...listData];
    list[index][name] = value;
    setListData(list);
  };

  const handleServiceRemove = (index) => {
    if (listData.length > 1) {
      const list = [...listData];
      list.splice(index, 1);
      setListData(list);
    }
  };

  const handleAdd = () => {
    setListData([...listData, { name: "" }]);
  };

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    if (file) {
      seImageUpload(newFile);
      setErrorhandle({
        ...errorhandle,
        image: false,
      });
    }
  };

  const handleSubmit = async (e) => {
    // HANDLE SUBMIT
    e.preventDefault();
    // VALIDATE FIELD IS FIELD OR NOT | PARAMS IS OBJECT { FILE OR URL,TITLE,BACKLINK,BANNERTYPE } ERRORHANDLE STATE
    const validatedata = ValidationHandleBanner(
      { imageupload, coursename, courseshortDescription, listData },
      setErrorhandle,
      errorhandle
    );

    // IF VALIDATEDATA FALSE ALL DATA FIELD
    if (!validatedata) {
      // GENERATE BASE64 WHEN FILE IS FILE OBJECT | PARAMS IS IMAGE FILE OR URL
      const ImageBase64 = await GenerateBase64(imageupload);
      // LIST INFO
      const listinfo = [];
      for (let value of listData) {
        if (value.name !== "") {
          listinfo.push(value.name);
        }
      }
      // PAYLOAD
      const payload = {
        id: id,
        name: coursename,
        shortDescription: courseshortDescription,
        image: GenerateFileObject(imageupload, ImageBase64, coursename),
        list: JSON.stringify(listinfo),
      };
      if (id) {
        dispatch(updatecoursebyidAsync(payload));
      } else {
        dispatch(createcourseAsync(payload));
      }
    }
  };

  useEffect(() => {
    if (courseadd.status === 200) {
      toast.success(courseadd.message, toastoptions);
      dispatch(emptycourse());
      setListData([{ name: "" }]);
      setCourseName("");
      setCourseshortDescription("");
      seImageUpload();
      // navigate("/app/master/courses");
    }
    if (updateId.status === 200) {
      toast.success(updateId.message, toastoptions);
      dispatch(emptycourse());
      navigate("/app/master/courses");
    }
  }, [courseadd, updateId]);

  useEffect(() => {
    if (id) {
      dispatch(getcoursebyidAsync(id));
    }
  }, []);

  useEffect(() => {
    // VALUE SET
    if (id) {
      if (courseId) {
        if (isJson(courseId.list)) {
          const maplist = JSON.parse(courseId.list).map((ev) => {
            return {
              name: ev,
            };
          });
          setListData(maplist);
        }
        seImageUpload(courseId.image);
        setCourseName(courseId.name);
        setCourseshortDescription(courseId.shortDescription);
      }
    } else {
      setListData([{ name: "" }]);
      seImageUpload("");
      setCourseName("");
      setCourseshortDescription("");
    }
  }, [courseId, id]);

  return (
    <>
      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={Boolean(id) ? "Update Course" : "Create Course"}
          links={[
            {
              name: "Dashboard",
              href: "/app/master",
            },
            {
              name: "Course",
              href: "/app/master/courses",
            },
            { name: Boolean(id) ? "Update Course" : "Add Course" },
          ]}
        />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Card sx={{ pt: 5, pb: 3, px: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <UploadAvatar
                    name="image"
                    accept={{
                      "image/*": [],
                    }}
                    file={imageupload}
                    error={errorhandle.image}
                    onDrop={handleDrop}
                    helperText={
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 2,
                          mx: "auto",
                          display: "block",
                          textAlign: "center",
                          color: errorhandle.image ? "red" : "text.secondary",
                        }}
                      >
                        Allowed *.jpeg, *.jpg, *.png, *.gif
                        <br /> max size of
                      </Typography>
                    }
                  />
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={9}>
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
                  <Box>
                    <FormControl fullWidth disabled={courseLoader}>
                      <TextField
                        name="name"
                        label={
                          courseLoader ? (
                            <CustomComponentLoader padding="0 0" size={20} />
                          ) : (
                            "Course Name"
                          )
                        }
                        fullWidth
                        className="textfield"
                        value={coursename}
                        onChange={(e) => {
                          setCourseName(e.target.value);
                          setErrorhandle({
                            ...errorhandle,
                            name: false,
                          });
                        }}
                      />
                    </FormControl>
                    <ErrorMessage show={errorhandle.name} />
                  </Box>
                  <Box>
                    <FormControl fullWidth disabled={courseLoader}>
                      <TextField
                        name="shortDescription"
                        label={
                          courseLoader ? (
                            <CustomComponentLoader padding="0 0" size={20} />
                          ) : (
                            "Short Description*"
                          )
                        }
                        fullWidth
                        value={courseshortDescription}
                        onChange={(e) => {
                          setCourseshortDescription(e.target.value);
                          setErrorhandle({
                            ...errorhandle,
                            short: false,
                          });
                        }}
                      />
                    </FormControl>
                    <ErrorMessage show={errorhandle.short} />
                  </Box>

                  {listData.map((roleAdd, index) => (
                    <Box key={index} className="role">
                      <Grid item xs={4} md={12}>
                        <FormControl fullWidth disabled={courseLoader}>
                          <TextField
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  {listData.length !== 0 && (
                                    <div>
                                      {index !== 0 || listData.length > 1 ? (
                                        <Iconify
                                          icon="eva:trash-2-outline"
                                          onClick={() =>
                                            handleServiceRemove(index)
                                          }
                                          style={{
                                            cursor: "pointer",
                                            marginRight: "10px",
                                          }}
                                        />
                                      ) : null}
                                      {listData.length - 1 === index && (
                                        <Iconify
                                          icon="eva:plus-fill"
                                          onClick={handleAdd}
                                          style={{
                                            cursor: "pointer",
                                          }}
                                        />
                                      )}
                                    </div>
                                  )}
                                </InputAdornment>
                              ),
                            }}
                            fullWidth
                            label={
                              courseLoader ? (
                                <CustomComponentLoader
                                  padding="0 0"
                                  size={20}
                                />
                              ) : (
                                "List*"
                              )
                            }
                            sx={{ marginTop: "10px", background: "#F9F9F9" }}
                            name="name"
                            type="text"
                            id="list"
                            value={roleAdd.name}
                            onChange={(e) => {
                              handleChange(e, index);
                              setErrorhandle({
                                ...errorhandle,
                                list: false,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <ErrorMessage show={errorhandle.list} />
                    </Box>
                  ))}
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={courseLoader}
                  >
                    {id ? "Update Course" : "Create Course"}
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
};

export default AddCourses;

const ErrorMessage = ({ show }) => {
  return (
    <>
      {show && (
        <Typography
          variant="body1"
          sx={{
            color: "red",
            fontSize: "13px",
            marginTop: "5px",
            marginLeft: "1px",
          }}
        >
          Field is required*
        </Typography>
      )}
    </>
  );
};

const ValidationHandleBanner = (infomation, setErrorhandle, errorhandle) => {
  if (!infomation.imageupload) {
    setErrorhandle({
      ...errorhandle,
      image: true,
    });
    return true;
  } else if (infomation.coursename === "" || !infomation.coursename) {
    setErrorhandle({
      ...errorhandle,
      name: true,
    });
    return true;
  } else if (
    infomation.courseshortDescription === "" ||
    !infomation.courseshortDescription
  ) {
    setErrorhandle({
      ...errorhandle,
      short: true,
    });
    return true;
  } else if (infomation.listData[0]?.name.length === 0) {
    setErrorhandle({
      ...errorhandle,
      list: true,
    });
    return true;
  }
  return false;
};

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

const GenerateBase64 = async (file) => {
  let ImageBase64;
  if (isObject(file)) {
    ImageBase64 = await convertToBase64(file);
  } else {
    ImageBase64 = file;
  }
  return ImageBase64;
};

const GenerateFileObject = (file, Base64, filename) => {
  return {
    extension: isObject(file) ? `.${getExtension(file.path)}` : "",
    type: isObject(file) ? file.type : "",
    file: isObject(file) ? Base64.split("base64,")[1] : file,
    filename: isObject(file) ? filename.replace(/\s/g, "").toLowerCase() : "",
    isBase64: isObject(file) ? true : false,
  };
};

const getExtension = (path) => {
  let basename = path.split(/[\\/]/).pop(),
    pos = basename.lastIndexOf(".");
  if (basename === "" || pos < 1) return "";
  return basename.slice(pos + 1);
};
