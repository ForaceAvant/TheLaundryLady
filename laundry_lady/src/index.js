// src/main.jsx or src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "@fontsource/great-vibes/400.css";
import "@fontsource/lora/400.css";
import "@fontsource/lora/700.css";

import LandingPage from "./App.js";
import OrderForm from "./OrderForm.jsx"; // your existing form page

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#B66AD9" },      // lavender accent (logo text vibe)
    secondary: { main: "#F7C7DA" },    // blush
    background: { default: "#FFF5F9", paper: "#FFFFFF" },
    text: { primary: "#2E2A2F", secondary: "#6B6470" },
  },
  typography: {
    fontFamily: '"Lora", serif',
    h1: { fontWeight: 700, letterSpacing: "-0.5px" },
    h2: { fontWeight: 700, letterSpacing: "-0.4px" },
    button: { fontWeight: 700, textTransform: "none" },
  },
  components: {
    MuiButton: {
      styleOverrides: { root: { borderRadius: 16, paddingInline: 20 } },
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: 24 } },
    },
  },
});

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/order", element: <OrderForm /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);

