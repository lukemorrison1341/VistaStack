import React from 'react';
import {useState} from 'react';
import { useNavigate } from "react-router";
import { Container, Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';


import { loginUser } from '../services/api';

export default function SignInPage() {

  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');


  const navigate = useNavigate();

 

  const handleSubmit = async (event) => { ///TODO: Change console.logs 
    event.preventDefault();
    
    try {
      // Ensure username & password are correctly extracted as strings
      console.log("USERNAME " + username + "PASSWORD: " + password);
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      
      if (!trimmedUsername || !trimmedPassword) {
        console.log("Username and password cannot be empty.");
        return;
      }
      
      const data = await loginUser(trimmedUsername, trimmedPassword); // API Call
  
      if (data.status === 'success') {
        localStorage.setItem('username', trimmedUsername);
        localStorage.setItem('userIP', data.ip);
        localStorage.setItem('deviceName', data.device_name);
  
        navigate('/dashboard');
      } else {
        setErrorMessage('Invalid username or password.');
      }
    } catch (error) {
      console.log('Login failed. Please try again.');
    }
  };

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
              onChange={ (e) => setUsername(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              onClick={ (e) => handleSubmit(e)} 
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
