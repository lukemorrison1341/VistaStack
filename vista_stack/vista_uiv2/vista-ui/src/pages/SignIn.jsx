import React from 'react';
import { useNavigate } from "react-router";
import { Container, Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';


import { loginUser } from '../services/api';

export default function SignInPage() {
  const navigator = useNavigate();
  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh'}}
    >
      <Card sx={{ display: 'flex', width: '100%', boxShadow: 3 }}>
        
        <CardContent sx={{ flex: 1, p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Sign In
          </Typography>
          <Box component="form" noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              onClick={ () => navigator("/dashboard")}
            >
              Login
            </Button>
          </Box>
        </CardContent>

        {/* Right Side: Image */}
        <Box
          sx={{
            flex: 1,
            backgroundImage: 'url(https://source.unsplash.com/random?technology)', //CHANGE THIS
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </Card>
    </Container>
  );
}
