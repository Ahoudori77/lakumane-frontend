// pages/inventory/[id].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../lib/api';

interface InventoryItem {
  id: number;
  name: string;
  current_quantity: number;
  shelf_number: string;
}

const InventoryDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const response = await api.get(`/inventory/${id}`);
          setItem(response.data);
        } catch (error) {
          console.error('Error fetching item:', error);
        }
      };
      fetchItem();
    }
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = confirm('このアイテムを削除してもよろしいですか？');
    if (confirmDelete && id) {
      try {
        await api.delete(`/inventory/${id}`);
        alert('アイテムが削除されました');
        router.push('/inventory');
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('削除に失敗しました');
      }
    }
  };

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>在庫詳細 - {item.name}</h1>
      <p>数量: {item.current_quantity}</p>
      <p>棚番号: {item.shelf_number}</p>
      <button onClick={() => router.push(`/inventory/${item.id}/edit`)}>編集</button>
      <button onClick={handleDelete} style={{ color: 'red', marginLeft: '10px' }}>
        削除
      </button>
    </div>
  );
};

export default InventoryDetailPage;
