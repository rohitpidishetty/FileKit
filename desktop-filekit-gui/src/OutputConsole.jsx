import React, { useState } from "react";
import "./OutputConsole.css";
import StorageChart from "./StorageChart";

function OutputConsole({
  open,
  output = "",
  running = false,
  error = "",
  onClose,
  chartInfo = null
}) {
  if (!open) return null;

  let path = output?.split("\n");
  path = path[path?.length - 1];

  if (new String(path).startsWith("File generated at")) {
    path = path.replace("File generated at", "").trim();
    path = `binaries/${path}`;
  }
  else path = null;


  return (
    <div className="console-overlay">
      <div className="output-console">

        <header className="output-console-header">

          <button
            className="console-back"
            onClick={onClose}
          >
            ← Back
          </button>

          <div className="console-title">
            <strong>FileKit Output</strong>
            <p>{running ? "Command running..." : "Execution Result"}</p>
          </div>

        </header>

        <div className="output-console-body">

          {running && (
            <div className="console-loading">
              <div className="spinner"></div>
              <p>Executing FileKit...</p>
            </div>
          )}

          {!running && error && (
            <pre className="console-error">{error}</pre>
          )}

          {!running && !error && output && (
            <pre className="console-output">{output}</pre>
          )}

          {!running && !error && !output && (
            <div className="console-empty">
              No output available.
            </div>
          )}

        </div>

        {chartInfo &&
          <StorageChart
            type={chartInfo}
            filePath={path} />
        }
      </div>
    </div>
  );
}

export default OutputConsole;