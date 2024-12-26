import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Item {
  id: number;
  name: string;
  description: string;
  category: {
    name: string;
  };
  current_quantity: number;
  shelf_number: string;
}

const ItemDetailPage: React.FC = () => {
  const [item, setItem] = useState<Item | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  // アイテム情報取得
  useEffect(() => {
    if (id) {
      axios.get(`/api/v1/items/${id}`)
        .then((response) => setItem(response.data))
        .catch(() => setErrorMessage('アイテム情報の取得に失敗しました'));
    }
  }, [id]);

  // 削除処理
  const handleDelete = async () => {
    if (!window.confirm('本当に削除しますか？')) return;

    setIsDeleting(true);
    try {
      await axios.delete(`/api/v1/items/${id}`);
      alert('アイテムが削除されました');
      router.push('/items');
    } catch (error) {
      setErrorMessage('アイテムの削除に失敗しました');
      console.error('Error deleting item:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!item) return <p>Loading...</p>;

  return (
    <div>
      <h1>{item.name}</h1>
      <p>説明: {item.description}</p>
      <p>カテゴリ: {item.category.name}</p>
      <p>在庫数: {item.current_quantity}</p>
      <p>棚番号: {item.shelf_number}</p>

      <button onClick={() => router.push(`/items/${id}/edit`)}>編集</button>
      <button onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? '削除中...' : '削除'}
      </button>
    </div>
  );
};

export default ItemDetailPage;
