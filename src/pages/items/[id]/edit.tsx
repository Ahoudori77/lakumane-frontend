import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface ItemFormData {
  name: string;
  description: string;
  category_id: number;
  current_quantity: number;
  optimal_quantity: number;
  reorder_threshold: number;
  shelf_number: string;
  unit: string;
  manufacturer: string;
  supplier_info: string;
  price: number;
}

const ItemEditPage: React.FC = () => {
  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    description: '',
    category_id: 1,
    current_quantity: 0,
    optimal_quantity: 0,
    reorder_threshold: 0,
    shelf_number: '',
    unit: '',
    manufacturer: '',
    supplier_info: '',
    price: 0,
  });

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { id } = router.query;

  // アイテム情報を取得してフォームにセット
  useEffect(() => {
    if (id) {
      axios.get(`/api/v1/items/${id}`)
        .then((response) => setFormData(response.data))
        .catch(() => setErrorMessage('アイテム情報の取得に失敗しました'));

      // カテゴリー一覧も取得
      axios.get('/api/v1/categories')
        .then((response) => setCategories(response.data))
        .catch(() => setErrorMessage('カテゴリの取得に失敗しました'));
    }
  }, [id]);

  // フォームの入力ハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(`/api/v1/items/${id}`, formData);
      alert('アイテムが更新されました');
      router.push(`/items/${id}`);
    } catch (error) {
      setErrorMessage('アイテムの更新に失敗しました');
      console.error('Error updating item:', error);
    }
  };

  return (
    <div>
      <h1>アイテム編集</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>アイテム名:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>説明:</label>
          <input type="text" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <label>カテゴリ:</label>
          <select name="category_id" value={formData.category_id} onChange={handleChange} required>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>現在の在庫:</label>
          <input type="number" name="current_quantity" value={formData.current_quantity} onChange={handleChange} required />
        </div>
        <div>
          <label>最適在庫:</label>
          <input type="number" name="optimal_quantity" value={formData.optimal_quantity} onChange={handleChange} required />
        </div>
        <div>
          <label>発注閾値:</label>
          <input type="number" name="reorder_threshold" value={formData.reorder_threshold} onChange={handleChange} required />
        </div>
        <div>
          <label>棚番号:</label>
          <input type="text" name="shelf_number" value={formData.shelf_number} onChange={handleChange} required />
        </div>
        <div>
          <label>メーカー:</label>
          <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} required />
        </div>
        <div>
          <label>供給元情報:</label>
          <input type="text" name="supplier_info" value={formData.supplier_info} onChange={handleChange} required />
        </div>
        <div>
          <label>価格:</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        </div>
        <button type="submit">更新</button>
      </form>
    </div>
  );
};

export default ItemEditPage;
