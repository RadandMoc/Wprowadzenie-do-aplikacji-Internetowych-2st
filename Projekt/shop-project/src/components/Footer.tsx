import React from "react";
import { Box, Typography } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box sx={{ textAlign: "center", py: 2, bgcolor: "#f5f5f5" }}>
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} My Shop. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
