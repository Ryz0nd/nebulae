import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import {
  initializeNode,
  deleteDataStore,
  deleteKeyStore,
  deleteNodeStore,
  stopNode,
  startNode,
} from 'core';
import { useEffect, useRef, useState } from 'react';

function Main() {
  const outputEndRef = useRef<HTMLDivElement>(null);
  const [nodeOutput, setNodeOutput] = useState('');

  const scrollToBottom = () => {
    outputEndRef.current?.scrollIntoView({ block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();

    setInterval(() => {
      (async () => {
        const currentNodeOutput = await window.electron.getNodeOutput();
        setNodeOutput(currentNodeOutput);
        scrollToBottom();
      })();
    }, 1000);
  }, []);

  return (
    <div className="layout">
      <button type="button" className="button" onClick={initializeNode}>
        Initialize celestia light node
      </button>
      <button type="button" className="button" onClick={startNode}>
        Start celestia light node
      </button>
      <button type="button" className="button" onClick={stopNode}>
        Stop node
      </button>

      <button type="button" className="button" onClick={deleteDataStore}>
        Delete data store
      </button>
      <button type="button" className="button" onClick={deleteKeyStore}>
        Delete key store
      </button>
      <button type="button" className="button" onClick={deleteNodeStore}>
        Delete entire node store
      </button>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '500px',
          height: '300px',
          maxHeight: '300px',
          overflow: 'auto',
        }}
      >
        <pre style={{ whiteSpace: 'pre-line', margin: 0 }}>{nodeOutput}</pre>
        <div ref={outputEndRef} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}
