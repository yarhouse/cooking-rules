const { app, BrowserWindow, dialog } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');

let serverProcess = null;
let serverReady = false;
let logStream = null;

function openLogStream() {
  const logPath = path.join(app.getPath('userData'), 'server.log');
  logStream = fs.createWriteStream(logPath, { flags: 'a' });
  logStream.write(`\n--- app started ${new Date().toISOString()} ---\n`);
  return logPath;
}

// Poll http://localhost:3000/health until it responds 200, then call onReady.
function waitForServer(url, onReady, attempts = 0) {
  if (attempts > 60) {
    const logPath = path.join(app.getPath('userData'), 'server.log');
    dialog.showErrorBox(
      'Cooking Rules — server failed to start',
      `The API server did not respond after 30 seconds.\n\nCheck the log for details:\n${logPath}`
    );
    app.quit();
    return;
  }
  http.get(url, (res) => {
    if (res.statusCode === 200) {
      onReady();
    } else {
      setTimeout(() => waitForServer(url, onReady, attempts + 1), 500);
    }
  }).on('error', () => {
    setTimeout(() => waitForServer(url, onReady, attempts + 1), 500);
  });
}

function startServer() {
  const userData = app.getPath('userData');
  // In a packaged app, spawnable files must be outside the asar archive.
  // electron-builder unpacks them to app.asar.unpacked/ alongside app.asar.
  const appPath = app.isPackaged
    ? app.getAppPath().replace('app.asar', 'app.asar.unpacked')
    : app.getAppPath();
  const serverEntry = path.join(appPath, 'server/dist/index.js');

  // Spawn the server using Electron's own Node runtime (process.execPath) so that
  // native modules (better-sqlite3) rebuilt for Electron's Node version always match.
  // ELECTRON_RUN_AS_NODE=1 makes Electron's binary act as a plain Node process.
  // We strip it from the parent env spread so the main Electron window isn't affected.
  const { ELECTRON_RUN_AS_NODE: _strip, ...parentEnv } = process.env;

  serverProcess = spawn(process.execPath, [serverEntry], {
    env: {
      ...parentEnv,
      ELECTRON_RUN_AS_NODE: '1',
      DB_PATH: path.join(userData, 'cooking-rules.db'),
      // Packaged: schema/seed files are in process.resourcesPath (extraResources).
      // Dev: db.ts falls back to resourcesPath (project root) when env var is unset.
      ...(app.isPackaged && { RESOURCES_PATH: process.resourcesPath }),
      PORT: '3000',
      CORS_ORIGINS: '',          // not needed — same origin via localhost
      NODE_ENV: 'production',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const log = (d) => {
    const line = `[server] ${d}`;
    process.stdout.write(line);
    if (logStream) logStream.write(line);
  };
  serverProcess.stdout.on('data', log);
  serverProcess.stderr.on('data', log);
  serverProcess.on('exit', (code) => {
    if (code !== 0) console.error(`[electron] Server exited with code ${code}`);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadFile(
    path.join(app.getAppPath(), 'dist/cooking-rules/browser/index.html')
  );
}

app.whenReady().then(() => {
  openLogStream();
  startServer();
  waitForServer('http://localhost:3000/api/health', () => {
    serverReady = true;
    createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  // On first launch macOS fires activate before waitForServer resolves.
  // Only open a new window once the server is confirmed ready.
  if (serverReady && BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('will-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
  if (logStream) {
    logStream.end();
    logStream = null;
  }
});
