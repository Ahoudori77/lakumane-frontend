import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../../lib/api';

interface InventoryItem {
  id: number;
  name: string;
  current_quantity: number;
  optimal_quantity: number;
}

const EditInventoryItem: React.FC = () => {
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/inventory/${id}`);
        setItem(response.data);
      } catch (error) {
        console.error('Error fetching item:', error);
        setError('アイテムが見つかりませんでした。');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!item) return;

    try {
      const response = await api.put(`/inventory/${item.id}`, {
        inventory: item,
      });
      alert('アイテムが更新されました');
      router.push('/inventory'); // 編集後は一覧へリダイレクト
    } catch (error) {
      console.error('Error updating item:', error);
      alert('更新に失敗しました');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!item) return;
    setItem({
      ...item,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>在庫アイテムの編集</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>アイテム名:</label>
          <input
            type="text"
            name="name"
            value={item?.name || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>在庫数:</label>
          <input
            type="number"
            name="current_quantity"
            value={item?.current_quantity || 0}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>最適在庫数:</label>
          <input
            type="number"
            name="optimal_quantity"
            value={item?.optimal_quantity || 0}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">更新</button>
      </form>
    </div>
  );
};

export default EditInventoryItem;
