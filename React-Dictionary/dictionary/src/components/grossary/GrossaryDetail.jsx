import { Box, Typography } from "@mui/material";
import React from "react";
import Definitions from "./Definitions";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

const GrossaryDetail = ({ grossaryData }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ my: 3, display: "flex", gap: 2, justifyContent: "center" }}>
        <Typography variant="h6">{grossaryData.phonetic}</Typography>
        <VolumeUpIcon
          color="primary"
          sx={{ ":hover": { cursor: "pointer" } }}
        />
      </Box>
      <Definitions definitions={grossaryData} />
    </Box>
  );
};

export default GrossaryDetail;
