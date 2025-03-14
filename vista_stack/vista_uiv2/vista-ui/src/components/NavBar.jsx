import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Popper, Paper, Button, ClickAwayListener } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import WifiIcon from "@mui/icons-material/Wifi";

export default function NavBar({ toggleDrawer, frontendConnect, backendConnect, setActiveTab }) {
  const [connectionType, setConnectionType] = useState("Connecting...");
  const [showNetworkInfo, setShowNetworkInfo] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    setConnectionType(frontendConnect ? "Connected at Frontend" : backendConnect ? "Connected at Backend" : "Retrieving WiFi Info...");
  }, [frontendConnect, backendConnect]);

  const handleWiFiClick = (event) => {
    setAnchorEl(event.currentTarget);
    setShowNetworkInfo((prev) => !prev);
  };

  const handleChangeWiFi = () => {
    setActiveTab("settings"); // ✅ Redirects to User Settings Page
  };

  const handleClickAway = () => {
    setShowNetworkInfo(false);
  }

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {/* Menu Icon Button */}
        <IconButton color="inherit" edge="start" onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton>

        {/* Welcome Message (Centered, Only Shown If Connected) */}
        <Box sx={{ flexGrow: 1, textAlign: "center" }}>
          {(frontendConnect || backendConnect) && (
            <Typography variant="h6">Welcome, {localStorage.getItem("deviceName")}!</Typography>
          )}
        </Box>

        {/* Clickable WiFi Icon & Dropdown Text */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, position: "relative" }}>
          <IconButton color="inherit" onClick={handleWiFiClick}>
            <WifiIcon color={connectionType.includes("Failed") ? "error" : "success"} />
          </IconButton>
          

          {/* Popper (Dropdown) for Network Info */}
          
          <Popper
            open={showNetworkInfo}
            anchorEl={anchorEl}
            placement="bottom-end"
            modifiers={[
              {
                name: "offset",
                options: {
                  offset: [0, 12], // Moves dropdown further down
                },
              },
            ]}
          >
            <ClickAwayListener onClickAway={handleClickAway}>
            <Paper sx={{ p: 2, mt: 2, bgcolor: "background.paper", boxShadow: 3, borderRadius: 2, textAlign: "center" }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {connectionType}
              </Typography>
              <Button variant="contained" color="primary" size="small" onClick={handleChangeWiFi}>
                Change WiFi Login
              </Button>
            </Paper>
            </ClickAwayListener>
          </Popper>
          
        </Box>
      </Toolbar>
    </AppBar>
  );
}
