//SET OTHER DEVICE CONFIGURATIONS LIKE - MAX HUMIDITY, MOTION DETECTION, ETC 

import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Slider, ToggleButton, ToggleButtonGroup, Switch, FormControlLabel } from "@mui/material";
import { useDeviceAPI } from "../services/api"; // API function to update settings

export default function DeviceControls(){
    const [maxHumidity, setMaxHumidity] = useState(60);
    const [ventStatus, setVentStatus] = useState("closed");
    const [motionDetection, setMotionDetection] = useState(false);
    const [ecoMode, setEcoMode] = useState(false);
  
     const [ getDeviceData,
          checkDeviceStatus,
          checkFrontendStatus,
          updateDeviceSettings,
          updateVent] = useDeviceAPI();
  
    const handleUpdate = (key, value) => {
      updateDeviceSettings(key,value); // Send update to backend
    };
  
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3 }}>
        {/* Max Humidity Section */}
        <Card>
          <CardContent>
            <Typography variant="h6">🌫 Max Humidity</Typography>
            <Slider
              value={maxHumidity}
              onChange={(e, newValue) => {
                setMaxHumidity(newValue);
                handleUpdate("maxHumidity", newValue);
              }}
              min={30}
              max={80}
              step={1}
              valueLabelDisplay="auto"
            />
          </CardContent>
        </Card>
  
        {/* Vent Control Section */}
        <Card>
          <CardContent>
            <Typography variant="h6">🌬 Vent Control</Typography>
            <ToggleButtonGroup
              value={ventStatus}
              exclusive
              onChange={(e, newValue) => {
                if (newValue) {
                  setVentStatus(newValue);
                  handleUpdate("vent", newValue);
                }
              }}
            >
              <ToggleButton value="open">🔓 Open</ToggleButton>
              <ToggleButton value="closed">🔒 Close</ToggleButton>
            </ToggleButtonGroup>
          </CardContent>
        </Card>
  
        {/* Motion Detection Section */}
        <Card>
          <CardContent>
            <Typography variant="h6">🚶 Motion Detection</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={motionDetection}
                  onChange={(e) => {
                    setMotionDetection(e.target.checked);
                    handleUpdate("motionDetection", e.target.checked);
                  }}
                />
              }
              label="Enable Motion Detection"
            />
          </CardContent>
        </Card>
  
        {/* Eco Mode Section */}
        <Card>
          <CardContent>
            <Typography variant="h6">🍃 Eco Mode</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={ecoMode}
                  onChange={(e) => {
                    setEcoMode(e.target.checked);
                    handleUpdate("ecoMode", e.target.checked);
                  }}
                />
              }
              label="Enable Eco Mode"
            />
          </CardContent>
        </Card>
      </Box>
    );

   


}