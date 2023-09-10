import { useNavigate, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import celestiaLogo from '../../assets/celestia-logo.svg';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';
  const isAccountPage = location.pathname === '/account';

  return (
    <nav className="relative flex flex-col w-[240px] h-full bg-[#111318] px-4 border-r border-solid border-[#181a20] shrink-0 py-4">
      <img src={celestiaLogo} alt="Celestia" width="180" className="mb-8" />
      <button
        type="button"
        className="flex px-3 py-2"
        onClick={() => navigate('/')}
      >
        <span
          className={twMerge(
            'text-base font-semibold text-gray-400 hover:text-gray-100',
            isHomePage && 'text-gray-100'
          )}
        >
          Celestia Node
        </span>
      </button>
      <button
        type="button"
        className="flex px-3 py-2"
        onClick={() => navigate('/account')}
      >
        <span
          className={twMerge(
            'text-base font-semibold text-gray-400 hover:text-gray-100',
            isAccountPage && 'text-gray-100'
          )}
        >
          Node Account
        </span>
      </button>
      <div className="absolute pl-4 flex items-center left-0 bottom-0 right-0 h-7 border-t border-[#282a2f]">
        <span className="text-xs font-medium text-gray-400 left-4">
          arabica-10
        </span>
      </div>
    </nav>
  );
}
