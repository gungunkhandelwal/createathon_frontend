import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Logout } from "./components/auth/Logout";
// import Signup from "./pages/signup/Signup";
import Login from "./pages/auth/Login";
import FinishLogin from "./pages/finish-login/FinishLogin";
import Error from "./pages/error/Error";
import Home from "./pages/Home/Home";
import RequireAuth from "./components/auth/RequireAuth";
import Signup from "./pages/auth/Signup";


export const router = createBrowserRouter([
  {
    path: "/home",
    element: (
      <RequireAuth>
          <Home/>
      </RequireAuth>
    ),
    errorElement: <Error />,
  },

  {
    path: "/",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/logout",
    element: <Logout />,
    errorElement: <Error />,
  },

  {
    path: "/finish-login",
    element: <FinishLogin />,
    errorElement: <Error />,
  },
  {
    path: "/signup",
    element: <Signup />,
    errorElement: <Error />,
  },
]);
