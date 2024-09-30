import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Box, Button, Typography, useTheme } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { uploadAvatarAsync, getStudentByIdAsync } from "../../redux/async.api";
import { toastoptions } from "../../utils/toastoptions";
import CustomAvatar from "../../components/custom-avatar/CustomAvatar";
import RequestCallback from "./RequestCallback";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Helmet } from "react-helmet-async";
export default function UpadateProfileCover(props) {
  const { name, phone, boardName, batchTypeName, className } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const { studentById } = useSelector((state) => state?.student);
  const { id, avatar, subscriptionType } = studentById;
  const { getOnlySiteSettingLoader, getOnlySiteSettingData = [] } = useSelector(
    (state) => state.getOnlySiteSetting
  );
  const { siteLogo, siteAuthorName, favicon, siteTitle } =
    getOnlySiteSettingData;
  // for popup
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  //profile photo
  const [image, setImage] = useState();
  const [file, setFile] = useState(null);
  // functions
  function handleFileChange(event) {
    const newfile = event.target.files[0];
    setFile(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      setImage(imageUrl);
    };
    reader.readAsDataURL(newfile);
  }

  function handleImageClick() {
    const fileInput = document.getElementById("file-input");
    fileInput.click();
  }

  useEffect(() => {
    const payload = {
      userId: studentById?.id,
      batchTypeId: "",
    };
    dispatch(getStudentByIdAsync(payload));
  }, []);

  function handleUploadClick() {
    dispatch(
      uploadAvatarAsync({
        userId: id,
        avatar: image,
      })
    ).then((res) => {
      const { payload } = res || {};
      const { status, message } = payload || {};
      if (status === 200) {
        toast.success(message, toastoptions);
      }
    });
    setFile("");
  }
  return (
    <>
      <Helmet>
        <title>Profile | {`${siteTitle}`}</title>
      </Helmet>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          bgcolor: "primary.main",
          color: "white",
          flex: 1,
          [theme.breakpoints.down("md")]: {
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            m: 2,
            mb: 7,
            [theme.breakpoints.down("md")]: {
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              mb: -1,
            },
          }}
        >
          <div>
            {image ? (
              <>
                <div style={{ position: "relative" }}>
                  <CustomAvatar
                    id="my-image"
                    src={image}
                    alt={name}
                    name={name}
                    onClick={handleImageClick}
                    sx={{
                      mx: "auto",
                      color: "white",
                      borderWidth: 2,
                      borderStyle: "solid",
                      borderColor: "common.white",
                      width: { xs: 80, md: 128 },
                      height: { xs: 80, md: 128 },
                      zindex: 1,
                    }}
                  />
                  <div
                    onClick={handleImageClick}
                    style={{ position: "absolute", top: "76%", right: "7%" }}
                  >
                    <AddAPhotoIcon />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ position: "relative" }}>
                  <CustomAvatar
                    id="my-image"
                    src={avatar}
                    alt={name}
                    name={name}
                    onClick={handleImageClick}
                    sx={{
                      mx: "auto",
                      borderWidth: 2,
                      color: "white",
                      borderStyle: "solid",
                      borderColor: "common.white",
                      width: { xs: 80, md: 128 },
                      height: { xs: 80, md: 128 },
                      zindex: 1,
                    }}
                  />
                  <div
                    onClick={handleImageClick}
                    style={{ position: "absolute", top: "76%", right: "7%" }}
                  >
                    <AddAPhotoIcon />
                  </div>
                </div>
              </>
            )}
            <input
              type="file"
              id="file-input"
              accept="image/png, image/gif, image/jpeg, image/*, image/jpg"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: { xs: "center", md: "center" },
              ml: { md: 3 },
              mt: { xs: 1, md: 0 },
              [theme.breakpoints.down("md")]: {
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                width: "100%",
              },
            }}
          >
            <Typography variant="h4">{name}</Typography>
            <Typography sx={{ opacity: 0.72, mb: 0.5 }}>
              {boardName},{batchTypeName},{className}
            </Typography>
            <Box
              sx={{
                width: "100%",
                [theme.breakpoints.down("md")]: {
                  textAlign: "center",
                  alignItems: "center",
                  width: "65%",
                  // paddingInline: "30%"
                },
              }}
            >
              <Typography
                sx={{
                  bgcolor: "primary.lighter",
                  color: "primary.main",
                  height: "100%",
                  borderRadius: "27px",
                  textAlign: "center",
                  width: "100%",
                  paddingBlock: 0.5,
                  paddingInline: "10px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {subscriptionType} Subscription
                <CheckCircleIcon
                  sx={{
                    height: "15px",
                    mt: 0.6,
                    ml: 0.4,
                    color: "#E27A00",
                    display: subscriptionType == "Free" ? "none" : "block",
                  }}
                />
              </Typography>
            </Box>
            <Box
              sx={{
                height: "20px",
                width: "100%",
                [theme.breakpoints.down("md")]: {
                  // paddingInline: "30%",
                  width: "65%",
                },
              }}
            >
              {file && (
                <Button
                  variant="contained"
                  onClick={handleUploadClick}
                  sx={{
                    height: "100%",
                    borderRadius: "27px",
                    height: "20px",
                    width: "100%",
                    color: "primary.main",
                    bgcolor: "primary.lighter",
                    padding: 2,
                    textAlign: "center",
                    mt: 1,
                    [theme.breakpoints.down("md")]: {
                      textAlign: "center",
                      width: "100%",
                      mt: 1,
                    },
                  }}
                >
                  Update Profile Photo
                </Button>
              )}
            </Box>
          </Box>
          {/* </Box> */}
        </Box>
        <Box
          sx={{
            m: 2,
            mb: 5,
            height: "50px",
            mb: 7,
            [theme.breakpoints.down("md")]: {
              textAlign: "center",
              mb: 2,
            },
          }}
        >
          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{
              height: "100%",
              borderRadius: "12px",
              height: "50px",
              width: "100%",
              color: "primary.main",
              bgcolor: "primary.lighter",
              paddingTop: "8px",
              [theme.breakpoints.down("md")]: {
                mt: 2.5,
                height: "35px",
              },
            }}
          >
            Request A Callback
          </Button>
        </Box>
      </Box>
      {/* open request callback popup */}
      <RequestCallback id={id} open={open} phone={phone} setOpen={setOpen} />
    </>
  );
}
