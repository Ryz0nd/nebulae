import { deleteDataStore, deleteKeyStore, deleteNodeStore } from 'core';

export default function Account() {
  return (
    <div className="w-full flex h-full flex-col py-5 px-8">
      <h1 className="font-semibold text-3xl text-white">Node Account</h1>
      <h3 className="font-medium text-xl text-white my-4">Danger Zone</h3>
      <div className="flex flex-col rounded border border-[#f8514966]">
        <div className="flex items-center justify-between p-4 border-b border-[#21262d]">
          <div className="flex flex-col">
            <span className="text-gray-100">Delete data store</span>
            <span className="text-sm text-gray-400">
              Your node data will be deleted permanently.
            </span>
          </div>
          <button
            type="button"
            className="flex h-fit bg-[#21262d] border border-[#f0f6fc1a] rounded py-1 px-3 hover:opacity-90"
            onClick={deleteDataStore}
          >
            <span className="text-sm text-[#f85149]">Delete data store</span>
          </button>
        </div>
        <div className="flex items-center justify-between p-4 border-b border-[#21262d]">
          <div className="flex flex-col">
            <span className="text-gray-100">Delete key store</span>
            <span className="text-sm text-gray-400">
              Your key data will be deleted permanently.
              <br />
              Please make sure you have a backup of your mnemonic.
            </span>
          </div>
          <button
            type="button"
            className="flex h-fit shrink-0 bg-[#21262d] border border-[#f0f6fc1a] rounded py-1 px-3 hover:opacity-90"
            onClick={deleteKeyStore}
          >
            <span className="text-sm text-[#f85149]">Delete key store</span>
          </button>
        </div>
        <div className="flex items-center justify-between p-4 border-b border-[#21262d]">
          <div className="flex flex-col">
            <span className="text-gray-100">Delete node store</span>
            <span className="text-sm text-gray-400">
              Your node and key data will be deleted permanently.
            </span>
          </div>
          <button
            type="button"
            className="flex h-fit bg-[#21262d] border border-[#f0f6fc1a] rounded py-1 px-3 hover:opacity-90"
            onClick={deleteNodeStore}
          >
            <span className="text-sm text-[#f85149]">Delete node store</span>
          </button>
        </div>
      </div>
    </div>
  );
}
