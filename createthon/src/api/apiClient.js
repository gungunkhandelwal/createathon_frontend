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
  });
};

const clearCookie = (cookie_name) => {
  Cookies.remove(cookie_name);
};

const getCookie = (cookie_name) => {
  return Cookies.get(cookie_name);
};

const baseURL ='http://127.0.0.1:8000/';

const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const csrfToken = getCookie("csrf_token");
  if (csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken;
  }
  return config;
});

let isRefreshing = false;
let refreshPromise = null;
let failedQueue = [];

const refreshAccessToken = async () => {
  try {
    const refresh_token = getCookie("refresh_token");
    const response = await axios.post(
      `${baseURL}/api/auth/refresh/`,
      { refresh: refresh_token },
      {
        headers: {
          "X-CSRFToken": getCookie("csrf_token"),
        },
      }
    );
    const { access_token } = response.data;
    setCookie("access_token", access_token);
    setCookie("session_expiry", sessionExpiry());
    return access_token;
  } catch (error) {
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
    
    if (originalRequest.url?.includes("logout")) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 && error.response?.status !== 403) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      window.location.href = "/logout";
      return Promise.reject(error);
    }

    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken();

      try {
        const newToken = await refreshPromise;
        processQueue(null, newToken);
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = "Bearer " + newToken;
        }
        originalRequest._retry = true;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        window.location.href = "/logout";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then((token) => {
        if (originalRequest.headers && typeof token === "string") {
          originalRequest.headers["Authorization"] = "Bearer " + token;
        }
        return apiClient(originalRequest);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }
);

apiClient.interceptors.request.use((config) => {
  const csrfToken = getCookie("csrf_token");
  const token = getCookie("access_token");
  if (csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken;
  }

  if (
    token &&
    config.url &&
    !config.url.includes("/") &&
    !config.url.includes("signup/")
  ) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

export { apiClient, setCookie, clearCookie, getCookie, baseURL };
