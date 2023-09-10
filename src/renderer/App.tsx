import './App.css';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import useNodeState from 'hooks/useNodeState';
import { stopNode } from 'core';
import Sidebar from './Sidebar';
import Main from './Main';
import Account from './Account';

export default function App() {
  const { isNodeRunning } = useNodeState();

  return (
    <Router>
      <div className="w-full min-h-screen flex flex-col">
        <header
          className={twMerge(
            'relative flex justify-center items-center w-full h-11 border-b border-solid border-[#282a2f] bg-[#07090d]',
            isNodeRunning && 'bg-[#40b06b]'
          )}
        >
          <p
            className={twMerge(
              'text-sm font-medium text-gray-400 rounded border border-solid border-[#282a2f] px-3 pt-[3px] pb-[2px]',
              isNodeRunning && 'text-gray-100 border-gray-100'
            )}
          >
            {isNodeRunning
              ? 'Light node is running'
              : 'Light node is not running'}
          </p>
          {isNodeRunning && (
            <button
              type="button"
              id="nodrag"
              onClick={stopNode}
              className="absolute bg-[#df5757] top-[50%] translate-y-[-50%] right-4 rounded px-3 pb-[1px]"
            >
              <span className="text-sm font-normal text-gray-100">
                Stop node
              </span>
            </button>
          )}
        </header>
        <div className="w-full h-full flex">
          <Sidebar />
          <main className="flex flex-col w-[calc(100vw-240px)] h-full">
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/account" element={<Account />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
