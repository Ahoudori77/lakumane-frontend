import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const router = useRouter();

  const menuItems = [
    { path: '/', label: 'ダッシュボード' },
    { path: '/inventory', label: '在庫管理' },
    { path: '/orders', label: '発注管理' },
    { path: '/usage_records', label: '使用履歴' },
  ];

  return (
    <div className="sidebar">
      <h2>メニュー</h2>
      <ul>
        {menuItems.map((item) => (
          <li key={item.path} className={router.pathname === item.path ? 'active' : ''}>
            <Link href={item.path}>{item.label}</Link>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .sidebar {
          width: 250px;
          height: 100vh;
          background: #333;
          color: white;
          padding: 20px;
          position: fixed;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          margin: 20px 0;
        }
        .active {
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
