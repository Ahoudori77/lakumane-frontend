import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useRouter } from 'next/router';

interface Item {
  id: number;
  name: string;
}

const NewOrderPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [formData, setFormData] = useState({
    item_id: '',
    quantity: 1,
    status: 'pending',
    supplier_info: '',
  });
  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      const response = await api.get('/items');
      setItems(response.data);
    };
    fetchItems();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/orders', formData);
      alert('発注が作成されました');
      router.push('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('発注の作成に失敗しました');
    }
  };

  return (
    <div>
      <h1>新規発注登録</h1>
      <form onSubmit={handleSubmit}>
        <label>
          アイテム:
          <select name="item_id" value={formData.item_id} onChange={handleInputChange}>
            <option value="">選択してください</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          数量:
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            min="1"
            onChange={handleInputChange}
          />
        </label>
        <label>
          ステータス:
          <select name="status" value={formData.status} onChange={handleInputChange}>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <label>
          サプライヤー情報:
          <input
            type="text"
            name="supplier_info"
            value={formData.supplier_info}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">登録</button>
      </form>
    </div>
  );
};

export default NewOrderPage;
