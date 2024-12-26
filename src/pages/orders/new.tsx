// pages/orders/new.tsx
import { useState } from 'react';
import api from '../../lib/api';
import { useRouter } from 'next/router';

const NewOrderPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    item_id: '',
    quantity: 1,
    supplier_info: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/orders', formData);
      alert('発注が完了しました');
      router.push('/orders');  // 発注一覧にリダイレクト
    } catch (error) {
      console.error('Error creating order:', error);
      alert('発注に失敗しました');
    }
  };

  return (
    <div>
      <h1>新規発注</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>アイテムID:</label>
          <input
            type="text"
            name="item_id"
            value={formData.item_id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>数量:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        <div>
          <label>サプライヤー情報:</label>
          <input
            type="text"
            name="supplier_info"
            value={formData.supplier_info}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">発注</button>
      </form>
    </div>
  );
};

export default NewOrderPage;
