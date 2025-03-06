import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  Button,
  useMediaQuery,
  useTheme,
  IconButton,
  Collapse
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { getUserInfo } from "../auth/RequireAuth";

const Navbar = () => {
  const { pathname } = useLocation();
  const userInfo = getUserInfo();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = isSmallScreen && isMediumScreen;
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Simplified navigation links for dashboard
  const navLinks = [
    { title: "Challenge Details", path: "/details" },
    { title: "Challenges", path: "/challenges" },
    { title: "Progress", path: "/progress" }
  ];
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  return (
    <Box sx={{ width: "100%" }}>
      {/* Main Navbar */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color:theme.palette.primary.light,
          height: "60px",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          boxSizing: "border-box",
        }}
      >
        {/* Left: Logo and Nav Links for Desktop */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h6"
            component={Link}
            to="/dashboard"
            sx={{
              textDecoration: "none",
              color: "white",
              fontWeight: 600,
              mr: 4,
            }}
          >
            Createathon
          </Typography>
          
          {/* Desktop Navigation Links */}
          {!isMobile && (
            <Box sx={{ display: "flex" }}>
              {navLinks.map((item) => (
                <Button
                  key={item.title}
                  component={Link}
                  to={item.path}
                  sx={{
                    mr: 2,
                    color: "white",
                    bgcolor: pathname === item.path ? "rgba(255,255,255,0.1)" : "transparent",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.2)",
                    },
                    textTransform: "none",
                    borderRadius: 1,
                    px: 2,
                  }}
                >
                  {item.title}
                </Button>
              ))}
            </Box>
          )}
        </Box>
        
        {/* Right: Username and Logout or Mobile Menu */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2" sx={{ color: "white", mr: 2 }}>
            {userInfo.username}
          </Typography>
          
          {!isMobile ? (
            <Button
              component={Link}
              to="/logout"
              startIcon={<LogoutIcon />}
              sx={{
                color: "white",
                textTransform: "none",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              Logout
            </Button>
          ) : (
            <IconButton 
              color="inherit" 
              onClick={toggleMenu} 
              sx={{ color: "white" }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      
      {/* Mobile Dropdown Menu */}
      {isMobile && (
        <Collapse in={menuOpen}>
          <Box
            sx={{
              width: "100%",
              bgcolor: theme.palette.primary.main,
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            {/* Navigation links in dropdown */}
            {navLinks.map((item) => (
              <Button
                key={item.title}
                component={Link}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                sx={{
                  color: "white",
                  justifyContent: "flex-start",
                  padding: "12px 16px",
                  bgcolor: pathname === item.path ? "rgba(255,255,255,0.1)" : "transparent",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.2)",
                  },
                  textTransform: "none",
                  borderRadius: 0,
                }}
              >
               {item.title}
              </Button>
            ))}
            
            {/* Logout in dropdown */}
            <Button
              component={Link}
              to="/logout"
              onClick={() => setMenuOpen(false)}
              startIcon={<LogoutIcon />}
              sx={{
                color: "white",
                justifyContent: "flex-start",
                padding: "12px 16px",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                textTransform: "none",
                borderRadius: 0,
              }}
            >
              Logout
            </Button>
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

export default Navbar;