import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../../lib/api';

interface Item {
  id: number;
  name: string;
}

const NewOrderPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [supplierInfo, setSupplierInfo] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      const authHeaders = {
        "access-token": localStorage.getItem("access-token") || "",
        client: localStorage.getItem("client") || "",
        uid: localStorage.getItem("uid") || "",
      };

      try {
        const response = await api.get('/items', { headers: authHeaders });
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedItem) {
      alert('アイテムを選択してください');
      return;
    }

    const authHeaders = {
      "access-token": localStorage.getItem("access-token") || "",
      client: localStorage.getItem("client") || "",
      uid: localStorage.getItem("uid") || "",
    };

    try {
      await api.post('/orders', {
        order: {
          item_id: selectedItem,
          quantity,
          supplier_info: supplierInfo,
          status: 'pending'
        }
      }, { headers: authHeaders });

      alert('オーダーを作成しました');
      router.push('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('オーダーの作成に失敗しました');
    }
  };

  return (
    <div>
      <h1>新規オーダー作成</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>アイテム:</label>
          <select onChange={(e) => setSelectedItem(Number(e.target.value))} required>
            <option value="">選択してください</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>数量:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            required
          />
        </div>
        <div>
          <label>サプライヤー情報:</label>
          <input
            type="text"
            value={supplierInfo}
            onChange={(e) => setSupplierInfo(e.target.value)}
            required
          />
        </div>
        <button type="submit">オーダーを作成</button>
      </form>
    </div>
  );
};

export default NewOrderPage;
