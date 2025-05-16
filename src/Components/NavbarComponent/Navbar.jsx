import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  InputBase,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import Logo from "../../Images/logo.jpg";
const Navbar = ({ toggleSidebar, hideMenuIcon }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState(null); // For profile menu

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserData(user);
  }, []);

  console.log("==========image", userData);

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate("/dashboard/profile"); // Change to your profile page route
  };

  const handleLogout = () => {
    handleMenuClose();
    localStorage.clear(); // Clear local storage
    navigate("/"); // Navigate to login page
  };

  const navItems = [
    { label: "Home", path: "/dashboard/home" },
    { label: "Add Task", path: "/dashboard/add-task" },
    { label: "My Task", path: "/dashboard/my-tasks" },
    { label: "My Bids", path: "/dashboard/my-bids" },
    { label: "Filter", path: "/dashboard/filters" },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#fff",
          color: "#000",
          height: 100,
          boxShadow: "none",
          borderBottom: "2px solid #e0e0e0",
          zIndex: 1300,
          width: hideMenuIcon ? "calc(100% - 260px)" : "100%",
          transition: "width 0.3s",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
          }}
        >
          {/* Left Side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={toggleSidebar} sx={{ fontSize: "3rem" }}>
              <MenuIcon fontSize="inherit" />
            </IconButton>
            <img
              src={Logo}
              alt="Logo"
              style={{ width: "120px", height: "60px" }}
            />
          </Box>

          {/* Center Search Bar */}
          {!isMobile && (
            <Box
              sx={{
                backgroundColor: "#f1f1f1",
                borderRadius: "5px",
                px: 2,
                py: 1,
                display: "flex",
                alignItems: "center",
                width: "15%",
              }}
            >
              <SearchIcon sx={{ mr: 1 }} />
              <InputBase placeholder="Search..." fullWidth />
            </Box>
          )}

          {/* Right Side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
            {!isMobile ? (
              <>
                {navItems.map((item) => (
                  <Typography
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      color:
                        location.pathname === item.path ? "#1B88CA" : "black",
                      fontSize: "1rem",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {item.label}
                  </Typography>
                ))}
              </>
            ) : (
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                sx={{ fontSize: "2.5rem" }}
              >
                <MenuIcon fontSize="inherit" />
              </IconButton>
            )}

            <IconButton
              color="inherit"
              onClick={() => handleNavigation("/dashboard/notification")}
            >
              <Badge badgeContent={4} color="error">
                <NotificationsIcon sx={{ fontSize: "2rem" }} />
              </Badge>
            </IconButton>

            {/* Profile Avatar with Menu */}
            <Box>
              <IconButton onClick={handleProfileClick}>
                <Avatar
                  alt="Profile"
                  src={
                    userData?.profilePic
                      ? `http://localhost:3001/storege/userdp/${userData.profilePic}`
                      : ""
                  }
                  sx={{ width: 50, height: 50 }}
                />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250 }}>
          <List>
            {navItems.map((item) => (
              <ListItem
                button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight:
                      location.pathname === item.path ? "bold" : "normal",
                    color:
                      location.pathname === item.path ? "#1B88CA" : "black",
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
