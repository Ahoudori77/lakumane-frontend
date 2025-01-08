import Link from 'next/link';
import { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button onClick={toggleSidebar} className="menu-btn">
        ☰
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav>
          <ul>
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
              <Link href="/notifications">通知</Link>
            </li>
          </ul>
        </nav>
      </div>
      <style jsx>{`
        .menu-btn {
          font-size: 24px;
          background: none;
          border: none;
          cursor: pointer;
        }
        .sidebar {
          position: fixed;
          top: 0;
          left: -250px;
          width: 250px;
          height: 100%;
          background-color: #333;
          color: white;
          transition: left 0.3s;
        }
        .sidebar.open {
          left: 0;
        }
        nav ul {
          list-style: none;
          padding: 20px;
        }
        nav ul li {
          margin: 20px 0;
        }
        nav ul li a {
          color: white;
          text-decoration: none;
          font-size: 18px;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
