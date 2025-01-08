import { useRouter } from 'next/router';

const Header = () => {
  const router = useRouter();

  const handleLogout = () => {
    alert('ログアウトしました');
    router.push('/login');
  };

  return (
    <header className="header">
      <h1>在庫管理システム</h1>
      <div className="user-info">
        <span>山田太郎</span>
        <button onClick={handleLogout}>ログアウト</button>
      </div>
      <style jsx>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          background-color: #f4f4f4;
        }
        .user-info {
          display: flex;
          align-items: center;
        }
        .user-info span {
          margin-right: 15px;
        }
        button {
          padding: 5px 10px;
          border: none;
          background-color: #d9534f;
          color: white;
          cursor: pointer;
        }
      `}</style>
    </header>
  );
};

export default Header;
