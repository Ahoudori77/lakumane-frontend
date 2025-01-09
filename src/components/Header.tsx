import React from 'react';

interface HeaderProps {
  pageTitle: string;
  toggleSidebar: () => void;
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ pageTitle, toggleSidebar, userName }) => {
  return (
    <header className="bg-white shadow flex items-center justify-between px-4 py-2">
      {/* サイドバートグルボタン */}
      <button onClick={toggleSidebar} className="text-gray-600 focus:outline-none">
        <span className="sr-only">Toggle sidebar</span>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* ページタイトル */}
      <h1 className="text-xl font-semibold">{pageTitle}</h1>

      {/* ユーザー情報 */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">{userName}</span>
        <button className="text-gray-600 focus:outline-none">
          <span className="sr-only">Log out</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
