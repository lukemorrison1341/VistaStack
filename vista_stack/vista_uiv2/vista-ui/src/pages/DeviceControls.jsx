//SET OTHER DEVICE CONFIGURATIONS LIKE - MAX HUMIDITY, MOTION DETECTION, ETC 

import React, { useState, useEffect, useContext } from "react";
import { Box, Card, CardContent, Typography, Slider, ToggleButton, ToggleButtonGroup, Switch, FormControlLabel } from "@mui/material";
import { updateDeviceSettings } from "../services/api"; // API function to update settings
import { DeviceContext } from "../components/DataContext";
export default function DeviceControls(){
  /*
    Initial Values
  */
    const {maxHumidity, setMaxHumidity, ventStatus, setVentStatus, motionDetection, setMotionDetection, deviceMode, setDeviceMode} = useContext(DeviceContext);
    const handleUpdate = (key, value) => {
      updateDeviceSettings(key,value); // Send update to backend
    };

    const [enableMotionDetection, setEnableMotionDetection] = useState(false);
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
                  checked={enableMotionDetection}
                  onChange={(e) => {
                    setEnableMotionDetection(e.target.checked);
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
                  checked={deviceMode === "eco mode"}
                  onChange={(e) => {
                    const newMode = e.target.checked ? "eco mode" : "vacant mode";
                    console.log(newMode);
                    setDeviceMode(newMode);
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