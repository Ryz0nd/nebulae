// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import {
  contextBridge,
  ipcRenderer,
  IpcRendererEvent,
  MessageBoxSyncOptions,
} from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },

  // OS
  isIntelMac: process.platform === 'darwin' && process.arch === 'x64',
  isAppleSiliconMac: process.platform === 'darwin' && process.arch === 'arm64',
  isWindows: process.platform === 'win32',
  isLinux: process.platform === 'linux',

  // Utils
  async initializeNode(): Promise<{ stdout: string; stderr: string }> {
    return ipcRenderer.invoke('initialize-node');
  },

  async showMessageBox(options: MessageBoxSyncOptions) {
    return ipcRenderer.invoke('show-message-box', options);
  },

  async removeDirectory(dirPath: string) {
    return ipcRenderer.invoke('remove-directory', dirPath);
  },

  async startNode() {
    return ipcRenderer.invoke('start-node');
  },

  async stopNode(): Promise<'Success' | 'Failed'> {
    return ipcRenderer.invoke('stop-node');
  },

  async getNodeOutput(): Promise<string> {
    return ipcRenderer.invoke('get-node-output');
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
