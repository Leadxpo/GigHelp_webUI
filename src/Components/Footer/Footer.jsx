import React from "react";
import { Box, Grid, Typography, Link, IconButton } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import HomeLogo from "../../Images/logo.jpg"; // Adjust the path as needed

const Footer = () => {
  return (
    <>
      {/* Top Footer Section */}
      <Box sx={{ backgroundColor: "#f8f9fa", p: 2, mt: 5 }}>
        <Grid container spacing={2}>
          {/* Left Section */}
          <Grid item xs={6} sm={4} md={2}>
            <img
              src={HomeLogo}
              alt="Logo"
              style={{ width: "100px", height: "auto", borderRadius: "10px" }}
            />
            <Box display="flex" alignItems="center" mt={2}>
              <IconButton color="primary">
                <LanguageIcon />
              </IconButton>
              <Typography fontWeight="bold">India / English</Typography>
            </Box>
            <Box display="flex" alignItems="center" mt={2}>
              <IconButton color="primary">
                <HelpOutlineIcon />
              </IconButton>
              <Typography fontWeight="bold">Help & Support</Typography>
            </Box>
            <Box display="flex" alignItems="center" mt={2}>
              <IconButton color="primary">
                <AccessibilityNewIcon />
              </IconButton>
              <Typography fontWeight="bold">Accessibility</Typography>
            </Box>
          </Grid>

          {/* Categories Section */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" color="primary" fontWeight="bold">
              Categories
            </Typography>
            {[
              "Projects",
              "Contests",
              "Freelancers",
              "Enterprise",
              "AI Development",
              "Membership",
              "Preferred",
              "Freelancer",
              "Program",
              "Project",
            ].map((item) => (
              <Typography key={item} mt={1}>
                <Link href="#" color="inherit" underline="hover">
                  {item}
                </Link>
              </Typography>
            ))}
          </Grid>

          {/* About Section */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" color="primary" fontWeight="bold">
              About
            </Typography>
            {[
              "About us",
              "How it Works",
              "Security",
              "Investor",
              "Sitemap",
              "Stories",
            ].map((item) => (
              <Typography key={item} mt={1}>
                <Link href="#" color="inherit" underline="hover">
                  {item}
                </Link>
              </Typography>
            ))}
          </Grid>

          {/* Terms Section */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" color="primary" fontWeight="bold">
              Terms
            </Typography>
            {[
              "Privacy Policy",
              "Terms and Conditions",
              "Copyright Policy",
              "Code of Conduct",
              "Fees and Charges",
            ].map((item) => (
              <Typography key={item} mt={1}>
                <Link href="#" color="inherit" underline="hover">
                  {item}
                </Link>
              </Typography>
            ))}
          </Grid>

          {/* Partners Section */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" color="primary" fontWeight="bold">
              Partners
            </Typography>
            {["Escrow.com", "Load Shift", "Warrior Forum"].map((item) => (
              <Typography key={item} mt={1}>
                <Link href="#" color="inherit" underline="hover">
                  {item}
                </Link>
              </Typography>
            ))}
          </Grid>

          {/* Apps Section */}
          <Grid item xs={6} sm={4} md={2} textAlign="center">
            <Typography variant="h6" color="primary" fontWeight="bold">
              Apps
            </Typography>
            <Box mt={2}>
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/016/290/534/small_2x/google-play-apple-store-logo-icon-button-free-vector.jpg"
                alt="App Store"
                style={{ width: "100%", maxWidth: "200px" }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Bottom Footer Section */}
      <Box sx={{ backgroundColor: "#1783c7", py: 4, px: 2, mt: 2 }}>
        <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h5" fontWeight="bold" color="white">
                78,598,389
              </Typography>
              <Typography variant="body1" fontWeight="bold" color="white">
                Registered Users
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h5" fontWeight="bold" color="white">
                24,412,271
              </Typography>
              <Typography variant="body1" fontWeight="bold" color="white">
                Jobs Successfully Posted
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" fontWeight="bold" color="white">
                GIGHELP connects people who need help with those who can earn
                by helping. Empowering work, one gig at a time.
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box mt={4} textAlign="center">
          <Typography
            variant="body2"
            sx={{ fontSize: "1.1rem", color: "white" }}
          >
            © {new Date().getFullYear()} GIGHELP — Help & Earn | Designed and
            Developed by{" "}
            <Typography
              component="span"
              sx={{ color: "#90EE90", ml: 1, fontWeight: 600 }}
            >
              LEADXPO IT SOLUTIONS
            </Typography>
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Footer;
