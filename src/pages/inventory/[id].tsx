import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../lib/api';

interface InventoryItem {
  id: number;
  name: string;
  description: string;
  current_quantity: number;
  optimal_quantity: number;
  manufacturer: string;
  supplier_info: string;
  price: number;
}

const InventoryDetail: React.FC = () => {
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    const fetchItemDetail = async () => {
      const authHeaders = {
        'access-token': localStorage.getItem('access-token') || '',
        client: localStorage.getItem('client') || '',
        uid: localStorage.getItem('uid') || '',
      };

      if (!authHeaders.uid) {
        router.push('/login');  // ログインしていない場合はリダイレクト
        return;
      }

      try {
        const response = await api.get(`/inventory/${id}`, {
          headers: authHeaders,
        });
        setItem(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching item details:', err);
        setError('アイテム情報の取得に失敗しました。');
        setLoading(false);
      }
    };

    fetchItemDetail();
  }, [id, router]);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!item) {
    return <div>アイテムが見つかりませんでした。</div>;
  }

  return (
    <div>
      <h1>{item.name}</h1>
      <p>説明: {item.description}</p>
      <p>在庫数: {item.current_quantity}</p>
      <p>最適在庫数: {item.optimal_quantity}</p>
      <p>製造元: {item.manufacturer}</p>
      <p>仕入先情報: {item.supplier_info}</p>
      <p>価格: ¥{item.price.toLocaleString()}</p>

      <button onClick={() => router.push('/inventory')}>戻る</button>
    </div>
  );
};

export default InventoryDetail;
