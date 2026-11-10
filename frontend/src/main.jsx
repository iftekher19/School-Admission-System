import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { StudentProvider } from "./app/StudentContext";
import { LanguageProvider } from "./app/LanguageContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <StudentProvider>
        <App />
      </StudentProvider>
    </LanguageProvider>
  </React.StrictMode>
);