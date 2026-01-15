import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./Login/LoginPage.jsx";
import RegisterPage from "./Login/RegisterPage.jsx";
import CreateHero from "./pages/CreateHero.jsx";
import CreateMonster from "./pages/CreateMonster.jsx";
import MonsterCodex from "./pages/MonsterCodex.jsx";

import "./index.css";
import BattlePage from "./pages/BattlePage.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="heroes/create" element={<CreateHero />} />
          <Route path="battle" element={<BattlePage />} />
          <Route path="monsters/create" element={<CreateMonster />} />
          <Route path="monsters" element={<MonsterCodex />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
