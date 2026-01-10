import { useState } from "react";
import {
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ApiService from "../../services/ApiServices";
import LoginImage from "../../Images/laginpageImage.jpg";
import Logo from "../../Images/logo.jpg";

const EmailLoginPage = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogin = async () => {
    try {
      const response = await ApiService.post("user/login", {
        userName,
        password,
      });

      console.log("Login Response:", response);

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/dashboard/home");
      } else {
        alert("Login failed, please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Invalid Credentials!");
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      {/* Left - Login form */}
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
            label="User Name"
            variant="outlined"
            sx={{ mb: 2 }}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            variant="outlined"
            sx={{ mb: 2 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mb: 2, textTransform: "none" }}
            onClick={handleLogin}
          >
            Login
          </Button>

          <Typography
            variant="body2"
            sx={{ textAlign: "center", mt: 6, width: "100%" }}
          >
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

      {/* Right - Image (hidden on mobile) */}
      {!isMobile && (
        <Grid item xs={false} sm={5} md={6} sx={{ py: 2, mt: 3 }}>
          <Box
            sx={{
              backgroundImage: `url(${LoginImage})`,
              backgroundRepeat: "no-repeat",
              backgroundColor: "#f5f5f5",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "25px",
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

export default EmailLoginPage;

// import { useState } from "react";
// import { Button, Typography, Box, Grid, Paper, TextField } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";  // <-- make sure axios is installed
// import LoginImage from "../../Images/laginpageImage.jpg";
// import Logo from "../../Images/logo.jpg";

// const EmailLoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       // 1. Call the login API
//       const response = await axios.post("http://localhost:3001/user/login", {
//         email,
//         password,
//       });

//       const { token } = response.data.data; // token from the response
//       const { user } = response.data.data;  // user details from the response

// console.log("111111111 token>",token)
// console.log("111111111 user Data>",user)

//       if (token) {
//         // 2. Save token to localStorage
//         localStorage.setItem("token", token);

//         // 3. Save user data to localStorage
//         localStorage.setItem("user", JSON.stringify(user));

//         // 4. Navigate to dashboard
//         navigate("/dashboard/home");
//       } else {
//         alert("Login failed, please try again.");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       alert(error.response?.data?.message || "Invalid Credentials!");
//     }
//   };

//   return (
//     <Grid container component="main" sx={{ height: "100vh", boxShadow: "none" }}>
//       <Grid item xs={12} sm={8} md={6} component={Paper} elevation={0} square>
//         <Box
//           sx={{
//             my: 8,
//             mx: 15,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "flex-start",
//             boxShadow: "none",
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
//             Enter to unlimited access to data & information
//           </Typography>

//           <TextField
//             fullWidth
//             label="Email"
//             variant="outlined"
//             sx={{ mb: 2 }}
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           <TextField
//             fullWidth
//             type="password"
//             label="Password"
//             variant="outlined"
//             sx={{ mb: 2 }}
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <Button
//             fullWidth
//             variant="contained"
//             color="primary"
//             sx={{ mb: 2 }}
//             onClick={handleLogin}
//           >
//             Login
//           </Button>

//           <Typography variant="body2" sx={{ textAlign: "center", mt: 6 }}>
//   Create New Account?{" "}
//   <span
//     style={{ color: "#007bff", cursor: "pointer" }}
//     onClick={() => navigate("/register-form")}
//   >
//     Sign up
//   </span>
// </Typography>

//         </Box>
//       </Grid>

//       <Grid item xs={false} sm={4} md={6} sx={{ py: 2 ,mt:3}}>
//         <div
//           style={{
//             backgroundImage: `url(${LoginImage})`,
//             backgroundRepeat: "no-repeat",
//             backgroundColor: "#f5f5f5",
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             borderRadius: "25px",
//             height: "95%",
//             width: "85%",
//           }}
//         />
//       </Grid>
//     </Grid>
//   );
// };

// export default EmailLoginPage;
