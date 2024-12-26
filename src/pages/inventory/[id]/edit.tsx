// pages/inventory/[id]/edit.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';

interface InventoryItem {
  id: number;
  name: string;
  description: string;
  current_quantity: number;
  shelf_number: string;
}

const EditInventoryPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    current_quantity: 0,
    shelf_number: '',
  });

  // アイテムデータを取得してフォームにセット
  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const response = await api.get(`/inventory/${id}`);
          setItem(response.data);
          setFormData({
            name: response.data.name,
            description: response.data.description,
            current_quantity: response.data.current_quantity,
            shelf_number: response.data.shelf_number,
          });
        } catch (error) {
          console.error('Error fetching item:', error);
        }
      };
      fetchItem();
    }
  }, [id]);

  // フォームの変更をハンドリング
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // フォームの送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/inventory/${id}`, formData);
      alert('アイテムが更新されました');
      router.push(`/inventory/${id}`);
    } catch (error) {
      console.error('Error updating item:', error);
      alert('更新に失敗しました');
    }
  };

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>在庫編集 - {item.name}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>アイテム名:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>説明:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>数量:</label>
          <input
            type="number"
            name="current_quantity"
            value={formData.current_quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>棚番号:</label>
          <input
            type="text"
            name="shelf_number"
            value={formData.shelf_number}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">更新</button>
      </form>
    </div>
  );
};

export default EditInventoryPage;
