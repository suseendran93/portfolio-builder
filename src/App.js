import "./App.css";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PortfolioProvider } from "./context/PortfolioContext";
import Login from "./components/Login/Login";
import Builder from "./components/Builder/Builder";
import PortfolioView from "./pages/PortfolioView";
import PublicPortfolioView from "./pages/PublicPortfolioView";
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
          <Route path="/p/:userId" element={<PublicPortfolioView />} />

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
