import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  apiClient,
  getCookie,
  setCookie
} from "../../api/apiClient";

export const fetchCurrentUser = async () => {
  if (!getCookie("user_data")) {
    return;
  }

  const storedUserData = getCookie("user_data");
  if (storedUserData) {
    return JSON.parse(storedUserData);
  }

  try {
    const response = await apiClient.get("/api/users/me/", {});
    const userData = response.data;
    setCookie("user_data", JSON.stringify(userData));
    return userData;
  } catch (error) {
    //
    return null;
  }
};

const FinishLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const tokenExchanged = useRef(false);

  useEffect(() => {
    if (code && !tokenExchanged.current) {
      //
      tokenExchanged.current = true;
    }
  }, [code, navigate]);

  fetchCurrentUser();

  return <div>Logging in...</div>;
};

export default FinishLogin;
