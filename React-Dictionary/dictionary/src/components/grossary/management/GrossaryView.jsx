import { Box, Button, Typography } from "@mui/material";
import React, { useEffect } from "react";
import GrossaryDetail from "../GrossaryDetail";
import Authentication from "../../../others/Authentication";
import { useNavigate } from "react-router-dom";

const GrossaryView = ({ grossaryDetail, setCurrentPage }) => {
  const nav = useNavigate();
  useEffect(() => {

    if (!Authentication.isValid()) {
      nav("/");
      window.location.reload();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Box sx={{position: "relative"}}>
      <Button onClick={() => setCurrentPage(0)} sx={{position: "absolute", right: 0}} variant="outlined">Quay lại</Button>
      <Typography textAlign={"center"} variant="h1">{grossaryDetail.wordText}</Typography>
      <GrossaryDetail grossaryData={grossaryDetail} />
    </Box>
  );
};

export default GrossaryView;
