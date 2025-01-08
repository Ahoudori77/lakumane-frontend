import { useState } from 'react';
import { useRouter } from 'next/router';

const NewNotification = () => {
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, category }),
    });
  
    if (response.ok) {
      alert('通知が作成されました');
      router.push('/notifications');
    } else {
      alert('エラーが発生しました');
    }
  };
  

  return (
    <div>
      <h1>通知作成</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>通知メッセージ</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <div>
          <label>カテゴリ</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="general">一般</option>
            <option value="stock">在庫</option>
            <option value="order">発注</option>
          </select>
        </div>

        <button type="submit">通知を作成</button>
      </form>
    </div>
  );
};

export default NewNotification;
