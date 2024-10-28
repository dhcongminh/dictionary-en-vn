import React, { useEffect } from "react";
import Definition from "./Definition";
import { Box } from "@mui/material";

const Definitions = ({ definitions }) => {
  useEffect(() => {

  }, []);
  return (
    <Box sx={{  width: {xs: 1, md: 500} }}>
      {definitions && definitions.wordDefinitions.map((definition, index) => (
        <Definition key={index} definition={definition} index={index+1} />
      ))}
    </Box>
  );
};

export default Definitions;
