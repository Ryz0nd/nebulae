import { useState } from 'react';
import useInterval from './useInterval';

export default function useNodeState() {
  const [isNodeRunning, setIsNodeRunning] = useState(false);

  useInterval(() => {
    (async () => {
      const currentIsNodeRunning = await window.electron.isNodeRunning();
      setIsNodeRunning(currentIsNodeRunning);
    })();
  }, 1_000);

  return { isNodeRunning };
}
