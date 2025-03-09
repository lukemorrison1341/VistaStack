import React from 'react';
import { 
  Box, Button, Typography, Card, CardContent, CardActions, 
  TextField, Container, Paper, Switch, Checkbox, FormControlLabel, Slider, AppBar, Toolbar 
} from '@mui/material';

export default function uiTestPage() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">

        {/* App Bar (Header) */}
        <AppBar position="static" sx={{ mb: 4 }}>
          <Toolbar>
            <Typography variant="h6">VISTA AppBar</Typography>
          </Toolbar>
        </AppBar>

        {/* Typography examples */}
        <Typography variant="h1" gutterBottom>H1 Heading</Typography>
        <Typography variant="h3" gutterBottom>H3 Heading</Typography>
        <Typography variant="h5" gutterBottom color="primary">Primary H5 Heading</Typography>
        <Typography variant="body1" gutterBottom>This is Body1 Text</Typography>
        <Typography variant="body2" color="secondary">Secondary Body2 Text</Typography>

        {/* Buttons */}
        <Box sx={{ my: 2 }}>
          <Button variant="contained" color="primary" sx={{ mr: 1 }}>Primary</Button>
          <Button variant="outlined" color="secondary" sx={{ mr: 1 }}>Secondary</Button>
          <Button variant="contained" color="error">Error</Button>
        </Box>

        {/* Cards */}
        <Card sx={{ my: 2 }}>
          <CardContent>
            <Typography variant="h5">Card Title</Typography>
            <Typography variant="body2">This is card content text. It shows theme colors and typography.</Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Action 1</Button>
            <Button size="small">Action 2</Button>
          </CardActions>
        </Card>

        {/* Paper */}
        <Paper elevation={3} sx={{ p: 2, my: 2 }}>
          <Typography>Paper Component with elevation (shadow).</Typography>
          
        </Paper>

        {/* Form elements */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
          <TextField label="Outlined Input" variant="outlined" />
          <TextField label="Filled Input" variant="filled" />
          <TextField label="Standard Input" variant="standard" />
        </Box>

        {/* Checkboxes and Switches */}
        <FormControlLabel control={<Checkbox defaultChecked />} label="Checkbox Example" />
        <FormControlLabel control={<Switch defaultChecked />} label="Switch Example" />

        {/* Slider */}
        <Box sx={{ width: 300, my: 4 }}>
          <Typography gutterBottom>Slider Example</Typography>
          <Slider defaultValue={30} aria-label="Example slider" valueLabelDisplay="auto" />
        </Box>

      </Container>
    </Box>
  );
}
