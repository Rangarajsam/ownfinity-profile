import React from "react";
import "./App.css";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Providers from "./provider";
import Profile from "./pages/profile";

const App: React.FC = () => {
  const currentPath = window.location.pathname;
  const stripProfilePrefix = (path: string) => {
    if (path.startsWith("/profile")) {
      const stripped = path.replace("/profile", "");
      return stripped === "" ? "/" : stripped;
    }
    return path.startsWith("/") ? path : "/";
  };

  const initialPath = stripProfilePrefix(currentPath);

  console.log("👤 Profile App mounting with window path:", currentPath, "internal path:", initialPath);

  return (
    <Providers>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    </Providers>
  );
};

export default App;