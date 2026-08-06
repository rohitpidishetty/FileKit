import React from "react";
import { createRoot } from "react-dom/client";
import FileKit from "./FileKit.jsx";


const rootElement = document.getElementById("root");

if (!rootElement)
  throw new Error("Root element was not found");


const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <FileKit />
  </React.StrictMode>
);