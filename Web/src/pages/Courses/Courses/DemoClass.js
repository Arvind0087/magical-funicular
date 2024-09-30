import React from "react";
import {
  FormControl,
  Grid,
  TextField,
  Container,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import VideoPlayer from "../../../components/Player/VideoPlayer";
import { LazyLoadImage } from "react-lazy-load-image-component";

function DemoClass({ getCoursePackageById }) {
  return (
    <>
      {getCoursePackageById && getCoursePackageById?.demoVideo?.length > 0 && (
        <Typography variant="h5" sx={{ mt: 3, mb: 3 }}>
          Watch our demo class
        </Typography>
      )}

      {getCoursePackageById && getCoursePackageById?.demoVideo?.length > 0 ? (
        getCoursePackageById?.demoVideo[0]?.original_url ? (
          <Box
            sx={{
              width: "90%",
              height: { xs: "auto", sm: "350px" },
              mt: 3,
              mb: 3,
              borderRadius: "16px",
            }}
          >
            <VideoPlayer
              src={getCoursePackageById?.demoVideo[0]?.original_url}
              videoProvider="youtube"
            />
          </Box>
        ) : (
          <Box sx={{ width: "90%", height: "300px", mt: 3 }}>
            <LazyLoadImage
              alt="Course list"
              effect="blur"
              src={getCoursePackageById?.demoVideo[0]?.thumbnail}
              width="100%"
              height="100%"
              objectFit="cover"
              style={{ borderRadius: "16px" }}
            />
          </Box>
        )
      ) : (
        ""
      )}
    </>
  );
}

export default DemoClass;
