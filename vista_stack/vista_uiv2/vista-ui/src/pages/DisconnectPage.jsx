import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

export default function DisconnectPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        bgcolor: "#f0f0f0", // Light gray background
        p: 3,
      }}
    >
      <CircularProgress size={60} sx={{ mb: 2 }} /> {/* Large spinner */}
      <Typography variant="h5" sx={{ color: "gray" }}>
        Connecting...
      </Typography>
    </Box>
  );
}
