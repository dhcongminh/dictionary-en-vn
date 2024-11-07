import { Box, Chip, Typography } from "@mui/material";
import React from "react";
import Definitions from "./Definitions";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
//import FavoriteIcon from "@mui/icons-material/Favorite";

const GrossaryDetail = ({ grossaryData, setIsLoading }) => {
  function handleAudioStart() {
    setIsLoading(true);
    const utterance = new SpeechSynthesisUtterance(grossaryData.wordText);
    window.speechSynthesis.speak(utterance);
    setTimeout(() => {
      setIsLoading(false);
    }, 2300);
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Box
        sx={{
          my: 3,
          display: "flex",
          gap: 2,
          justifyContent: "center",
        }}
      >
        <Typography variant="h6">{grossaryData.phonetic}</Typography>
        <Box onClick={handleAudioStart}>
          <VolumeUpIcon
            color="primary"
            sx={{ ":hover": { cursor: "pointer" } }}
          />
        </Box>
        {/* <Box
          sx={{
            position: "absolute",
            right: 0,
            border: 1,
            p: 1,
            borderRadius: 2,
            borderColor: "tomato",
            cursor: "pointer",
            ":hover" : {
              boxShadow: "0px 0px 10px tomato"
            }
          }}
        >
          <FavoriteIcon sx={{color: "red"}} />
          <span className="text-danger ms-1">{grossaryData.heartsCount}</span>
        </Box> */}
      </Box>
      <Box className="row" sx={{ width: { xs: 1, md: 500 }, borderTop: "1px solid rgba(0, 0, 0, .3)", pt: 1 }}>
        <Chip
          className="col-3"
          variant="outlined"
          color="success"
          label="Từ đồng nghĩa"
        />
        <Box className="col-9">
          {grossaryData.synonyms &&
            grossaryData.synonyms.map((s) => {
              return <Chip variant="outlined" color="default" label={s} />;
            })}
        </Box>
      </Box>
      <Box className="row" sx={{ width: { xs: 1, md: 500 }, my: 3, borderTop: "1px solid rgba(0, 0, 0, .3)", pt: 1 }}>
        <Chip
          className="col-3"
          variant="outlined"
          color="success"
          label="Từ trái nghĩa"
        />
        <Box className="col-9">
          {grossaryData.antonyms &&
            grossaryData.antonyms.map((s) => {
              return <Chip variant="outlined" color="default" label={s} />;
            })}
        </Box>
      </Box>
      <Definitions definitions={grossaryData} />
    </Box>
  );
};

export default GrossaryDetail;
