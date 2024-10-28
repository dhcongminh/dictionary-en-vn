import {
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";

const Definition = ({ definition, index }) => {
  useEffect(() => {

  }, []);
  return (
    <>
      <Divider>Nghĩa {index}</Divider>
      <Box sx={{ mt: 3 }}>
        <Chip label={definition.type} color="success" />
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 3 }}>
          <Typography variant="h6">Giải nghĩa: </Typography>
          <Typography>{definition.definitions.detail}</Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Ví dụ: </Typography>

          <List sx={{ width: "100%", maxWidth: 360 }}>
            {definition.definitions.examples.map((example, index) => (
              <ListItem key={index}>
                <ListItemText primary={example.split("@dhcongminh@").length > 0
                                        ? example.split("@dhcongminh@")[0]
                                        : example} secondary={example.split("@dhcongminh@").length > 0
                                          ? example.split("@dhcongminh@")[1]
                                          : ""} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </>
  );
};

export default Definition;
