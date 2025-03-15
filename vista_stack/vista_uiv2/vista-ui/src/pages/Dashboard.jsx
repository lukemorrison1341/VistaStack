import React, { useEffect, useContext, useState } from "react";
import { Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Box } from "@mui/material";
import NavBar from "../components/NavBar"; // Import NavBar
import ColorSplashEffect from "../components/ColorSplashEffect";
import DeviceControls from "./DeviceControls";
import UserSettings from "./UserSettings";
import TemperatureControl from "./TemperatureControl";
import DeviceStatusModal from "../components/DeviceStatusModal";
import DisconnectPage from "./DisconnectPage";
import AboutPage from "./AboutPage";
import HomePage from "./HomePage";
import SettingsIcon from "@mui/icons-material/Settings";
import DevicesIcon from "@mui/icons-material/Devices";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import { ConnectionContext } from "../components/ConnectionContext";
const drawerWidth = 240;

export default function Dashboard() {
  const { frontendConnect, backendConnect, deviceConnected, setFrontendConnect, setBackendConnect, setDeviceConnected } = useContext(ConnectionContext); // 
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("devices");

  useEffect(() => {
    setDeviceConnected(backendConnect || frontendConnect);
  }, [backendConnect, frontendConnect]);

  const renderContent = () => {
    switch (activeTab) {
      case "devices":
        if(deviceConnected) {
          return <DeviceControls />;
        }
        else return <DisconnectPage/>
      case "settings":
        return <UserSettings />;
      case "temperature":
        if(deviceConnected) {
          return <TemperatureControl />;
        }
        else return <DisconnectPage/>
      case "home":
        if(deviceConnected) {
          return <HomePage />;
        }
          else return <DisconnectPage/>
      case "about":
        return <AboutPage/>
      default:
        if(deviceConnected) {
          return <DeviceControls />;
        }
        else return <DisconnectPage/>
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <ColorSplashEffect trigger={deviceConnected} />
      {/* Use NavBar and Pass Toggle Function */}
      <NavBar toggleDrawer={() => setIsDrawerOpen(true)} frontendConnect={frontendConnect} backendConnect={backendConnect} setActiveTab={setActiveTab}/>

      {/* Left Drawer (Hidden by Default, Opens on Button Click) */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            bgcolor: "primary.main",
            color: "white",
          },
        }}
      >

        <List sx={{ mt: 8 }}>
          
        <ListItem disablePadding>
            <ListItemButton onClick={() => { setActiveTab("home"); setIsDrawerOpen(false); }}>
              <ListItemIcon>
                <HomeIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Home Page" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => { setActiveTab("devices"); setIsDrawerOpen(false);}}>
              <ListItemIcon>
                <DevicesIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Device Configuration" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => { setActiveTab("settings"); setIsDrawerOpen(false); }}>
              <ListItemIcon>
                <SettingsIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="User Settings" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => { setActiveTab("temperature"); setIsDrawerOpen(false); }}>
              <ListItemIcon>
                <ThermostatIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Temperature Control" />
            </ListItemButton>
          </ListItem>
        </List>

        
        {/* About - Pushed to Bottom */}
<Box sx={{ mt: "auto" }}>
  <ListItem disablePadding>
    <ListItemButton onClick={() => { setActiveTab("about"); setIsDrawerOpen(false); }}>
      <ListItemIcon><InfoIcon sx={{ color: "white" }} /></ListItemIcon>
      <ListItemText primary="About" />
    </ListItemButton>
  </ListItem>
</Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {renderContent()}
      </Box>

      {!deviceConnected && <DeviceStatusModal username={localStorage.username} setDeviceConnected={setDeviceConnected} setFrontendConnect={setFrontendConnect} setBackendConnect={setBackendConnect} />}
    </Box>
  );
}
