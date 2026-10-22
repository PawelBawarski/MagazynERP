'use strict';

const { app, BrowserWindow, shell } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const developmentUrl = 'http://localhost:4200';
const developmentOrigin = new URL(developmentUrl).origin;

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 360,
    minHeight: 640,
    backgroundColor: '#10221e',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
    },
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) {
      void shell.openExternal(url);
    }

    return { action: 'deny' };
  });

  window.webContents.on('will-navigate', (event, targetUrl) => {
    if (app.isPackaged) {
      const appEntry = pathToFileURL(
        path.join(__dirname, '..', 'dist', 'stockflow-electron', 'browser', 'index.html'),
      ).href;

      if (targetUrl !== appEntry && !targetUrl.startsWith(`${appEntry}#`)) {
        event.preventDefault();
      }
    } else {
      try {
        if (new URL(targetUrl).origin !== developmentOrigin) {
          event.preventDefault();
        }
      } catch {
        event.preventDefault();
      }
    }
  });

  if (app.isPackaged) {
    void window.loadFile(
      path.join(__dirname, '..', 'dist', 'stockflow-electron', 'browser', 'index.html'),
    );
  } else {
    void window.loadURL(developmentUrl);
  }
}

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
