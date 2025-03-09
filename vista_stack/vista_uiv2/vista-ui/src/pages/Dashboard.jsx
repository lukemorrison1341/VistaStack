import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemText, Box } from '@mui/material';
import NavBar from '../components/NavBar'; // Import NavBar
import DeviceControls from './DeviceControls';
import UserSettings from './UserSettings';
import TemperatureControl from './TemperatureControl';
const drawerWidth = 240;

export default function Dashboard() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('devices');

  const renderContent = () => {
    switch (activeTab) {
      case 'devices':
        return <DeviceControls />;
      case 'settings':
        return <UserSettings />;
      case 'temperature':
        return <TemperatureControl />;
      default:
        return <DeviceControls />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Use NavBar and Pass Toggle Function */}
      <NavBar toggleDrawer={() => setIsDrawerOpen(true)} />

      {/* Left Drawer (Hidden by Default, Opens on Button Click) */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            bgcolor: 'primary.main',
            color: 'white',
          },
        }}
      >
        <List sx={{ mt: 8 }}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => { setActiveTab('devices'); setIsDrawerOpen(false); }}>
              <ListItemText primary="Device Configuration" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => { setActiveTab('settings'); setIsDrawerOpen(false); }}>
              <ListItemText primary="User Settings" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => { setActiveTab('temperature'); setIsDrawerOpen(false); }}>
              <ListItemText primary="Temperature Control" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {renderContent()}
      </Box>
    </Box>
  );
}
