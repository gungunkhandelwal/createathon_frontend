import { Box, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";



const Layout = ({
  children,
  type,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: "0",
        overflowY: "hidden",
        overflowX: "hidden",
        height: "100vh",
      }}
    >
      <Navbar/> 
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          // height: "calc(100vh - 60px)",
          overflowX: "hidden",
          overflowY: "auto", 
        }}
      >
        <Box sx={{ flexGrow: 1, p: 2 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default Layout;
