import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  TextField, 
  useMediaQuery,
  useTheme,
  Alert,
  CircularProgress
} from "@mui/material";
import { Link } from 'react-router-dom';
import { checkAuthentication } from "../../components/auth/RequireAuth";
import { apiClient, setCookie, getCookie } from "../../api/apiClient";

const Signup = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.between('xs','sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isAuthenticated = checkAuthentication();
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const sessionExpiry = () => {
    const now = new Date();
    const accessTokenExpiry = new Date(now.getTime() + 1 * 60 * 59 * 1000); // 59 minutes
    return accessTokenExpiry.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
  
    try {
      // Call the register endpoint using apiClient
      const response = await apiClient.post('/api/auth/register/', formData);
      
      // Handle successful registration
      setCookie('access_token', response.data.access);
      setCookie('refresh_token', response.data.refresh);
      
      // Store user data from the response
      const userData = {
        id: response.data.user.id,
        username: response.data.user.username,
        email: response.data.user.email
      };
      
      setCookie('user_data', JSON.stringify(userData));
      setCookie('session_expiry', sessionExpiry());
      
      navigate('/home');

    } catch (error) {
      // Handle registration errors
      if (error.response?.status === 400) {
        // Field validation errors
        const fieldErrors = error.response.data;
        setErrors(fieldErrors);
      } else {
        // General error
        setErrors({ general: error.response?.data?.detail || 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: isMobile ? '1rem' : '0',
      }}
    >
      <Card
        sx={{
          minHeight: isMobile ? '180px' : '200px',
          minWidth: isMobile ? '100%' : isTablet ? '400px' : '480px',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          overflow: 'hidden',
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: isMobile ? '24px' : '32px',
          }}
        >
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            sx={{ 
              mb: 1, 
              textAlign: 'center',
              fontWeight: 600,
              color: theme.palette.primary.main
            }}
          >
            Createathon
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3, 
              textAlign: 'center',
              color: theme.palette.text.secondary
            }}
          >
            Create a new account
          </Typography>

          {errors.general && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '6px' }}>
              {errors.general}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              width: "100%",
              margin: "0 auto",
            }}
          >
            <TextField
              required
              fullWidth
              id="username"
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleInputChange}
              variant="outlined"
              error={Boolean(errors.username)}
              helperText={errors.username}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
            />
            <TextField
              required
              fullWidth
              id="email"
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              variant="outlined"
              error={Boolean(errors.email)}
              helperText={errors.email}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
            />
            <TextField
              required
              fullWidth
              id="password"
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              variant="outlined"
              error={Boolean(errors.password)}
              helperText={errors.password}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
            />
            <TextField
              required
              fullWidth
              id="password2"
              name="password2"
              type="password"
              label="Confirm Password"
              value={formData.password2}
              onChange={handleInputChange}
              variant="outlined"
              error={Boolean(errors.password2)}
              helperText={errors.password2}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ 
                mt: 1,
                borderRadius: '8px',
                padding: '12px',
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign Up'
              )}
            </Button>

            <Typography 
              component="p"
              variant="body2"
              sx={{ 
                mt: 2, 
                textAlign: 'center',
                color: theme.palette.text.secondary
              }}
            >
              Already have an account? {' '}
              <Link 
                to='/' 
                style={{ 
                  color: theme.palette.primary.main, 
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                Log In
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Signup;