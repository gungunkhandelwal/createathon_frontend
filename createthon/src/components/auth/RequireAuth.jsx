import React from "react";
import { Navigate } from "react-router-dom";
import { getCookie } from "../../api/apiClient";
import { sendLogoutApi } from "./Logout";

export const getUserInfo = () => {
  try {
    const userDataString = getCookie("user_data");
    return userDataString ? JSON.parse(userDataString) : {};
  } catch (error) {
    console.error("Error parsing user data:", error);
    return {};
  }
};

export const isUserAllowed = () => {
  const userInfo = getUserInfo();
  // If is_active is not present in the user data, assume the user is allowed
  // This prevents immediate logout after signup when is_active might not be set
  return userInfo.is_active === undefined || userInfo.is_active === true;
};

const RequireAuth = ({ children }) => {
  const isAuthenticated = checkAuthentication();
  return isAuthenticated ? children : <Navigate to="/" />;
};

export const checkAuthentication = () => {
  // Check if we have the essential cookies
  const sessionExpiryString = getCookie("session_expiry");
  const accessToken = getCookie("access_token");
  
  if (!sessionExpiryString || !accessToken) return false;

  const sessionExpiry = new Date(sessionExpiryString);
  const now = new Date();

  if (now > sessionExpiry) {
    return false;
  }

  // Check if user is allowed
  const accessEnabled = isUserAllowed();

  if (!accessEnabled) {
    window.alert(
      "Your access to the portal has been disabled. Please contact an Administrator."
    );
    
    const refresh_token = getCookie("refresh_token"); 
    const access_token = getCookie("access_token");
     
    if (refresh_token && access_token) {
      sendLogoutApi(refresh_token, access_token);
    }
  
    return false;
  }

  return true;
};

export default RequireAuth;