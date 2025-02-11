import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ErrorBoundary from "./components/constants/Error.jsx";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./Context/DarkMode/ThemeProvider.jsx";
import { RefProvider } from "./Context/RefContext/RefContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RefProvider>
            <ErrorBoundary>
              <Toaster />
              <App />
            </ErrorBoundary>
        </RefProvider>
    </ThemeProvider>
  </BrowserRouter>
);
