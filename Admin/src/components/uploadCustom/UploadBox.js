import { useDropzone } from "react-dropzone";
import { styled, alpha } from "@mui/material/styles";
import { Typography } from "@material-ui/core";
import Iconify from "components/iconify/Iconify";

const StyledDropZone = styled("div")(({ theme }) => ({
  width: 64,
  height: 64,
  fontSize: 24,
  display: "flex",
  flexShrink: 0,
  cursor: "pointer",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.disabled,
  borderRadius: theme.shape.borderRadius,
  border: `dashed 1px ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.grey[500], 0.08),
  "&:hover": {
    opacity: 0.72,
  },
  marginRight: theme.spacing(2),
}));

const StyledComponent = styled("div")(({ theme }) => ({
  width: "100%",
  height: 64,
  fontSize: 24,
  display: "flex",
  cursor: "pointer",
  alignItems: "center",
  margin: theme.spacing(0),
  color: theme.palette.text.disabled,
  borderRadius: theme.shape.borderRadius,
  border: `dashed 1px ${theme.palette.divider}`,
  "&:hover": {
    opacity: 0.72,
  },
}));

export default function UploadBox({
  placeholder,
  error,
  disabled,
  sx,
  file,
  ...other
}) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      disabled,
      ...other,
    });

  const isError = isDragReject || !!error;
  const imgUrl = typeof file === "string" ? file : file.preview;

  return (
    <StyledComponent {...getRootProps()}>
      <StyledDropZone
        sx={{
          ...(isDragActive && {
            opacity: 0.72,
          }),
          ...(isError && {
            color: "error.main",
            bgcolor: "error.lighter",
            borderColor: "error.light",
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: "none",
          }),
          ...sx,
        }}
      >
        <input {...getInputProps()} />
        {Boolean(file.preview) ? (
          <img
            src={imgUrl}
            width="100%"
            height="100%"
            style={{
              objectFit: "cover",
            }}
          />
        ) : (
          <Iconify icon="eva:cloud-upload-fill" width={28} />
        )}
      </StyledDropZone>
      <Typography variant="body1" component="p">
        {Boolean(file.preview) ? file.name : "Upload Files"}
      </Typography>
    </StyledComponent>
  );
}
