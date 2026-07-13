import React, { useRef } from "react";
import { useMemo, useState, useEffect } from "react";
import "./App.css";
import fileKitLogo from "./assets/FileKit.png";
import tools from "./assets/utilities.json";
import OutputConsole from "./OutputConsole";


const navItems = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "storage", label: "Storage", icon: "◫" },
  { id: "organization", label: "Organization", icon: "▦" },
  { id: "compression", label: "Compression", icon: "◇" },
  { id: "analysis", label: "Analysis", icon: "⌘" },
];

function App() {

  const [utilities, setUtilities] = useState(() => tools);

  const [activeNav, setActiveNav] = useState("home");
  const [search, setSearch] = useState("");
  const [selectedUtility, setSelectedUtility] = useState(null);
  const [copied, setCopied] = useState(false);
  const [fileType, setFileType] = useState("file");
  const [showOutput, setShowOutput] = useState(false);
  const [limit, setLimit] = useState(0);

  const filteredUtilities = useMemo(() => {
    if (utilities === null) return;
    setSelectedUtility(utilities[0]);
    const normalizedSearch = search.trim().toLowerCase();

    return utilities.filter((utility) => {
      const matchesSearch =
        utility.title.toLowerCase().includes(normalizedSearch) ||
        utility.description.toLowerCase().includes(normalizedSearch) ||
        utility.category.toLowerCase().includes(normalizedSearch);

      const matchesNavigation =
        activeNav === "home" ||
        utility.category.toLowerCase() === activeNav.toLowerCase();

      return matchesSearch && matchesNavigation;
    });
  }, [activeNav, search, utilities]);


  const [showMeasureOptions, setShowMeasureOptions] = useState(true);
  const [showLimitOption, setShowLimitOption] = useState(false);

  const openUtility = (utility) => {
    const util = utility.title.toLowerCase();

    switch (util) {
      case "size":
        setShowMeasureOptions(true);
        setShowFileOrFolderOption(true);
        setShowLimitOption(false);
        break;

      case "tree":
        setFileType("folder");
        setShowFileOrFolderOption(false);
        setShowMeasureOptions(false);
        setShowLimitOption(false);
        break;

      case "top files":
        setShowMeasureOptions(true);
        setShowFileOrFolderOption(false);
        setShowLimitOption(true);
        setFileType("folder");

        break;

      default:
        setShowFileOrFolderOption(false);
        setShowMeasureOptions(false);
        setShowLimitOption(false);
        break;
    }



    setSelectedUtility(utility);
  };

  const wishUser = () => {
    const hour = new Date().getHours();
    if (hour > 12 && hour < (12 + 6)) return "Good Afternoon";
    else if (hour >= (12 + 6) && hour < (12 + 8)) return "Good Evening";
    else if (hour >= (12 + 8) && hour <= 23) return "Time to sleep";
    else return "Good Morning";
  }

  const [jarPath, setJarPath] = useState(null);
  const [path, setPath] = useState(null);
  const [showFileOrFolderOption, setShowFileOrFolderOption] = useState(true);

  const ref = useRef({
    path: "D:\\",
  })

  const browseFile = async (util) => {

    const selectedPath = await window.electronAPI.openDialog(fileType);

    if (selectedPath) {
      setPath(selectedPath);
      ref.current.path = selectedPath;
    }
  };


  const [unit, setUnit] = useState("KB");

  function argsFormat(unit) {
    switch (unit) {
      case "Bytes": return "-b";
      case "KB": return "-kb";
      case "MB": return "-mb";
      case "GB": return "-gb";
    }
  }

  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(null);
  const [runError, setRunError] = useState(null);

  function executionHelper(result) {
    if (!result) {
      alert("Error occurred, try again later.")
      return;
    }
    setOutput(result.output);
    setRunning(false);
    setRunError(result.error);
    setShowOutput(true);
  }

  const executeUtility = async (utility) => {

    const util = utility?.title?.toLowerCase();
    switch (util) {
      case "size":
        if (!path) {
          alert("Please specify the file or folder path.")
          return;
        }

        try {
          setRunning(true);
          const result = await window.electronAPI.issueFileKitCommand(["-size", path, argsFormat(unit)]);
          executionHelper(result);
        }
        catch (error) {
          console.log(error);
        }
        break;
      case "tree":
        if (!path) {
          alert("Please specify the file or folder path.")
          return;
        }
        try {
          setRunning(true);
          const result = await window.electronAPI.issueFileKitCommand(["-tree", path]);
          executionHelper(result);
        }
        catch (error) {
          console.log(error);
        }
        break;
      case "top files":
        if (!path) {
          alert("Please specify the file or folder path.")
          return;
        }
        try {
          setRunning(true);
          const result = await window.electronAPI.issueFileKitCommand(["-top", limit, path, argsFormat(unit)]);
          executionHelper(result);
        }
        catch (error) {
          console.log(error);
        }
        break;
      default:
        break;
    }
  }



  useEffect(() => {
    const checkJar = async () => {
      const result = await window.electronAPI.jarExists();
      if (result.exists)
        setJarPath(result.path);
    };
    checkJar();
  }, []);

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <aside className="sidebar glass-panel">
        <div className="brand">
          <div className="brand-icon">
            <img src={fileKitLogo} />
          </div>

          <div>
            <h1>FileKit</h1>
            <p>Desktop utilities</p>
          </div>
        </div>

        <nav className="navigation">
          <p className="navigation-label">Workspace</p>

          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeNav === item.id ? "nav-item-active" : ""
                }`}
              onClick={() => setActiveNav(item.id)}
              type="button"
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-spacer" />

        <div className="system-card">
          <div className="jar-status">
            <span
              className={`jar-indicator ${jarPath ? "jar-connected" : "jar-disconnected"
                }`}
            />
            <div className="jar-info">
              <strong>FileKit.jar</strong>

              <p>{jarPath ? "Connected" : "Not Found"}</p>
            </div>
          </div>
        </div>


      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Your intelligent file workspace</p>
            <h2>{wishUser()}</h2>
          </div>

          <div className="topbar-actions">
            <label className="search-box">
              <span>⌕</span>
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search utilities"
              />
              <kbd>⌘ K</kbd>
            </label>
          </div>
        </header>

        <section className="hero glass-panel">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              FileKit 1.0
            </div>

            <h3>
              Everything you need
              <br />
              to manage your files.
            </h3>

            <p>
              Analyze storage, organize folders, inspect files and compress
              archives from one beautifully simple workspace.
            </p>

            <div className="hero-actions">


              <button
                className="primary-button"
                type="button"
                onClick={() =>
                  window.open(
                    "https://github.com/rohitpidishetty/FileKit"
                  )
                }
              >
                View Documentation
              </button>
            </div>
          </div>

          <div className="hero-visual">


            <div className="floating-card floating-card-one">
              <span className="floating-icon">⚡</span>
              <div>
                <strong>Intuitive Utilities</strong>
                <p>Ready to use</p>
              </div>
            </div>

            <div className="floating-card floating-card-two">
              <span className="floating-icon">💻</span>
              <div>
                <strong>Java Powered</strong>
                <p>Cross-platform desktop utility</p>
              </div>
            </div>

            <div className="floating-card floating-card-three">
              <span className="floating-icon">📁</span>
              <div>
                <strong>Files & Folders</strong>
                <p>Analyze • Organize • Compress</p>
              </div>
            </div>
          </div>


        </section>

        {utilities && filteredUtilities && selectedUtility &&

          < section className="content-grid">
            <div className="utilities-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Quick actions</p>
                  <h3>Utilities</h3>
                </div>

                <span className="utility-count">
                  {filteredUtilities.length} tools
                </span>
              </div>

              <div className="utility-grid">
                {filteredUtilities.map((utility) => (
                  <button
                    key={utility.id}
                    type="button"
                    className={`utility-card glass-panel ${selectedUtility.id === utility.id
                      ? "utility-card-active"
                      : ""
                      }`}
                    onClick={() => openUtility(utility)}
                  >
                    <div className="utility-card-top">
                      <div className="utility-icon">{utility.icon}</div>
                      <span className="utility-arrow">↗</span>
                    </div>

                    <div className="utility-card-content">
                      <span className="utility-category">{utility.category}</span>
                      <h4>{utility.title}</h4>
                      <p>{utility.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              {filteredUtilities.length === 0 && (
                <div className="empty-state glass-panel">
                  <div>⌕</div>
                  <h4>No utilities found</h4>
                  <p>Try searching for size, compression or organization.</p>
                </div>
              )}
            </div>

            <aside className="details-panel glass-panel">
              <div className="details-header">
                <div className="details-icon">{selectedUtility.icon}</div>

                <div>
                  <span>{selectedUtility.category}</span>
                  <h3>{selectedUtility.title}</h3>
                </div>

                <button type="button" className="more-button">
                  •••
                </button>
              </div>

              <p className="details-description">
                {selectedUtility.description}. Configure the utility and execute
                it directly from FileKit.
              </p>

              <div className="field-group">
                {showFileOrFolderOption &&
                  <div>
                    <label htmlFor="source-path">Type</label>
                    <div className="path-type">
                      <label onClick={() => setFileType("file")} className="path-option">
                        <input type="radio" name="pathType" value="file" defaultChecked />
                        <span>📄 File</span>
                      </label>

                      <label onClick={() => setFileType("folder")} className="path-option">
                        <input type="radio" name="pathType" value="folder" />
                        <span>📁 Folder</span>
                      </label>
                    </div>
                  </div>
                }
                <label htmlFor="source-path">Source path</label>

                <div className="input-shell">
                  <input
                    id="source-path"
                    type="text"
                    value={ref.current?.path}
                  />

                  <button onClick={() => browseFile(selectedUtility)} type="button">Browse</button>
                </div>
              </div>

              <div className="field-row">
                {showMeasureOptions &&
                  <div className="field-group">
                    <label htmlFor="unit">Unit</label>

                    <select id="unit" onClick={(e) => setUnit(e.target.value)} defaultValue="Bytes">

                      <option>KB</option>
                      <option>MB</option>
                      <option>GB</option>
                    </select>
                  </div>
                }


                {showLimitOption &&
                  <div className="field-group">
                    <label htmlFor="limit">Limit</label>
                    <input id="limit" type="number" onChange={(e) => setLimit(e.target.value)} defaultValue="1" />
                  </div>
                }
              </div>



              <button onClick={() => executeUtility(selectedUtility)} className="run-button" type="button">
                <span>▶</span>
                Run Utility
              </button>

              <div className="recent-activity">
                <div className="recent-heading">
                  <h4>Recent activity</h4>

                </div>

                <div className="activity-item">
                  <div className="activity-icon">◫</div>
                  <div>
                    <strong>Folder size</strong>
                    <p>Downloads · 2 minutes ago</p>
                  </div>
                  <span>14.8 GB</span>
                </div>

                <div className="activity-item">
                  <div className="activity-icon">⌘</div>
                  <div>
                    <strong>Directory tree</strong>
                    <p>Projects · 18 minutes ago</p>
                  </div>
                  <span>Done</span>
                </div>

                <div className="activity-item">
                  <div className="activity-icon">◇</div>
                  <div>
                    <strong>Archive created</strong>
                    <p>Documents · 1 hour ago</p>
                  </div>
                  <span>82 MB</span>
                </div>
              </div>
            </aside>
          </section>
        }
      </main>
      {
        showOutput &&
        <OutputConsole
          open={true}
          output={output}
          running={running}
          error={runError}
          onClose={() => setShowOutput(false)}
        />}
    </div >
  );
}

export default App;