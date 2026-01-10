import { useState } from "react";
import {
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginImage from "../../Images/laginpageImage.jpg";
import Logo from "../../Images/logo.jpg";

const PhoneNumberLoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      {/* Left Side - Login Form */}
      <Grid item xs={12} sm={7} md={6} component={Paper} elevation={0} square>
        <Box
          sx={{
            my: isMobile ? 4 : 8,
            mx: isMobile ? 3 : 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <img
            src={Logo}
            alt="Logo"
            style={{
              width: isMobile ? "120px" : "150px",
              marginBottom: "20px",
            }}
          />
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
            Welcome Back!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Enter to unlimited access to data & information
          </Typography>

          <TextField
            fullWidth
            label="Phone Number"
            variant="outlined"
            sx={{ mb: 2 }}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mb: 2, textTransform: "none" }}
            onClick={() => navigate("/otp-login")}
          >
            Get OTP
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center", mt: 6, width: "100%" }}>
            Create New Account?{" "}
            <span
              style={{ color: "#007bff", cursor: "pointer" }}
              onClick={() => navigate("/register-form")}
            >
              Sign up
            </span>
          </Typography>
        </Box>
      </Grid>

      {/* Right Side - Background Image (Hidden on Mobile) */}
      {!isMobile && (
        <Grid item xs={false} sm={5} md={6} sx={{ p: 2, mt: 3 }}>
          <Box
            sx={{
              backgroundImage: `url(${LoginImage})`,
              backgroundRepeat: "no-repeat",
              backgroundColor: "#f5f5f5",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "50px",
              height: "95%",
              width: "85%",
              margin: "0 auto",
            }}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default PhoneNumberLoginPage;








// import { useState } from "react";
// import { Button, Typography, Box, Grid, Paper, TextField } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import LoginImage from "../../Images/laginpageImage.jpg";
// import Logo from "../../Images/logo.jpg";

// const PhoneNumberLoginPage = () => {
//   const [phoneNumber, setphoneNumber] = useState(""); // Added password state
//   const navigate = useNavigate();

//   // const handleLogin = () => {
//   //   console.log("Logging in with:", {  phoneNumber });
//   //   // Add login logic here
//   // };

//   return (
//     <Grid
//       container
//       component="main"
//       sx={{ height: "100vh", boxShadow: "none" }}
//     >
//       {/* Left Side - Login Form */}
//       <Grid item xs={12} sm={8} md={6} component={Paper} elevation={0} square>
//         <Box
//           sx={{
//             my: 8,
//             mx: 15,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "flex-start",
//           }}
//         >
//           <img
//             src={Logo}
//             alt="Logo"
//             style={{ width: "150px", marginBottom: "20px" }}
//           />
//           <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
//             Welcome Back!
//           </Typography>
//           <Typography variant="body1" sx={{ mb: 3 }}>
//             Enter to unlimited access to date & information{" "}
//           </Typography>

//           {/* Email Field */}
//           <TextField
//             fullWidth
//             label="Phone Number"
//             variant="outlined"
//             sx={{ mb: 2 }}
//             value={phoneNumber}
//             onChange={(e) => setphoneNumber(e.target.value)}
//           />

//           {/* Login Button */}
//           <Button
//             fullWidth
//             variant="contained"
//             color="primary"
//             sx={{ mb: 2 }}
//             onClick={() => navigate("/otp-login")}
//           >
//             Get OTP
//           </Button>

//           <Typography variant="body2" sx={{ textAlign: "center", mt: 6 }}>
//             Create New Account?{" "}
//             <span
//               style={{ color: "#007bff", cursor: "pointer" }}
//               onClick={() => navigate("/register-form")}
//             >
//               Sign up
//             </span>
//           </Typography>
//         </Box>
//       </Grid>

//       {/* Right Side - Background Image */}
//       <Grid item xs={false} sm={4} md={6} sx={{ p: 2, mt: 3 }}>
//         <div
//           style={{
//             backgroundImage: `url(${LoginImage})`,
//             backgroundRepeat: "no-repeat",
//             backgroundColor: "#f5f5f5",
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             borderRadius: "50px",
//             height: "95%",
//             width: "85%",
//           }}
//         />
//       </Grid>
//     </Grid>
//   );
// };

// export default PhoneNumberLoginPage;
