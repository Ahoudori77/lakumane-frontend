import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Home, List, Clipboard, FileText, LogOut } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  userRole?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, userRole }) => {
  const router = useRouter();

  const menuItems = [
    { href: "/dashboard", label: "ダッシュボード", icon: <Home /> },
    { href: "/inventory", label: "在庫一覧", icon: <List /> },
    { href: "/orders", label: "発注管理", icon: <Clipboard />, roles: ["admin"] },
    { href: "/usage_records", label: "使用履歴", icon: <FileText /> },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50`}
    >
      <div className="flex items-center justify-between px-4 py-4 bg-gray-900">
        <h2 className="text-lg font-bold">メニュー</h2>
        <button className="text-white" onClick={toggleSidebar}>
          ×
        </button>
      </div>
      <ul className="space-y-2 px-4">
        {menuItems
          .filter((item) => !item.roles || (userRole && item.roles.includes(userRole)))
          .map((item) => (
            <li
              key={item.href}
              className={`flex items-center px-2 py-2 rounded ${router.pathname === item.href ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
            >
              <Link href={item.href} className="flex items-center space-x-2">
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
      </ul>
      <div className="absolute bottom-4 left-4">
        <button className="flex items-center space-x-2 text-red-500 hover:text-red-700">
          <LogOut />
          <span>ログアウト</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
