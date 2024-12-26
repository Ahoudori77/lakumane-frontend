import React, { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../lib/api';

interface FormData {
  name: string;
  description: string;
  current_quantity: number;
  optimal_quantity: number;
  manufacturer: string;
  supplier_info: string;
  price: number;
}

const NewInventoryItem: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    current_quantity: 0,
    optimal_quantity: 0,
    manufacturer: '',
    supplier_info: '',
    price: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'current_quantity' || name === 'optimal_quantity' || name === 'price'
        ? parseInt(value, 10)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const authHeaders = {
      'access-token': localStorage.getItem('access-token') || '',
      client: localStorage.getItem('client') || '',
      uid: localStorage.getItem('uid') || '',
    };

    try {
      await api.post('/inventory', formData, {
        headers: authHeaders,
      });
      alert('在庫アイテムが追加されました。');
      router.push('/inventory');
    } catch (err) {
      console.error('Error creating inventory item:', err);
      setError('在庫アイテムの追加に失敗しました。');
    }
  };

  return (
    <div>
      <h1>新規在庫アイテム追加</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>名前:</label>
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
          <label>在庫数:</label>
          <input
            type="number"
            name="current_quantity"
            value={formData.current_quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>最適在庫数:</label>
          <input
            type="number"
            name="optimal_quantity"
            value={formData.optimal_quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>メーカー:</label>
          <input
            type="text"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>仕入先情報:</label>
          <input
            type="text"
            name="supplier_info"
            value={formData.supplier_info}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>価格:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">追加</button>
        <button type="button" onClick={() => router.push('/inventory')}>
          キャンセル
        </button>
      </form>
    </div>
  );
};

export default NewInventoryItem;
