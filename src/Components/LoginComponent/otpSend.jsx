import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box, Grid, Paper, TextField } from "@mui/material";
import LoginImage from "../../Images/laginpageImage.jpg";
import Logo from "../../Images/logo.jpg";

const OtpSendpage = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();


  // Countdown timer logic
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input field
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleResend = () => {
    setTimer(30);
    setOtp(['', '', '', '']); // Clear OTP inputs
    // navigate("/dashboard/home"); // Redirect to Layout Page
  };

  return (
    <Grid container component="main" sx={{ height: "100vh", boxShadow: "none" }}>
      {/* Left Side - OTP Form */}
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={0} square>
        <Box
          sx={{
            my: 8,
            mx: 15,
            display: "flex",
            flexDirection: "column",
          
          }}
        >
          <img
            src={Logo}
            alt="Logo"
            style={{ width: "150px", marginBottom: "20px" ,mb:15}}
          />

          <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", mb: 5 }}>
            Verification OTP
          </Typography>

          <Box display="flex" gap={2} mb={3} justifyContent="center">
            {otp.map((digit, index) => (
              <TextField
                key={index}
                id={`otp-input-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                inputProps={{ maxLength: 1 }}
                sx={{
                  width: "50px",
                  height: "50px",
                  textAlign: "center",
                  fontSize: "24px",
                }}
              />
            ))}
          </Box>

          <Typography variant="body2" sx={{ mb: 3, textAlign: "center" }}>
            A Code Has been sent to your phone
          </Typography>

          {timer > 0 ? (
            <Typography variant="body2" sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}>
              Resend in 00:{timer.toString().padStart(2, '0')}
            </Typography>
          ) : (
            <Typography
              variant="body2"
              color="primary"
              onClick={handleResend}
              sx={{ cursor: "pointer", fontWeight: "bold", textAlign: "center", mb: 3 }}
            >
              Resend OTP
            </Typography>
          )}

<Button
      variant="contained"
      color="primary"
      sx={{ mt: 4, width: "100%" }}
      onClick={() => navigate("/dashboard/home")}
    >
      Continue
    </Button>
        </Box>
      </Grid>

      {/* Right Side - Background Image */}
      <Grid item xs={false} sm={4} md={6} sx={{ p: 2,mt:3 }}>
        <div
          style={{
            backgroundImage: `url(${LoginImage})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: "#f5f5f5",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "25px",
            height: "95%",
            width: "85%",
          }}
        />
      </Grid>
    </Grid>
  );
};

export default OtpSendpage;