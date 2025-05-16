import { Button, Typography, Box, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginImage from '../../Images/laginpageImage.jpg';
import Logo from '../../Images/logo.jpg';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <Grid container component="main" sx={{ height: '100vh' ,    boxShadow: "none",}}>
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={0} square>
        <Box sx={{ my: 8, mx: 15, display: 'flex', flexDirection: 'column', alignItems: 'left',    boxShadow: "none", }}>
          <img src={Logo} alt="Logo" style={{ width: '150px', marginBottom: '20px' }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>Welcome Back!</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Don’t have an account <span style={{ color: '#007bff', cursor: 'pointer' }}>Create now</span>
          </Typography>

          <Button
            variant="contained"
            sx={{ backgroundColor: '#007bff', color: 'white', mb: 2, width: '100%' }}
            onClick={() => navigate('/email-login')}
          >
            Login Email
          </Button>

          <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>OR</Typography>

          <Button
            variant="contained"
            sx={{ backgroundColor: '#007bff', color: 'white', mb: 2, width: '100%' }}
            onClick={() => navigate('/phone-login')}
          >
            Login Phone Number
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center", mt: 6 }}>
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

      <Grid item xs={false} sm={4} md={6} sx={{ p:2,mt:3}}>
        <div
          style={{
            backgroundImage: `url(${LoginImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#f5f5f5',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '25px',
            height: '95%',
            width: '85%',
            boxShadow: "none",
          }}
        />
      </Grid>
    </Grid>
  );
};

export default LoginPage;
