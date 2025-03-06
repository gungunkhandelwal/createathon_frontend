import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, clearCookie, getCookie } from "../../api/apiClient";

export const Logout = () => {
  const navigate = useNavigate();
  const isLogoutProcessed = useRef(false);

  useEffect(() => {
    if (isLogoutProcessed.current) return;
    
    const performLogout = async () => {
      const refresh_token = getCookie("refresh_token");
      
      if (refresh_token) {
        try {
          // Add the Authorization header with the access token
          const access_token = getCookie("access_token");
          if (access_token) {
            await sendLogoutApi(refresh_token, access_token);
          } else {
            console.warn("Access token not found for logout");
            // Still clear cookies even if API call fails
          }
        } catch (error) {
          console.error("Logout API error:", error);
          // Still clear cookies even if API call fails
        }
      }
      
      clearUserCredentials();
      navigate('/');

      isLogoutProcessed.current = true;
    };

    performLogout();

    return () => {
      isLogoutProcessed.current = true;
    };
  }, [navigate]);

  return null;
};

const clearUserCredentials = () => {
  clearCookie("session_expiry");
  clearCookie("csrf_token");
  clearCookie("sessionid");
  clearCookie("user_data");
  clearCookie("access_token");
  clearCookie("refresh_token");

  return true;
};

export const sendLogoutApi = async (refresh_token, access_token) => {
  try {
    await apiClient.post(`/api/auth/logout/`, {
      refresh: refresh_token
    }, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};