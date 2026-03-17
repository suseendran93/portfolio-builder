import React from "react";
import ReactDOM from "react-dom/client";
import "./index/index.scss";
import App from "./App/App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { getRouterBasename } from "./utils/router";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router basename={getRouterBasename()}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
