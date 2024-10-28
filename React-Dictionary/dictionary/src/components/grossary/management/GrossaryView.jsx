import { Box, Button, Typography } from "@mui/material";
import React from "react";
import GrossaryDetail from "../GrossaryDetail";

const GrossaryView = ({ grossaryDetail, setCurrentPage }) => {
  return (
    <Box sx={{position: "relative"}}>
      <Button onClick={() => setCurrentPage(0)} sx={{position: "absolute", right: 0}} variant="outlined">Quay lại</Button>
      <Typography textAlign={"center"} variant="h1">{grossaryDetail.wordText}</Typography>
      <GrossaryDetail grossaryData={grossaryDetail} />
    </Box>
  );
};

export default GrossaryView;
