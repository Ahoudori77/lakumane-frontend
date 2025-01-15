import React from 'react';
import { useRouter } from 'next/router';
import api from '../lib/api'; // Axiosインスタンスをインポート

const Dashboard: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.delete("/auth/sign_out", {
        headers: {
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      });
      localStorage.removeItem("access-token");
      localStorage.removeItem("client");
      localStorage.removeItem("uid");
      alert("ログアウトしました！");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("ログアウトに失敗しました。");
    }
  };

  return (
    <div>
      <h1>ダッシュボード</h1>
      <p>ようこそ、ログインしました！</p>
      <nav>
        <ul>
          <li><a href="/inventory">在庫管理</a></li>
          <li><a href="/orders">注文管理</a></li>
          <li><a href="/notifications">通知管理</a></li>
        </ul>
      </nav>
      <button onClick={handleLogout}>ログアウト</button>
    </div>
  );
};

export default Dashboard;
