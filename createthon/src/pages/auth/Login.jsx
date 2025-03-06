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

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.between('xs','sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isAuthenticated = checkAuthentication();
    if (isAuthenticated) {
      navigate("/");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const sessionExpiry = () => {
    const now = new Date();
    const accessTokenExpiry = new Date(now.getTime() + 1 * 60 * 59 * 1000); // 59 minutes
    return accessTokenExpiry.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      // Call the login endpoint using apiClient
      const response = await apiClient.post('/api/auth/login/', formData);
      
      // Handle successful login
      setCookie('access_token', response.data.access);
      setCookie('refresh_token', response.data.refresh);
      setCookie('user_data', JSON.stringify(response.data.user_data));
      setCookie('session_expiry', sessionExpiry());
      
      navigate('/home');
    } catch (error) {
      // Handle login error
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
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
            Welcome back! Please sign in to continue
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '6px' }}>
              {error}
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
                'Log In'
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
              Don't have an account? {' '}
              <Link 
                to='/signup' 
                style={{ 
                  color: theme.palette.primary.main, 
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;