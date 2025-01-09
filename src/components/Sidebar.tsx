import React from "react";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 z-50`}
    >
      <div className="flex items-center justify-between px-4 py-4 bg-gray-900">
        <h2 className="text-lg font-bold">メニュー</h2>
        <button
          className="text-white"
          onClick={toggleSidebar}
        >
          ×
        </button>
      </div>
      <ul className="space-y-2 px-4">
        <li>
          <Link href="/dashboard">ダッシュボード</Link>
        </li>
        <li>
          <Link href="/inventory">在庫一覧</Link>
        </li>
        <li>
          <Link href="/orders">発注管理</Link>
        </li>
        <li>
          <Link href="/usage_records">使用履歴</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
