import "./App.scss";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PortfolioProvider } from "../context/PortfolioContext";
import Login from "../components/Login/Login";
import Builder from "../components/Builder/Builder";
import PortfolioView from "../pages/PortfolioView/PortfolioView";
import PublicPortfolioView from "../pages/PublicPortfolioView/PublicPortfolioView";
import Success from "../pages/Success/Success";
import Cancel from "../pages/Cancel/Cancel";
import Signup from "../components/Signup/Signup";
import { useAuth } from "../context/AuthContext";
import NotFound from "../pages/NotFound/NotFound";
import { Toaster } from "react-hot-toast";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/" />;
};


const App = () => {
  return (
    <PortfolioProvider>
      <div className="app-shell">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/p/:slug" element={<PublicPortfolioView />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </PortfolioProvider>
  );
};

export default App;
