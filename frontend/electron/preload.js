const { contextBridge } = require("electron");

// Expose a minimal API to the renderer process.
// Add ipcRenderer.invoke wrappers here as native features are needed.
contextBridge.exposeInMainWorld("electron", {
  platform: process.platform,
});
