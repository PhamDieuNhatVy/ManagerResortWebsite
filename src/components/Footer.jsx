import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      sx={{ 
        bgcolor: 'primary.main', // Đặt màu nền xanh
        p: 2,
        width: '100%',
      }}
    >
      <Typography variant="body2" align="center" color="white">
        © 2024 Mrs. Hang Farm. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
