import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'; // useRouterをインポート

const LoginForm: React.FC = () => {
  const router = useRouter(); // useRouterフックの使用
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('/auth/sign_in', { email, password });
      localStorage.setItem('access-token', response.headers['access-token']);
      localStorage.setItem('client', response.headers['client']);
      localStorage.setItem('uid', response.headers['uid']);
      alert('ログイン成功！');
      router.push('/'); // リダイレクトをrouter.pushに変更
    } catch (err) {
      setError('ログインに失敗しました。もう一度お試しください。');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">ログイン</button>
    </form>
  );
};

export default LoginForm;
