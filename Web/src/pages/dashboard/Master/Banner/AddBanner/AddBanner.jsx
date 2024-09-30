import React, { useState } from "react";
import {
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import CustomBreadcrumbs from "../../../../../components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "../../../../../components/settings";
import { LoadingButton } from "@mui/lab";
import { _initialValues } from "./utils";
import { useNavigate, useParams } from "react-router";
import { UploadAvatar } from "../../../../../components/upload";
import { isObject } from "../../../../../utils/isObject";
import { useDispatch } from "react-redux";
import {
  createBannerAsync,
  getBannerByIdAsync,
  updateBannerAsync,
} from "../../../../../redux/async.api";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { toastoptions } from "../../../../../utils/toastoptions";
import { emptybanner } from "../../../../../redux/slices/banner.slice";

function AddBanner() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imageupload, seImageUpload] = useState();
  const [title, setTitle] = useState("");
  const [backLink, setBackLink] = useState("");
  const [bannertype, setBannertype] = useState("");
  const [errorhandle, setErrorhandle] = useState({
    image: false,
    title: false,
    link: false,
    type: false,
  });
  const { bannerLoader, bannerById, banneradd, bannerupdate } = useSelector(
    (state) => state.banner
  );

  const handleDrop = (acceptedFiles) => {
    // HANDLE FILES
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    if (file) {
      // SET FILE IN STATE
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
      { imageupload, title, backLink, bannertype },
      setErrorhandle,
      errorhandle
    );
    // IF VALIDATEDATA FALSE ALL DATA FIELD
    if (!validatedata) {
      // GENERATE BASE64 WHEN FILE IS FILE OBJECT | PARAMS IS IMAGE FILE OR URL
      const ImageBase64 = await GenerateBase64(imageupload);
      // PAYLOAD
      const payload = {
        bannerId: id,
        image: GenerateFileObject(imageupload, ImageBase64, title),
        title: title,
        backLink: backLink,
        type: bannertype,
      };
      if (id) {
        // WHEN WE WANT TO UPDATE DATA
        dispatch(updateBannerAsync(payload));
      } else {
        // WHEN WE WANT TO UPLOAD DATA
        dispatch(createBannerAsync(payload));
      }
    }
  };

  useEffect(() => {
    if (id) {
      // GET INFORMATION BY ID
      dispatch(getBannerByIdAsync(id));
    }
  }, []);

  useEffect(() => {
    // FILL DATA TO INPUT BOX WHEN DATA IS AVALIABLE
    if (bannerById) {
      setTitle(bannerById.title);
      setBackLink(bannerById.backLink);
      setBannertype(bannerById.type);
      seImageUpload(bannerById.image);
    } else {
      // REMOVE DATA TO INPUT BOX WHEN DATA IS NOT AVALIABLE
      setTitle("");
      setBackLink("");
      setBannertype("");
      seImageUpload();
    }
  }, [bannerById]);

  useEffect(() => {
    // SUCCESS MESSAGE EFFECT
    if (banneradd.status === 200) {
      toast.success(banneradd.message, toastoptions);
      dispatch(emptybanner());
      setTitle("");
      setBackLink("");
      setBannertype("");
      seImageUpload();
      navigate("/app/master/banner");
    }
    if (bannerupdate.status === 200) {
      toast.success(bannerupdate.message, toastoptions);
      dispatch(emptybanner());
      navigate("/app/master/banner");
    }
  }, [banneradd, bannerupdate]);

  return (
    <>
      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={id ? "Update Banner" : "Create Banner"}
          links={[
            {
              name: "Dashboard",
              href: "/app/master",
            },
            {
              name: "Banners",
              href: "/app/master/banner",
            },
            { name: id ? "Update Batch" : "Create Batch" },
          ]}
        />
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={5} md={4}>
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
            <Grid item xs={6} md={8}>
              <Card sx={{ p: 3 }}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(1, 1fr)",
                  }}
                >
                  <FormControl fullWidth>
                    <TextField
                      name="title"
                      label="Banner Title"
                      value={title}
                      fullWidth
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setErrorhandle({
                          ...errorhandle,
                          title: false,
                        });
                      }}
                    />
                    <ErrorMessage show={errorhandle.title} />
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Banner Type</InputLabel>
                    <Select
                      label="Banner Type"
                      name="type"
                      value={bannertype}
                      onChange={(e) => {
                        setBannertype(e.target.value);
                        setErrorhandle({
                          ...errorhandle,
                          type: false,
                        });
                      }}
                    >
                      <MenuItem defaultValue value="">
                        Select Banner Type
                      </MenuItem>
                      <MenuItem value="home">Home</MenuItem>
                      <MenuItem value="assessment">Assessment</MenuItem>
                    </Select>
                    <ErrorMessage show={errorhandle.type} />
                  </FormControl>

                  <FormControl fullWidth>
                    <TextField
                      name="url"
                      label="Banner URL"
                      value={backLink}
                      fullWidth
                      onChange={(e) => {
                        setBackLink(e.target.value);
                        setErrorhandle({
                          ...errorhandle,
                          link: false,
                        });
                      }}
                    />
                    <ErrorMessage show={errorhandle.link} />
                  </FormControl>
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={bannerLoader}
                  >
                    {id ? "Update Banner" : "Create Banner"}
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

export default AddBanner;

// OUTER FUNCTIONS
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

const GenerateBase64 = async (file) => {
  let ImageBase64;
  if (isObject(file)) {
    ImageBase64 = await convertToBase64(file);
  } else {
    ImageBase64 = file;
  }
  return ImageBase64;
};

const ValidationHandleBanner = (infomation, setErrorhandle, errorhandle) => {
  if (!infomation.imageupload) {
    setErrorhandle({
      ...errorhandle,
      image: true,
    });
    return true;
  } else if (infomation.title === "" || !infomation.title) {
    setErrorhandle({
      ...errorhandle,
      title: true,
    });
    return true;
  } else if (infomation.backLink === "" || !infomation.backLink) {
    setErrorhandle({
      ...errorhandle,
      link: true,
    });
    return true;
  } else if (infomation.bannertype === "" || !infomation.bannertype) {
    setErrorhandle({
      ...errorhandle,
      type: true,
    });
    return true;
  }
  return false;
};
