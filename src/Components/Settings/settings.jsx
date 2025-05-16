import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, IconButton, TextField, Button } from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Footer from "../../Components/Footer/Footer";


const SettingsPage = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match!');
      return;
    }
  
    // Rename oldPassword to password
    const payload = { password: oldPassword, newPassword };
  
    try {
      const token = localStorage.getItem('token');
  
      const response = await fetch('http://localhost:3001/user/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        alert('Password changed successfully');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error changing password');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while changing password');
    }
  };
  

  return (
    <>
    <Box sx={{ textAlign: 'center', mt: 15 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Settings
      </Typography>

      <Card elevation={3} sx={{ maxWidth: 1000, mx: 'auto', borderRadius: 3, mt: 4 }}>
        <CardContent>
          <List>
            {/* User Info Section */}
            <ListItem sx={{ mb: 2 }}>
              <ListItemIcon sx={{ minWidth: 56 }}>
                <VpnKeyIcon fontSize="large" color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography fontWeight="bold">Password</Typography>}
                secondary={<Typography>****************</Typography>}
              />
              <IconButton edge="end">
                <ChevronRightIcon />
              </IconButton>
            </ListItem>

            {/* Change Password Form */}
            <ListItem sx={{ mb: 2 }}>
              <TextField
                label="Old Password"
                type={showOldPassword ? 'text' : 'password'}
                fullWidth
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowOldPassword(!showOldPassword)}>
                      {showOldPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
              />
            </ListItem>

            <ListItem sx={{ mb: 2 }}>
              <TextField
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                      {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
              />
            </ListItem>

            <ListItem sx={{ mb: 2 }}>
              <TextField
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
              />
            </ListItem>

            {/* Submit Button */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button variant="contained" color="primary" onClick={handlePasswordChange}>
                Change Password
              </Button>
            </Box>
          </List>
        </CardContent>
      </Card>


    </Box>
       <div>
        <Footer />
      </div> 
      </>
  );
};

export default SettingsPage;
