import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

console.log("Renderer loaded");

const rootElement = document.getElementById("root");
console.log(rootElement)

if (!rootElement) {
  throw new Error("Root element was not found");
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);