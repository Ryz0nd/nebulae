function extractMnemonic(output: string): string | null {
  const keyword = 'MNEMONIC (save this somewhere safe!!!):';
  const outputLines = output.split('\n');
  const lineIndex = outputLines.findIndex((line) => line.includes(keyword));
  if (lineIndex !== -1 && lineIndex + 1 < outputLines.length) {
    const mnemonicLine = outputLines[lineIndex + 1];
    const mnemonic = mnemonicLine.trim();
    return mnemonic;
  }
  return null;
}

function extractAddress(output: string): string | null {
  const keyword = 'ADDRESS:';
  const outputLines = output.split('\n');
  const line = outputLines.find((outputLine) => outputLine.includes(keyword));
  if (line) {
    return line.replace(keyword, '').trim();
  }
  return null;
}

function checkAlreadyInitialized(output: string): boolean {
  const keyword = 'Detected plaintext keyring backend.';
  const keyGeneratedKeyword = 'NEW KEY GENERATED...';
  return output.includes(keyword) && !output.includes(keyGeneratedKeyword);
}

async function initializeNode() {
  try {
    const { stdout, stderr } = await window.electron.initializeNode();

    const mnemonic = extractMnemonic(stdout);
    const address = extractAddress(stdout);

    if (checkAlreadyInitialized(stderr)) {
      window.electron.showMessageBox({
        type: 'info',
        title: 'Already initialized',
        message: 'Already initialized',
      });
    } else if (mnemonic && address) {
      window.electron.showMessageBox({
        type: 'info',
        title: 'Initialization successful',
        message: 'Initialization successful',
        detail: `Mnemonic: ${mnemonic}\nAddress: ${address}`,
      });
    } else {
      window.electron.showMessageBox({
        type: 'error',
        title: 'Initialization failed',
        message: 'Make sure you have installed Celestia',
      });
    }
  } catch (error) {
    const err = error as Error;
    window.electron.showMessageBox({
      type: 'error',
      title: 'Initialization failed',
      message: err.message,
    });
  }
}

export default initializeNode;
