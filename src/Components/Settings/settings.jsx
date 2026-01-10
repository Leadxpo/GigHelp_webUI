import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Footer from "../../Components/Footer/Footer";

const SettingsPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    // Rename oldPassword to password
    const payload = { password: oldPassword, newPassword };

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3001/user/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert("Password changed successfully");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error changing password");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while changing password");
    }
  };

  return (
    <>
      <Box
        sx={{
          mt: { xs: 5, sm: 8, md: 10 },
          px: { xs: 2, sm: 3 },
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          fontSize={{ xs: "1.8rem", sm: "2.2rem", md: "2.5rem" }}
        >
          Settings
        </Typography>

        <Card
          elevation={3}
          sx={{
            maxWidth: "1000px",
            mx: "auto",
            mt: 4,
            borderRadius: 3,
            p: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <CardContent>
            <List>
              {/* User Info */}
              <ListItem
                sx={{
                  mb: 2,
                  // flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 56 }}>
                  <VpnKeyIcon fontSize="large" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography fontWeight="bold">Password</Typography>}
                  secondary={<Typography>****************</Typography>}
                />
                <IconButton edge="end" sx={{ mt: { xs: 1, sm: 0 } }}>
                  <ChevronRightIcon />
                </IconButton>
              </ListItem>

              {/* Old Password */}
              <ListItem sx={{ mb: 2 }}>
                <TextField
                  label="Old Password"
                  type={showOldPassword ? "text" : "password"}
                  fullWidth
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    ),
                  }}
                />
              </ListItem>

              {/* New Password */}
              <ListItem sx={{ mb: 2 }}>
                <TextField
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    ),
                  }}
                />
              </ListItem>

              {/* Confirm New Password */}
              <ListItem sx={{ mb: 2 }}>
                <TextField
                  label="Confirm New Password"
                  type={showConfirmPassword ? "text" : "password"}
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    ),
                  }}
                />
              </ListItem>

              {/* Submit Button */}
              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePasswordChange}
                >
                  Change Password
                </Button>
              </Box>
            </List>
          </CardContent>
        </Card>
      </Box>

      <Box mt={5}>
        <Footer />
      </Box>
    </>
  );
};

export default SettingsPage;
