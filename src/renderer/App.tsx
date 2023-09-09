import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import {
  initializeNode,
  deleteDataStore,
  deleteKeyStore,
  deleteNodeStore,
} from 'core';

function Main() {
  return (
    <div className="layout">
      <button type="button" className="button" onClick={initializeNode}>
        Initialize celestia light node
      </button>
      <button type="button" className="button">
        Start celestia light node
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
