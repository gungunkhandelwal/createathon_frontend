import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Logout } from "./components/auth/Logout";
import Login from "./pages/auth/Login";
import FinishLogin from "./pages/finish-login/FinishLogin";
import Error from "./pages/error/Error";
import Home from "./pages/Home/Home";
import RequireAuth from "./components/auth/RequireAuth";
import Signup from "./pages/auth/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import Layout from "./layout/Layout";
import ChallengeList from "./pages/ChallengeList";
import ChallengeDetail from "./pages/ChallengeDetails";


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
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <Layout type="home">
          <Dashboard/>
          </Layout>
      </RequireAuth>
    ),
    errorElement: <Error />,
  },
  {
    path: "/challenges",
    element: (
      <RequireAuth>
        <Layout type="home">
          <ChallengeList/>
          </Layout>
      </RequireAuth>
    ),
    // errorElement: <Error />,
  },
  {
    path: "/details",
    element: (
      <RequireAuth>
        <Layout type="home">
          <ChallengeDetail/>
          </Layout>
      </RequireAuth>
    ),
    // errorElement: <Error />,
  },
]);
