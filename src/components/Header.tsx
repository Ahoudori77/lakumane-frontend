import { useState } from 'react';

const Header = () => {
  const [user] = useState({ name: '山田太郎' }); // 仮のユーザー情報

  return (
    <div className="header">
      <h1>在庫管理システム</h1>
      <div className="user-info">
        <span>{user.name}</span>
      </div>
      <style jsx>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          background: #f5f5f5;
        }
        .user-info {
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default Header;
