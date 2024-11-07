import React, { useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const Flashcard = ({ frontText, backText }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <Box
      onClick={handleFlip}
      sx={{
        perspective: "1000px",
        cursor: "pointer",
        width: "250px",
        height: "150px",
        margin: "20px auto",
      }}
    >
      <Card
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.2s",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          perspective: 1000, 
          userSelect: 'none'
        }}
      >
        <CardContent
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: isFlipped ? 'rotateY(180deg)' : "",
            bgcolor: isFlipped ? 'rgba(0,0,0,.1)' : "rgba(0,0,0,.01)"
          }}
        >
          <Typography variant="h6">{isFlipped ? backText : frontText}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Flashcard;
