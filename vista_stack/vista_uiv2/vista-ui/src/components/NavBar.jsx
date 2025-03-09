import React from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function NavBar({ toggleDrawer }) {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        
        <IconButton color="inherit" edge="start" onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6">
          VISTA Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
