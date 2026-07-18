const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const fileSys = require("fs/promises");
const { execFile } = require("node:child_process");

if (require('electron-squirrel-startup'))
  app.quit();

Menu.setApplicationMenu(null);

function getJarPath() {
  return app.isPackaged
    ? path.join(
      process.resourcesPath,
      "binaries",
      "FileKit.jar"
    )
    : path.join(
      process.cwd(),
      "resources",
      "binaries",
      "FileKit.jar"
    );
}


function getJavaPath() {
  const executable =
    process.platform === "win32"
      ? "java.exe"
      : "java";


  return app.isPackaged
    ? path.join(
      process.resourcesPath,
      "runtime", "bin",
      executable
    )
    : path.join(
      process.cwd(),
      "resources",
      "runtime", "bin",
      executable
    );
}

ipcMain.handle("filekit:jar-exists", () => {
  const jarPath = getJarPath();
  const javaPath = getJavaPath();
  const exists = fs.existsSync(jarPath);
  const javaExists = fs.existsSync(javaPath);

  if (exists && javaExists)
    return {
      exists,
      path: jarPath,
    };

  return null;
});

ipcMain.handle("dialog:open", async (_event, type) => {
  const properties =
    type === "file"
      ? ["openFile"]
      : ["openDirectory"];

  const result = await dialog.showOpenDialog({
    properties,
  });

  return result.canceled ? null : result.filePaths[0];
});

// Development
// ipcMain.handle("filekit:run", async (_event, args) => {

//   const jarPath = getJarPath();


//   return new Promise((resolve, reject) => {

//     execFile(
//       "java",
//       [
//         "-Dfile.encoding=UTF-8",
//         "-Dstdout.encoding=UTF-8",
//         "-Dstderr.encoding=UTF-8",
//         "-jar",
//         jarPath,
//         ...args,
//       ],
//       { windowsHide: true },
//       (error, stdout, stderr) => {
//         if (error) {
//           reject(new Error(stderr?.trim() || error.message));
//           return;
//         }

//         resolve({
//           output: stdout.trim(),
//           error: stderr.trim(),
//         });
//       }
//     );
//   });
// });


// Production

ipcMain.handle("filekit:run", async (_event, args = []) => {
  const jarPath = getJarPath();
  const javaPath = getJavaPath();

  if (!fs.existsSync(javaPath))
    throw new Error(`Bundled Java runtime not found: ${javaPath}`);


  if (!fs.existsSync(jarPath))
    throw new Error(`FileKit.jar not found: ${jarPath}`);


  if (!Array.isArray(args))
    throw new Error("Invalid FileKit arguments.");


  return new Promise((resolve, reject) => {
    execFile(
      javaPath,
      [
        "-Dfile.encoding=UTF-8",
        "-Dstdout.encoding=UTF-8",
        "-Dstderr.encoding=UTF-8",
        "-jar",
        jarPath,
        ...args.map(String),
      ],
      {
        windowsHide: true,
        cwd: path.dirname(jarPath),
        encoding: "utf8",
        maxBuffer: 500 * 1024 * 1024, // 500 MB
      },
      (error, stdout, stderr) => {
        if (error) {
          reject(
            new Error(
              stderr?.trim() ||
              error.message ||
              "FileKit execution failed."
            )
          );
          return;
        }

        resolve({
          output: stdout.trim(),
          error: stderr.trim(),
        });
      }
    );
  });
});

ipcMain.handle("read-file", async (_, filePath) => {
  const finalPath = app.isPackaged
    ? path.join(
      process.resourcesPath,
      filePath
    )
    : path.join(
      process.cwd(),
      filePath
    );

  return await fileSys.readFile(finalPath, "utf8");
});


let splash;
let mainWindow;

function createSplash() {
  splash = new BrowserWindow({
    width: 500,
    height: 300,
    frame: false,
    transparent: false,
    resizable: false,
    alwaysOnTop: true,
    center: true,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "assets", "FileKit.ico"),
    webPreferences: {
      contextIsolation: true,
    },
  });
  const loadingPath = app.isPackaged
    ? path.join(process.resourcesPath, "loading.html")
    : path.join(__dirname, "../../src/loading.html");

  splash.loadFile(loadingPath);
}

function createWindow() {


  mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    show: false,
    icon: path.join(__dirname, "assets", "FileKit.png"),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: false,
      devTools: false,
    },
  });

  mainWindow.maximize();
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // mainWindow.webContents.openDevTools();

  mainWindow.once("ready-to-show", () => {
    splash.destroy();
    mainWindow.show();
  });
}


app.whenReady().then(() => {
  createSplash();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createSplash();
      createWindow();
    }
  });
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

