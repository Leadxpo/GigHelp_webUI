import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import {
  Home as HomeIcon,
  Task as TaskIcon,
  ListAlt as ListAltIcon,
  Gavel as GavelIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Payment as PaymentIcon,
  HelpOutline as HelpIcon,
  ChevronRight as RightArrowIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import DescriptionIcon from '@mui/icons-material/Description';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/home" },
    { text: "Add Task", icon: <TaskIcon />, path: "/add-task" },
    { text: "All Tasks", icon: <ListAltIcon />, path: "/all-tasks" },
    { text: "My Bids", icon: <GavelIcon />, path: "/my-bids" },
    { text: "Profile", icon: <PersonIcon />, path: "/profile" },
    { text: "App Settings", icon: <SettingsIcon />, path: "/app-settings" },
    { text: "Transactions", icon: <PaymentIcon />, path: "/transactions" },
    { text: "Terms & Conditions", icon: <DescriptionIcon   />, path: "//terms-conditions" },
    { text: "Help & Support", icon: <HelpIcon />, path: "/help-support" },
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // handleMenuClose();
    localStorage.clear();
    navigate("/"); 
  };

  return (
    <Box
      sx={{
        width: 260,
        height: "90vh",
        backgroundColor: "#fff",
        boxShadow: "5px 0 10px rgba(44, 13, 156, 0.1)",
        borderRight: "3px solid rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", 
      }}
    >
      <Box>
        <Box sx={{ p: 2, textAlign: "center", display: "flex", alignItems: "center" }}>
          <Avatar src="/path/to/profile.jpg" sx={{ width: 50, height: 48, mr: 2 }} />
          <Typography fontWeight="bold" fontSize="16px">Ayaan</Typography>
        </Box>

        <Divider sx={{ borderBottomWidth: 2, height:20}} /> 

        <List sx={{ gap: 2, display: "flex", flexDirection: "column", mt: 2 }}>
          {menuItems.map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={() => handleNavigate(item.path)}
              sx={{
                py: 1.5,
                backgroundColor: location.pathname === item.path ? "#1B88CA" : "transparent",
                color: location.pathname === item.path ? "white" : "black",
                borderRadius: "5px",
                "&:hover": {
                  backgroundColor: "#5AAFE6",
                  color: "white",
                },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? "white" : "black" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ fontWeight: "bold" }} />
              <RightArrowIcon sx={{ color: location.pathname === item.path ? "white" : "black" }} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          color="error"
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ textTransform: "none", fontWeight: "bold" }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
