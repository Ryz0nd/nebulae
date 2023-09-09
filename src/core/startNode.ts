function startNode() {
  try {
    window.electron.startNode();
  } catch {
    window.electron.showMessageBox({
      type: 'error',
      title: 'Error',
      message: 'Node start failed',
    });
  }
}

async function stopNode() {
  const code = await window.electron.stopNode();
  if (code === 'Failed') {
    window.electron.showMessageBox({
      type: 'error',
      title: 'Error',
      message: 'Node stop failed',
    });
  }
}

export { startNode, stopNode };
