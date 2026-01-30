import "./App.css";
import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ThemeContext from "./context/ThemeContext";
import { PortfolioProvider } from "./context/PortfolioContext";
import Login from "./components/Login/Login";
import Builder from "./components/Builder/Builder";
import PortfolioView from "./pages/PortfolioView";

import Signup from "./components/Signup/Signup";
import { useAuth } from "./context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/" />;
};

const App = () => {
  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    if (theme) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  return (
    <PortfolioProvider>
      <div className={`${theme ? "app-dark" : "app-light"}`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/builder"
            element={
              <PrivateRoute>
                <Builder />
              </PrivateRoute>
            }
          />
          <Route
            path="/preview/*"
            element={
              <PrivateRoute>
                <PortfolioView />
              </PrivateRoute>
            }
          />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </PortfolioProvider>
  );
};

export default App;
