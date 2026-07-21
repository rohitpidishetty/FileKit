import React, { useEffect, useState, version } from "react";
import "./Downloader.css";

function Downloader({ platform }) {





  const [versions, setVersions] = useState(null);
  const [showList, setShowList] = useState(false);
  const [installerOptions, setInstallerOptions] = useState(null);
  const [showInstallerOptions, setShowInstallerOptions] = useState(false);
  const [chip, setChip] = useState(null);
  const [data, setData] = useState(null);
  const [render, setRender] = useState(false);

  useEffect(() => {
    setShowList(false);
    setVersions(null);
    setShowInstallerOptions(false);
  }, [platform]);


  useEffect(() => {
    async function getData() {
      let response = await fetch("https://raw.githubusercontent.com/rohitpidishetty/FileKit/refs/heads/main/releases/releases.json");
      response = await response.json();
      setData(response);
      setRender(true);
    }
    getData();
  }, []);


  if (!data) return;


  const current = data[platform];

  if (!current || !data) return null;



  return (
    <div className="downloader-card">
      <img
        src="/FileKit.png"
        alt="FileKit"
        className="downloader-logo"
      />

      <h2>FileKit</h2>

      <p className="subtitle">
        Intelligent File Management System
      </p>

      <div className="platform-pill">
        {current.title}
      </div>

      <p className="platform-description">
        {current.description}
      </p>

      {
        Object.keys(current.binaries).map((e) => (
          <button
            key={e}
            className={`architecture-chip ${chip === e ? "active" : ""}`}
            onClick={() => {
              setChip(e);
              setVersions(current.binaries[e]);
              setShowList(true);
            }}
          >
            {e === "intel64" ? "Intel 64" : "ARM64"}
          </button>
        ))
      }

      {
        showList && versions &&

        <select onChange={(E) => {
          try {

            setInstallerOptions(versions.filter(e => e.version === E.target.value)[0] || null);
            setShowInstallerOptions(true);
          } catch (err) { }
        }}>
          <option value={"1.0.0"}>Select Version</option>
          {
            versions.map(e => {
              return <option value={e.version} >{e.version}</option>
            })
          }
        </select>
      }
      <br />
      {
        showInstallerOptions && installerOptions && installerOptions?.releases?.map(e => {

          return <button onClick={() => { window.open(e.url, "_blank") }}>Download .{e.type}</button>

        })
      }



      <div className="release-info">
        <span>GPL v3</span>
        <span>•</span>
        <span>64-bit</span>
      </div>
    </div>
  );
}

export default Downloader;