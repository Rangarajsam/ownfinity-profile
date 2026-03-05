import React, { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import "./index.css";
import App from "./App";

// Keep a reference so it won't get garbage-collected
let root: Root | null = null;

const mount = (el: HTMLElement): void => {
  // Unmount any existing root first to avoid conflicts
  if (root) {
    root.unmount();
  }
  
  root = createRoot(el);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

const unmount = (el: HTMLElement): void => {
  if (root) {
    root.unmount();
    root = null;
  }
};

if (process.env.NODE_ENV === "development") {
  const devRoot = document.getElementById("_profile_dev_root");
  if (devRoot) {
    mount(devRoot);
  }
}

export { mount, unmount };
