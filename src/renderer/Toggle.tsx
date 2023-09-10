import { twMerge } from 'tailwind-merge';

export default function Toggle({ isOff }: { isOff: boolean }) {
  return (
    <div className="flex">
      <div
        className={twMerge(
          'relative flex justify-center items-center w-12 h-6 rounded-[12px]',
          isOff ? 'bg-gray-300' : 'bg-[#46bf74]'
        )}
      >
        <div
          className={twMerge(
            'w-5 h-5 py-[2px] rounded-full bg-white ease-in-out duration-300',
            isOff ? '-translate-x-[50%]' : 'translate-x-[50%]'
          )}
        />
      </div>
    </div>
  );
}
