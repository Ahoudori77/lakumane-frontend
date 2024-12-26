import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Category {
  id: number;
  name: string;
}

const NewItemPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [optimalQuantity, setOptimalQuantity] = useState(0);
  const [reorderThreshold, setReorderThreshold] = useState(0);
  const [shelfNumber, setShelfNumber] = useState('');
  const [unit, setUnit] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [supplierInfo, setSupplierInfo] = useState('');
  const [price, setPrice] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  // カテゴリ一覧取得
  useEffect(() => {
    axios.get('/api/v1/categories')
      .then((response) => setCategories(response.data))
      .catch(() => setErrorMessage('カテゴリの取得に失敗しました'));
  }, []);

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      item: {
        name,
        description,
        category_id: categoryId,
        current_quantity: currentQuantity,
        optimal_quantity: optimalQuantity,
        reorder_threshold: reorderThreshold,
        shelf_number: shelfNumber,
        unit,
        manufacturer,
        supplier_info: supplierInfo,
        price
      }
    };

    try {
      await axios.post('/api/v1/items', newItem);
      alert('アイテムが登録されました');
      router.push('/items');  // 一覧ページへリダイレクト
    } catch (error) {
      setErrorMessage('アイテムの登録に失敗しました');
      console.error('Error creating item:', error);
    }
  };

  return (
    <div>
      <h1>新規アイテム登録</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>名前</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <label>説明</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div>
          <label>カテゴリ</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            <option value="">選択してください</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>在庫数</label>
          <input type="number" value={currentQuantity} onChange={(e) => setCurrentQuantity(Number(e.target.value))} required />
        </div>

        <div>
          <label>最適在庫数</label>
          <input type="number" value={optimalQuantity} onChange={(e) => setOptimalQuantity(Number(e.target.value))} required />
        </div>

        <div>
          <label>発注閾値</label>
          <input type="number" value={reorderThreshold} onChange={(e) => setReorderThreshold(Number(e.target.value))} required />
        </div>

        <div>
          <label>棚番号</label>
          <input value={shelfNumber} onChange={(e) => setShelfNumber(e.target.value)} required />
        </div>

        <div>
          <label>単位</label>
          <input value={unit} onChange={(e) => setUnit(e.target.value)} required />
        </div>

        <div>
          <label>メーカー</label>
          <input value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} required />
        </div>

        <div>
          <label>供給元情報</label>
          <input value={supplierInfo} onChange={(e) => setSupplierInfo(e.target.value)} required />
        </div>

        <div>
          <label>価格</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
        </div>

        <button type="submit">登録</button>
      </form>
    </div>
  );
};

export default NewItemPage;
