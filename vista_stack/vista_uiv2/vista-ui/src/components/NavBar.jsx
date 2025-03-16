import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Popper,
  Paper,
  Button,
  ClickAwayListener,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import WifiIcon from "@mui/icons-material/Wifi";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function NavBar({ toggleDrawer, frontendConnect, backendConnect, setActiveTab }) {
  const navigate = useNavigate(); // ✅ Navigation Hook
  const [connectionType, setConnectionType] = useState("Connecting...");
  const [showNetworkInfo, setShowNetworkInfo] = useState(false);
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  useEffect(() => {
    setConnectionType(frontendConnect ? "Connected at Frontend" : backendConnect ? "Connected at Backend" : "Retrieving WiFi Info...");
  }, [frontendConnect, backendConnect]);

  // ✅ Handle WiFi Dropdown
  const handleWiFiClick = (event) => {
    setAnchorEl(event.currentTarget);
    setShowNetworkInfo((prev) => !prev);
  };

  const handleChangeWiFi = () => {
    setActiveTab("settings");
  };

  const handleClickAwayWiFi = () => {
    setShowNetworkInfo(false);
  };

  // ✅ Handle Profile Dropdown
  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
    setShowProfileInfo((prev) => !prev);
  };

  const handleClickAwayProfile = () => {
    setShowProfileInfo(false);
  };

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

        {/* Home Button (Routes to Home Page) */}
        <IconButton color="inherit" onClick={() => setActiveTab("home")}>
          <HomeIcon />
        </IconButton>

        {/* Profile Button */}
        <IconButton color="inherit" onClick={handleProfileClick}>
          <AccountCircleIcon />
        </IconButton>

        {/* Profile Popper */}
        <Popper open={showProfileInfo} anchorEl={profileAnchorEl} placement="bottom-end">
          <ClickAwayListener onClickAway={handleClickAwayProfile}>
            <Paper sx={{ p: 2, mt: 2, bgcolor: "background.paper", boxShadow: 3, borderRadius: 2, textAlign: "center" }}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {localStorage.getItem("username")}
              </Typography>
              <Button variant="contained" color="primary" size="small" onClick={() => setActiveTab("settings")}>
                Change User Settings
              </Button>
            </Paper>
          </ClickAwayListener>
        </Popper>

        {/* Clickable WiFi Icon & Dropdown Text */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, position: "relative" }}>
          <IconButton color="inherit" onClick={handleWiFiClick}>
            <WifiIcon color={connectionType.includes("Failed") ? "error" : "success"} />
          </IconButton>

          {/* WiFi Popper */}
          <Popper open={showNetworkInfo} anchorEl={anchorEl} placement="bottom-end">
            <ClickAwayListener onClickAway={handleClickAwayWiFi}>
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
