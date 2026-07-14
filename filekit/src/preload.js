// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  jarExists: () => ipcRenderer.invoke("filekit:jar-exists"),
  openDialog: (type) => ipcRenderer.invoke("dialog:open", type),
  issueFileKitCommand: (args) => ipcRenderer.invoke("filekit:run", args),
  readFile: (path) => ipcRenderer.invoke("read-file", path),
});


