const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const fileSys = require("fs/promises");
const { execFile } = require("node:child_process");

if (require('electron-squirrel-startup'))
  app.quit();




ipcMain.handle("filekit:jar-exists", () => {
  const jarPath = path.join(process.cwd(), "src", "binaries", "FileKit.jar");

  return {
    exists: fs.existsSync(jarPath),
    path: jarPath,
  };
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

ipcMain.handle("filekit:run", async (_event, args) => {
  console.log(args)
  const jarPath = path.join(
    process.cwd(),
    "src",
    "binaries",
    "FileKit.jar"
  );


  return new Promise((resolve, reject) => {

    execFile(
      "java",
      [
        "-Dfile.encoding=UTF-8",
        "-Dstdout.encoding=UTF-8",
        "-Dstderr.encoding=UTF-8",
        "-jar",
        jarPath,
        ...args,
      ],
      { windowsHide: true },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr?.trim() || error.message));
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
  return await fileSys.readFile(filePath, "utf8");
});

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.webContents.openDevTools();
};


app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

