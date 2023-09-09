async function deleteDataStore() {
  const dataPath = '/.celestia-light-arabica-10/data';

  try {
    await window.electron.removeDirectory(dataPath);
    window.electron.showMessageBox({
      type: 'info',
      title: 'Success',
      message: 'Data store deletion successful',
    });
  } catch (err) {
    const error = err as Error;
    window.electron.showMessageBox({
      type: 'error',
      title: 'Error',
      message: 'Data store deletion failed',
      detail: error.message,
    });
  }
}

async function deleteKeyStore() {
  const keyPath = '/.celestia-light-arabica-10/keys';

  try {
    await window.electron.removeDirectory(keyPath);
    window.electron.showMessageBox({
      type: 'info',
      title: 'Success',
      message: 'Key store deletion successful',
    });
  } catch (err) {
    const error = err as Error;
    window.electron.showMessageBox({
      type: 'error',
      title: 'Error',
      message: 'Key store deletion failed',
      detail: error.message,
    });
  }
}

async function deleteNodeStore() {
  const nodePath = '/.celestia-light-arabica-10';

  try {
    await window.electron.removeDirectory(nodePath);
    window.electron.showMessageBox({
      type: 'info',
      title: 'Success',
      message: 'Node store deletion successful',
    });
  } catch (err) {
    const error = err as Error;
    window.electron.showMessageBox({
      type: 'error',
      title: 'Error',
      message: 'Node store deletion failed',
      detail: error.message,
    });
  }
}

export { deleteDataStore, deleteKeyStore, deleteNodeStore };
