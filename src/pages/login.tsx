import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Next.jsのrouterを使用
import api from '../lib/api'; // Axiosインスタンスをインポート

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>(""); // メールアドレスの状態管理
  const [password, setPassword] = useState<string>(""); // パスワードの状態管理
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/sign_in", { email, password });
  
      if (typeof window !== "undefined") {
        localStorage.setItem("access-token", response.headers["access-token"]);
        localStorage.setItem("client", response.headers["client"]);
        localStorage.setItem("uid", response.headers["uid"]);
      }
  
      console.log("Login successful:", response.data);
      alert("ログイン成功!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error logging in:", error.response?.data || error.message);
      alert("ログインに失敗しました: " + (error.response?.data?.errors?.join(", ") || error.message));
    }
  };

  return (
    <div>
      <h1>ログイン</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // ページリロードを防ぐ
          handleLogin();
        }}
      >
        <div>
          <label>メールアドレス:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>パスワード:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
};

export default LoginPage;
