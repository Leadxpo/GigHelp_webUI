import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Paper,
  Button,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Link,
} from "@mui/material";
import Logo from "../../Images/logo.jpg";
import ApiService from "../../services/ApiServices";
import LoginImage from "../../Images/laginpageImage.jpg";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    userName: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    const { name, phoneNumber, userName, password, confirmPassword } = formData;

    // 🔴 Check required fields
    if (!name || !phoneNumber || !userName || !password || !confirmPassword) {
      setSnackbar({
        open: true,
        message: "Please fill all mandatory fields.",
        severity: "error",
      });
      return;
    }

    // 🔴 Check password match
    if (password !== confirmPassword) {
      setSnackbar({
        open: true,
        message: "Passwords do not match.",
        severity: "error",
      });
      return;
    }

    try {
      const response = await ApiService.post("/user/register", formData);

      setSnackbar({
        open: true,
        message: "Registration successful!",
        severity: "success",
      });
      alert("Registration completed! Please login.")
      navigate("/login");
      console.log("Response:", response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Registration failed!",
        severity: "error",
      });
      console.error("Error:", error);
    }
  };

  // ✅ Helper to add red star
  const LabelWithStar = ({ label, required }) => (
    <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
      {label}
      {required && <span style={{ color: "red" }}> *</span>}
    </Typography>
  );

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Left Section - Form */}
      <Grid item xs={12} md={6} component={Paper} elevation={0} square>
        <Box
          sx={{
            px: isMobile ? 3 : 8,
            py: isMobile ? 3 : 6,
            display: "flex",
            flexDirection: "column",
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

          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Register
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <LabelWithStar label="Name" required />
              <TextField
                fullWidth
                placeholder="Your full name"
                variant="standard"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LabelWithStar label="Username" required />
              <TextField
                fullWidth
                placeholder="Enter username"
                variant="standard"
                value={formData.userName}
                onChange={(e) => handleChange("userName", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LabelWithStar label="Email" required={false} />
              <TextField
                fullWidth
                placeholder="example@gmail.com"
                variant="standard"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LabelWithStar label="Password" required />
              <TextField
                fullWidth
                placeholder="6 - 20 characters"
                variant="standard"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LabelWithStar label="Phone Number" required />
              <TextField
                fullWidth
                placeholder="+91 99999 99999"
                variant="standard"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LabelWithStar label="Re-enter Password" required />
              <TextField
                fullWidth
                placeholder="Re-enter your password"
                variant="standard"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
              />
            </Grid>
          </Grid>

          <Box mt={4} textAlign="center">
            <Typography variant="body2">
              I agree to the{" "}
              <Link href="#" underline="hover" color="primary">
                Terms of Service
              </Link>
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, borderRadius: "8px", py: 1.5, fontWeight: "bold" }}
            onClick={handleSubmit}
          >
            Create an Account
          </Button>

          <Typography
            variant="body2"
            sx={{ textAlign: "center", mt: 6, width: "100%" }}
          >
            Have an Account?{" "}
            <span
              style={{ color: "#007bff", cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              Sign in
            </span>
          </Typography>
        </Box>
      </Grid>

      {/* Right Section - Image (hide on small devices) */}
      {!isMobile && (
        <Grid item xs={false} sm={6} md={6} sx={{ p: 2, mt: 3 }}>
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

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default RegisterPage;

// import React, { useState } from "react";
// import axios from "axios";
// import {
//   Grid,
//   TextField,
//   Typography,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   Box,
//   Paper,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Button,
//   IconButton,
//   Stack,
//   Link,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import AddIcon from "@mui/icons-material/Add";
// import RemoveIcon from "@mui/icons-material/Remove";

// import Logo from "../../Images/logo.jpg";
// import LoginImage from "../../Images/laginpageImage.jpg";

// const RegisterPage = () => {
//   const [formData, setFormData] = useState({
//     userName: "",
//     email: "",
//     phoneNumber: "",
//     password: "",
//     identityProof: "",
//     identityType: "",
//     identityNumber: "",
//   });

//  const [skills, setSkills] = useState([{ work: "", experience: "" }]);

//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

//   const handleChange = (field, value) => {
//     setFormData({ ...formData, [field]: value });
//   };

//   const handleSkillChange = (index, key, value) => {
//     const updatedSkills = [...skills];
//     updatedSkills[index][key] = value;
//     setSkills(updatedSkills);
//   };

//   const handleAddSkill = () => {
//     setSkills([...skills, { work: "", experience: "" }]);
//   };

//   const handleRemoveSkill = () => {
//     if (skills.length > 0) {
//       const newSkills = [...skills];
//       newSkills.pop();
//       setSkills(newSkills);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       const dataToSubmit = {
//         ...formData,
//         skills: skills,
//         //  experience: experience,
//       };

//       console.log(dataToSubmit,"payload")

//       const response = await axios.post("http://localhost:3001/user/register", dataToSubmit);
//       setSnackbar({ open: true, message: "Registration successful!", severity: "success" });
//       console.log("Response:", response.data);
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.response?.data?.message || "Registration failed!",
//         severity: "error",
//       });
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <Grid container sx={{ height: "100vh" }}>
//       {/* Left Section - Form */}
//       <Grid item xs={12} md={6} component={Paper} elevation={0} square>
//         <Box sx={{ px: 8, py: 6, display: "flex", flexDirection: "column" }}>
//           <img src={Logo} alt="Logo" style={{ width: "150px", marginBottom: "20px" }} />
//           <Typography variant="h4" fontWeight="bold" gutterBottom>
//             Register
//           </Typography>

//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="subtitle1">Name:</Typography>
//               <TextField
//                 fullWidth
//                 placeholder="Username"
//                 variant="standard"
//                 value={formData.userName}
//                 onChange={(e) => handleChange("userName", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <Typography variant="subtitle1">Email:</Typography>
//               <TextField
//                 fullWidth
//                 placeholder="leadxpo123@gmail.com"
//                 variant="standard"
//                 value={formData.email}
//                 onChange={(e) => handleChange("email", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <Typography variant="subtitle1">Phone Number:</Typography>
//               <TextField
//                 fullWidth
//                 placeholder="+91 99985 55664"
//                 variant="standard"
//                 value={formData.phoneNumber}
//                 onChange={(e) => handleChange("phoneNumber", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <Typography variant="subtitle1">Password:</Typography>
//               <TextField
//                 fullWidth
//                 placeholder="6 - 20 characters"
//                 variant="standard"
//                 type="password"
//                 value={formData.password}
//                 onChange={(e) => handleChange("password", e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="subtitle1">Identity Proof:</Typography>
//               <FormControl fullWidth variant="filled">
//                 <InputLabel>Select</InputLabel>
//                 <Select
//                   value={formData.identityType}
//                   onChange={(e) => handleChange("identityType", e.target.value)}
//                 >
//                   <MenuItem value="aadhar">Aadhar Number</MenuItem>
//                   <MenuItem value="pan">Pan Number</MenuItem>
//                   <MenuItem value="voter">Voter ID</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 variant="standard"
//                 placeholder="9877 6675 9876"
//                 value={formData.identityNumber}
//                 onChange={(e) => handleChange("identityNumber", e.target.value)}
//               />
//             </Grid>
//           </Grid>

//           {/* Skills Section */}
//           <Box mt={4}>
//             <Typography variant="h6" fontWeight="bold" gutterBottom>
//               Fill the Skills
//             </Typography>

//             <Paper elevation={3} sx={{ borderRadius: 2, p: 2 }}>
//               <Stack spacing={1}>
//                 {skills.map((skill, index) => (
//                   <Accordion key={index} sx={{ bgcolor: "#e0e0e0" }}>
//                     <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                       <Typography>{skill.work || `Skill ${index + 1}`}</Typography>
//                     </AccordionSummary>
//                     <AccordionDetails>
//                       <TextField
//                         fullWidth
//                         label="Work"
//                         variant="standard"
//                         value={skill.work}
//                         onChange={(e) => handleSkillChange(index, "work", e.target.value)}
//                         sx={{ mb: 2 }}
//                       />
//                       <TextField
//                         fullWidth
//                         label="Experience"
//                         variant="standard"
//                         multiline
//                         minRows={2}
//                         value={skill.experience}
//                         onChange={(e) => handleSkillChange(index, "experience", e.target.value)}
//                       />
//                     </AccordionDetails>
//                   </Accordion>
//                 ))}
//               </Stack>

//               <Stack direction="row" spacing={1} justifyContent="flex-end" mt={2}>
//                 <IconButton color="primary" onClick={handleAddSkill}>
//                   <AddIcon />
//                 </IconButton>
//                 <IconButton color="error" onClick={handleRemoveSkill}>
//                   <RemoveIcon />
//                 </IconButton>
//               </Stack>
//             </Paper>
//           </Box>

//           <Box mt={4} textAlign="center">
//             <Typography variant="body2">
//               I agree to the{" "}
//               <Link href="#" underline="hover" color="primary">
//                 Terms of Service
//               </Link>
//             </Typography>
//           </Box>

//           <Button
//             fullWidth
//             variant="contained"
//             color="primary"
//             size="large"
//             sx={{ mt: 2, borderRadius: "8px", py: 1.5, fontWeight: "bold" }}
//             onClick={handleSubmit}
//           >
//             Create an Account
//           </Button>
//         </Box>
//       </Grid>

//       {/* Right Section - Image */}
//       <Grid item xs={false} sm={4} md={6} sx={{ p: 2, mt: 3 }}>
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

//       {/* Snackbar for feedback */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           severity={snackbar.severity}
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Grid>
//   );
// };

// export default RegisterPage;
