import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Providers from "./provider";
import Profile from "./pages/profile";

const App: React.FC = () => {
  return (
    <Providers>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Profile />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
    </Providers>
  );
};

export default App;