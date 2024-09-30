import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { useLocation, useNavigate } from "react-router";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

export const ResourceOpen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { url, id, resourceType } = location.state;
  const handleNavBackPage = () => {
    navigate(-1);
  };
  return (
    <>
      <Box
        sx={{ display: "flex", alignItems: "left", mb: 2, cursor: "pointer" }}
      >
        <KeyboardBackspaceIcon
          sx={{ color: "primary.main" }}
          onClick={handleNavBackPage}
        />
      </Box>
      {resourceType === "image" ? (
        <Card
          sx={{ height: "75vh", width: "100%", mt: 4, borderRadius: "20px" }}
        >
          <img
            src={url}
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
          ></img>
        </Card>
      ) : (
        <embed
          oncontextmenu="return false"
          src={url + "#toolbar=0"}
          type="application/pdf"
          height={1000}
          width={1000}
        />
      )}
    </>
  );
};
