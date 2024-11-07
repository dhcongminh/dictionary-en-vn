import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

function Footer() {
  return (
    <Box sx={{ position: 'fixed', bottom: 0, width: '100%' }}>
      <AppBar position="static" sx={{zIndex: "10", bgcolor: "#fff"}}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Typography variant="body2" color="grey">
            © 2024 FPT University. All rights reserved.
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Footer;
