import "./App.css";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PortfolioProvider } from "./context/PortfolioContext";
import Login from "./components/Login/Login";
import Builder from "./components/Builder/Builder";
import PortfolioView from "./pages/PortfolioView";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Signup from "./components/Signup/Signup";
import { useAuth } from "./context/AuthContext";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/" />;
};


const App = () => {
  return (
    <PortfolioProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Toaster position="top-right" />
        <Routes>
          {/* Public Route FIRST to ensure priority */}
          <Route path="/p/:slug" element={<PortfolioView publicMode={true} />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="*" element={<Navigate to="/" />} />

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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </PortfolioProvider>
  );
};

export default App;
