import React, { useState, useContext } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import { DeviceContext } from "../components/DataContext";
export default function TemperatureControl() {
  const {temperature, setTemperature} = useContext(DeviceContext);

  const increaseTemp = () => setTemperature((prev) => Math.min(prev + 1, 90)); // Max temp 90°F
  const decreaseTemp = () => setTemperature((prev) => Math.max(prev - 1, 50)); // Min temp 50°F

  // Background color changes based on temperature
  const getTemperatureColor = () => {
    if (temperature < 65) return "#00AEEF"; // Cold (Blue)
    if (temperature > 80) return "#FF4500"; // Hot (Red)
    return "#FFD700"; // Neutral (Yellow)
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 2,
      }}
    >
      {/* Up Button (Rounded Top) */}
      <IconButton
        onClick={increaseTemp}
        sx={{
          bgcolor: "#fff",
          borderRadius: "50%",
          width: 70,
          height: 70,
          position: "relative",
          top: 20,
          boxShadow: 3,
          ":hover": { bgcolor: "#f0f0f0" },
        }}
      >
        <ArrowUpwardRoundedIcon fontSize="large" />
      </IconButton>

      {/* Temperature Display (Big Circle) */}
      <Box
        sx={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          backgroundColor: getTemperatureColor(),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        <Typography variant="h3" sx={{ color: "#fff", fontWeight: "bold" }}>
          {temperature}°F
        </Typography>
      </Box>

      {/* Down Button (Rounded Bottom) */}
      <IconButton
        onClick={decreaseTemp}
        sx={{
          bgcolor: "#fff",
          borderRadius: "50%",
          width: 70,
          height: 70,
          position: "relative",
          bottom: 20,
          boxShadow: 3,
          ":hover": { bgcolor: "#f0f0f0" },
        }}
      >
        <ArrowDownwardRoundedIcon fontSize="large" />
      </IconButton>
    </Box>
  );
}
