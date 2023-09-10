/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'node:path';
import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import { homedir } from 'node:os';
import fs from 'node:fs/promises';
import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  MessageBoxSyncOptions,
  shell,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { CelestiaSamplingStats } from 'types';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const siliconMacBinary = './celestia-darwin-arm64';
const intelMacBinary = './celestia-darwin-x86_64';
const windowsBinary = 'celestia-windows-x86_64';
const linuxBinary = 'celestia-linux-x86_64';

const getCurrentBinary = () => {
  if (process.platform === 'win32') {
    return windowsBinary;
  }
  if (process.platform === 'darwin' && process.arch === 'arm64') {
    return siliconMacBinary;
  }
  if (process.platform === 'darwin' && process.arch === 'x64') {
    return intelMacBinary;
  }
  if (process.platform === 'linux') {
    return linuxBinary;
  }

  throw new Error('Unsupported platform');
};

ipcMain.handle('initialize-node', async () => {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    const targetDirectory = path.join(RESOURCES_PATH, 'binary');

    const task = spawn(
      getCurrentBinary(),
      ['light', 'init', '--p2p.network', 'arabica'],
      {
        cwd: targetDirectory,
      }
    );

    task.stdout.on('data', (data: string) => {
      stdout += data.toString();
    });

    task.stderr.on('data', (data: string) => {
      stderr += data.toString();
    });

    task.on('close', (code: number) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        const error = new Error(`Command execution failed with code ${code}`);
        reject(error);
      }
    });
  });
});

let nodeTask: ChildProcessWithoutNullStreams | null = null;
let nodeOutput = '';
let isNodeRunning = false;

ipcMain.handle('start-node', async () => {
  const targetDirectory = path.join(RESOURCES_PATH, 'binary');
  nodeTask = spawn(
    getCurrentBinary(),
    [
      'light',
      'start',
      '--core.ip',
      'consensus-validator.celestia-arabica-10.com',
      '--p2p.network',
      'arabica',
    ],
    {
      cwd: targetDirectory,
    }
  );
  isNodeRunning = true;

  nodeTask.stdout.on('data', (data: string) => {
    nodeOutput += data.toString();
  });

  nodeTask.stderr.on('data', (data: string) => {
    nodeOutput += data.toString();
  });
});

ipcMain.handle('stop-node', async () => {
  try {
    if (nodeTask) {
      nodeTask.kill();
      nodeTask = null;
      nodeOutput = '';
      isNodeRunning = false;
      return 'Success';
    }
    return 'Failed';
  } catch {
    return 'Failed';
  }
});

ipcMain.handle('get-node-output', async () => {
  if (nodeOutput.length > 100_000) {
    nodeOutput = nodeOutput.slice(nodeOutput.length - 100_000);
  }
  return nodeOutput;
});

ipcMain.handle('is-node-running', async () => {
  return isNodeRunning;
});

ipcMain.handle('get-sampling-stats', async () => {
  const targetDirectory = path.join(RESOURCES_PATH, 'binary');

  const getAuth = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      let authStdout = '';

      const authTask = spawn(
        getCurrentBinary(),
        ['light', 'auth', 'admin', '--p2p.network', 'arabica'],
        {
          cwd: targetDirectory,
        }
      );

      authTask.stdout.on('data', (data: Buffer) => {
        authStdout = data.toString();
      });

      authTask.on('close', (code: number) => {
        if (code === 0) {
          resolve(authStdout);
        } else {
          resolve(null);
        }
      });
    });
  };

  const auth = await getAuth();

  return new Promise<CelestiaSamplingStats | null>((resolve) => {
    if (auth === null) {
      resolve(null);
      return;
    }
    let stdout = '';
    const task = spawn(
      getCurrentBinary(),
      ['rpc', 'das', 'SamplingStats', '--auth', auth],
      {
        cwd: targetDirectory,
      }
    );

    task.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    task.on('close', (code: number) => {
      if (code === 0) {
        const stats = JSON.parse(stdout);
        resolve(stats);
      } else {
        resolve(null);
      }
    });
  });
});

ipcMain.handle('remove-directory', async (_event, dirPath: string) => {
  const homeDirPath = path.join(homedir(), dirPath);
  await fs.access(homeDirPath);
  await fs.rm(homeDirPath, { recursive: true });
});

ipcMain.handle(
  'show-message-box',
  async (_event, options: MessageBoxSyncOptions) => {
    dialog.showMessageBoxSync(options);
  }
);

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 960,
    minWidth: 1024,
    minHeight: 900,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 15, y: 14 },
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
