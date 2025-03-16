import React, { useState, useContext } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import { DeviceContext } from "../components/DataContext";
import { motion } from "framer-motion";

export default function TemperatureControl() {
  const { temperature, setTemperature } = useContext(DeviceContext);
  const [shouldShake, setShouldShake] = useState(false);

  // Function to calculate smooth gradient color based on temperature
  function getTemperatureColor(temp) {
    if (temp <= 50) return "hsl(220, 100%, 45%)"; // Deep Blue (Cold)
    if (temp <= 60) return "hsl(200, 100%, 55%)"; // Brighter Cool Blue
    if (temp <= 70) return "hsl(160, 100%, 50%)"; // Vibrant Teal Green
    if (temp <= 80) return "hsl(35, 100%, 55%)";  // Brighter Warm Orange
    return "hsl(0, 100%, 50%)"; // Intense Red (Hot)
  }

  // Function to get the correct emoji based on temperature
  function getTemperatureIcon(temp) {
    if (temp >= 80) return "🔥"; // Fire for hot temps
    if (temp >= 70) return "☀️"; // Sun for warm
    if (temp >= 60) return "🌤️"; // Moderate weather icon
    return "🧊"; // Ice cube for cold
  }

  const increaseTemp = () => {
    if (temperature < 90) {
      setTemperature((prev) => prev + 1);
      setShouldShake(false);
    } else {
      triggerShake();
    }
  };

  const decreaseTemp = () => {
    if (temperature > 50) {
      setTemperature((prev) => prev - 1);
      setShouldShake(false);
    } else {
      triggerShake();
    }
  };

  const triggerShake = () => {
    setShouldShake(true);
    setTimeout(() => setShouldShake(false), 300);
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
        marginTop: "-50px", // Move everything up slightly
      }}
    >
      {/* Up Button (Bigger, Rounded Top) */}
      <IconButton
        onClick={increaseTemp}
        sx={{
          bgcolor: "#fff",
          borderRadius: "50%",
          width: 80, // Slightly smaller button
          height: 80,
          boxShadow: 4,
          ":hover": { bgcolor: "#f0f0f0" },
        }}
      >
        <ArrowUpwardRoundedIcon fontSize="large" />
      </IconButton>

      {/* Temperature Display (Bigger, High Contrast) */}
      <motion.div
        animate={{ backgroundColor: getTemperatureColor(temperature) }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{
          width: 250, // Reduced from 300px
          height: 250,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          boxShadow: "0 6px 20px rgba(0,0,0,0.4)", // Stronger shadow for contrast
        }}
      >
        {/* Emoji Icon (Slightly Smaller, Still Visible) */}
        <Typography
          sx={{
            position: "absolute",
            fontSize: "4.5rem", // Reduced from 6rem
            opacity: 0.4, // More visible backdrop effect
          }}
        >
          {getTemperatureIcon(temperature)}
        </Typography>

        {/* Temperature Text (Smaller, Still Bold) */}
        <motion.div
          animate={shouldShake ? { x: [-8, 8, -8, 8, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Typography variant="h2" sx={{ color: "#fff", fontWeight: "bold" }}>
            {temperature}°F
          </Typography>
        </motion.div>
      </motion.div>

      {/* Down Button (Slightly Smaller, Rounded Bottom) */}
      <IconButton
        onClick={decreaseTemp}
        sx={{
          bgcolor: "#fff",
          borderRadius: "50%",
          width: 80, // Smaller button
          height: 80,
          boxShadow: 4,
          ":hover": { bgcolor: "#f0f0f0" },
        }}
      >
        <ArrowDownwardRoundedIcon fontSize="large" />
      </IconButton>
    </Box>
  );
}
