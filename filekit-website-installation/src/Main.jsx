import React, { useState } from "react";
import "./Main.css";
import Downloader from "./Downloader";

function Main() {
  const [selected, setSelected] = useState("windows");
  return (
    <main className="page">
      <div className="background-blur blur-one" />
      <div className="background-blur blur-two" />

      <nav className="navbar">
        <a href="#home" className="brand">
          <img src="/FileKit.png" alt="FileKit logo" />

          <div>
            <strong>FileKit</strong>
            <span>File management, simplified.</span>
          </div>
        </a>

        <div className="navlinks">
          <a href="#home">Overview</a>
          <a href="#download">Download</a>
          <a href="#documentation">Documentation</a>
          <a
            href="https://github.com/rohitpidishetty/FileKit"
            target="_blank"
            rel="noreferrer"
            className="github-button"
          >
            GitHub
          </a>
        </div>
      </nav>

      <section className="hero" id="home">
        <div className="leftdiv" id="download">
          <div className="download-header">
            <button onClick={() => setSelected("windows")} className={selected === "windows" ? "active" : ""}>
              Windows
            </button>

            <button onClick={() => setSelected("linux")} className={selected === "linux" ? "active" : ""}>
              Linux
            </button>

            <button onClick={() => setSelected("mac")} className={selected === "mac" ? "active" : ""}>
              macOS
            </button>
          </div>

          <Downloader platform={selected} />
        </div>

        <div className="rightdiv">
          <div className="preview-glow" />

          <div className="preview-window">
            <div className="preview-header">
              <div className="window-controls">
                <span className="close" />
                <span className="minimize" />
                <span className="maximize" />
              </div>

              <span className="preview-title">FileKit</span>
              <span className="preview-version">v1.0.0</span>
            </div>

            <div className="preview-image-wrapper">
              <img src="/a.png" alt="FileKit application preview" />
            </div>
          </div>

          <div className="floating-card analytics-card">
            <span className="floating-icon">⌁</span>

            <div>
              <strong>File Analytics</strong>
              <small>Understand your storage instantly</small>
            </div>
          </div>

          <div className="floating-card secure-card">
            <span className="status-dot" />

            <div>
              <strong>Runs locally</strong>
              <small>Your files stay on your device</small>
            </div>
          </div>
        </div>
      </section>

      <section className="documentation" id="documentation">
        <div className="documentation-header">
          <span className="section-label">DOCUMENTATION</span>

          <h2>Everything you need to use FileKit.</h2>

          <p>
            FileKit combines a powerful Java-based processing engine with a
            modern desktop interface, giving you fast and reliable tools for
            organizing, analyzing, and managing files.
          </p>
        </div>

        <div className="documentation-grid">
          <article className="documentation-card featured-card">
            <div className="card-number">01</div>

            <div className="documentation-icon">⌁</div>

            <h3>Analyze your files</h3>

            <p>
              Scan folders and view detailed information about file counts,
              folder structure, extensions, storage usage, and the largest
              files on your system.
            </p>


          </article>

          <article className="documentation-card">
            <div className="card-number">02</div>

            <div className="documentation-icon">⇄</div>

            <h3>Organize automatically</h3>

            <p>
              Sort files into structured folders based on their type, clean
              empty directories, move content, and simplify repetitive file
              management tasks.
            </p>


          </article>

          <article className="documentation-card">
            <div className="card-number">03</div>

            <div className="documentation-icon">⌕</div>

            <h3>Inspect file details</h3>

            <p>
              Review file properties, absolute paths, sizes, available storage,
              directory information, and metadata from one consistent
              interface.
            </p>


          </article>

          <article className="documentation-card">
            <div className="card-number">04</div>

            <div className="documentation-icon">⌘</div>

            <h3>Use the command line</h3>

            <p>
              Access FileKit through its Java command-line interface for
              automation, scripting, development workflows, and advanced file
              operations.
            </p>


          </article>
        </div>

        <div className="getting-started">
          <div className="getting-started-content">
            <span className="section-label">GETTING STARTED</span>

            <h2>Start managing files in minutes.</h2>

            <p>
              Download the correct build for your operating system, install
              FileKit on a local drive, and launch the application to begin
              analyzing your folders.
            </p>
          </div>

          <div className="steps">
            <div className="step">
              <span>1</span>

              <div>
                <strong>Download</strong>
                <p>Select the build created for your operating system.</p>
              </div>
            </div>

            <div className="step">
              <span>2</span>

              <div>
                <strong>Install</strong>
                <p>Install FileKit in a location with sufficient storage.</p>
              </div>
            </div>

            <div className="step">
              <span>3</span>

              <div>
                <strong>Launch</strong>
                <p>Open FileKit and select a folder to begin analyzing.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="technology-panel">
          <div>
            <span className="section-label">BUILT WITH</span>

            <h2>Modern interface. Powerful core.</h2>

            <p>
              FileKit uses Electron and React to provide a smooth desktop
              experience, while its core file-processing operations are handled
              by Java.
            </p>
          </div>

          <div className="technology-list">
            <div>
              <span>JS</span>
              <strong>Electron</strong>
              <small>Desktop application framework</small>
            </div>

            <div>
              <span>R</span>
              <strong>React</strong>
              <small>Responsive user interface</small>
            </div>

            <div>
              <span>J</span>
              <strong>Java</strong>
              <small>Core file-processing engine</small>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <img src="/FileKit.png" alt="FileKit logo" />

            <div>
              <strong>FileKit</strong>
              <p>
                A modern, cross-platform file management and analytics
                application.
              </p>
            </div>
          </div>

          <div className="footer-columns">
            <div>
              <strong>Product</strong>
              <a href="#home">Overview</a>
              <a href="#download">Download</a>
              <a href="#documentation">Documentation</a>
            </div>

            <div>
              <strong>Resources</strong>
              <a
                href="https://github.com/rohitpidishetty/FileKit"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <a href="https://github.com/rohitpidishetty/FileKit/blob/main/CHANGELOG.md">Release notes</a>
              <a href="https://github.com/rohitpidishetty/FileKit/blob/main/CONTRIBUTORS.md">Contributors</a>
            </div>

            <div>
              <strong>Legal</strong>
              <a href="https://github.com/rohitpidishetty/FileKit/blob/main/LICENSE">GPL-3.0 License</a>
              <a href="https://github.com/rohitpidishetty/FileKit/blob/main/SECURITY.md">Privacy</a>
              <a href="https://github.com/rohitpidishetty/FileKit/blob/main/CODE_OF_CONDUCT.md">Code of Conduct</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} FileKit. Released under the GNU GPL v3 License.</p>
          <p>Designed and developed by NFRAC-VTC.</p>
        </div>
      </footer>
    </main>
  );
}

export default Main;