import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 2, mt: 4 }}>
      <Typography variant="body2" align="center">
        © 2024 Mrs. Hang Farm. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
