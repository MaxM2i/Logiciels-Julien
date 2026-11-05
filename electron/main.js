const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
let win;
function createWindow() { win = new BrowserWindow({ width: 1450, height: 920, minWidth: 1050, minHeight: 700, webPreferences: { contextIsolation: true } }); win.loadFile(path.join(__dirname, 'launcher.html')); }
app.whenReady().then(() => { createWindow(); app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() }) }); app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() });
