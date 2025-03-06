import React from "react";
import { RouterProvider } from "react-router-dom";
import theme from "./theme";
import { router } from "./routes";
import { ThemeProvider } from "@emotion/react";
import "./index.css";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router}/>
    </ThemeProvider>
  );
};

export default App;
