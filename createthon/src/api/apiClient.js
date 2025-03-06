import axios from "axios";
import Cookies from "js-cookie";

const sessionExpiry = () => {
  const now = new Date();
  const accessTokenExpiry = new Date(now.getTime() + 1 * 60 * 59 * 1000); // 59 minutes
  return accessTokenExpiry.toISOString();
};

const setCookie = (cookie_name, cookie_value) => {
  Cookies.set(cookie_name, cookie_value, {
    secure: true,
    sameSite: "strict",
    path: "/" // Ensure the cookie is available across all paths
  });
};

const clearCookie = (cookie_name) => {
  Cookies.remove(cookie_name, { path: "/" });
};

const getCookie = (cookie_name) => {
  return Cookies.get(cookie_name);
};

const baseURL = 'http://127.0.0.1:8000/';

const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// First interceptor - attach CSRF token to all requests
apiClient.interceptors.request.use((config) => {
  const csrfToken = getCookie("csrf_token");
  if (csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken;
  }
  return config;
});

// Second interceptor - attach authentication token to all requests except login/signup
apiClient.interceptors.request.use((config) => {
  const token = getCookie("access_token");
  
  // Skip auth header only for explicitly public endpoints
  const isPublicEndpoint = 
    config.url && (
      config.url.includes("login") || 
      config.url.includes("signup") ||
      config.url.includes("refresh")
    );

  if (token && !isPublicEndpoint) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let refreshPromise = null;
let failedQueue = [];

const refreshAccessToken = async () => {
  try {
    const refresh_token = getCookie("refresh_token");
    if (!refresh_token) {
      throw new Error("No refresh token available");
    }
    
    console.log("Attempting to refresh token with:", refresh_token);
    
    const response = await axios.post(
      `${baseURL}api/auth/refresh/`,
      { refresh: refresh_token },
      {
        headers: {
          "X-CSRFToken": getCookie("csrf_token"),
          "Content-Type": "application/json"
        },
      }
    );
    
    if (!response.data || !response.data.access_token) {
      console.error("Invalid refresh response:", response.data);
      throw new Error("Invalid refresh response");
    }
    
    const { access_token } = response.data;
    console.log("Got new access token:", access_token.substring(0, 10) + "...");
    
    setCookie("access_token", access_token);
    setCookie("session_expiry", sessionExpiry());
    return access_token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    // Clear tokens on refresh failure
    clearCookie("access_token");
    clearCookie("refresh_token");
    clearCookie("session_expiry");
    throw error;
  }
};

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Don't retry if this is a logout request
    if (originalRequest.url?.includes("logout")) {
      return Promise.reject(error);
    }

    // Only attempt refresh on auth errors
    if (error.response?.status !== 401 && error.response?.status !== 403) {
      return Promise.reject(error);
    }

    // Prevent infinite loops
    if (originalRequest._retry) {
      console.error("Request still failing after token refresh, redirecting to logout");
      window.location.href = "/logout";
      return Promise.reject(error);
    }

    console.log("Received 401/403, attempting token refresh");

    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken();

      try {
        const newToken = await refreshPromise;
        processQueue(null, newToken);
        
        // Update the failed request with new token
        if (!originalRequest.headers) {
          originalRequest.headers = {};
        }
        originalRequest.headers["Authorization"] = "Bearer " + newToken;
        originalRequest._retry = true;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed, redirecting to logout");
        processQueue(refreshError, null);
        window.location.href = "/logout";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    // If refresh is already in progress, queue this request
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then((token) => {
        if (!originalRequest.headers) {
          originalRequest.headers = {};
        }
        originalRequest.headers["Authorization"] = "Bearer " + token;
        return apiClient(originalRequest);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }
);

export { apiClient, setCookie, clearCookie, getCookie, baseURL };