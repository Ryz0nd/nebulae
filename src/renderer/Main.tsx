import { initializeNode, startNode, stopNode } from 'core';
import useInterval from 'hooks/useInterval';
import useNodeState from 'hooks/useNodeState';
import { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { CelestiaSamplingStats } from 'types';
import Toggle from './Toggle';

const calculatePercentage = (value: number, total: number) =>
  Math.round((value / total) * 100);

export default function Main() {
  const outputEndRef = useRef<HTMLDivElement>(null);
  const [nodeOutput, setNodeOutput] = useState('');
  const [samplingStats, setSamplingStats] =
    useState<CelestiaSamplingStats | null>(null);

  const { isNodeRunning } = useNodeState();

  useInterval(() => {
    const scrollToBottom = () => {
      outputEndRef.current?.scrollIntoView({ block: 'end' });
    };

    (async () => {
      const currentNodeOutput = await window.electron.getNodeOutput();
      setNodeOutput(currentNodeOutput);
      scrollToBottom();
    })();
  }, 1_000);

  useInterval(
    () => {
      (async () => {
        const currentSamplingStats = await window.electron.getSamplingStats();
        setSamplingStats(currentSamplingStats);
      })();
    },
    isNodeRunning ? 2_000 : null
  );

  const sampledChainHead = `${
    samplingStats === null
      ? '0'
      : calculatePercentage(
          samplingStats.result.head_of_sampled_chain,
          samplingStats.result.network_head_height
        )
  }%`;

  const catchupHead = `${
    samplingStats === null
      ? '0'
      : calculatePercentage(
          samplingStats.result.head_of_catchup,
          samplingStats.result.network_head_height
        )
  }%`;

  return (
    <div className="w-full flex h-full flex-col py-5 px-8">
      <h1 className="font-semibold text-3xl text-white">Run a Light Node</h1>
      <div className="flex gap-4 mt-6">
        <button
          type="button"
          className="flex w-[250px] bg-[#505163] rounded h-[80px] p-4 shadow-[rgba(72,75,81,0.15)_0px_1px_0px_0px_inset]"
          onClick={initializeNode}
        >
          <span className="text-gray-100">Initialize light node</span>
        </button>
        <button
          type="button"
          className={twMerge(
            'relative flex w-[250px] bg-[#5a72c7] rounded h-[80px] p-4 shadow-[rgba(72,75,81,0.15)_0px_1px_0px_0px_inset]'
          )}
          onClick={isNodeRunning ? stopNode : startNode}
        >
          <span className="text-gray-100">
            {isNodeRunning ? 'Stop light node' : 'Start light node'}
          </span>
          <div className="absolute bottom-4 right-4">
            <Toggle isOff={!isNodeRunning} />
          </div>
        </button>
      </div>

      <h3 className="font-medium text-xl text-white my-4">
        DASer Sampling Statistics
      </h3>
      <div className="flex flex-col w-[500px] rounded bg-[#2a2d34] p-4">
        <p className="text-white text-md font-semibold mb-1">
          Sampled Chain Head
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{
              width: sampledChainHead,
            }}
          />
        </div>
        <p className="text-white text-sm font-medium mt-1 ml-auto">{`${sampledChainHead} (${
          samplingStats?.result.head_of_sampled_chain ?? 0
        } / ${samplingStats?.result.network_head_height ?? 0})`}</p>
        <p className="text-white text-md font-semibold mb-1">Catchup Head</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{
              width: catchupHead,
            }}
          />
        </div>
        <p className="text-white text-sm font-medium mt-1 ml-auto">{`${catchupHead} (${
          samplingStats?.result.head_of_sampled_chain ?? 0
        } / ${samplingStats?.result.network_head_height ?? 0})`}</p>
      </div>

      <h3 className="font-medium text-xl text-white my-4">Logs</h3>
      <div className="flex flex-col w-full h-[400px] overflow-auto bg-black rounded p-4">
        <pre className="whitespace-pre-line break-words text-[#a8b6c1]">
          {nodeOutput}
        </pre>
        <div ref={outputEndRef} />
      </div>
    </div>
  );
}
