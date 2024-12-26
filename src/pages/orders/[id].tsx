// pages/orders/[id].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import Link from 'next/link';

interface Order {
  id: number;
  quantity: number;
  status: string;
  item: {
    name: string;
    description: string;
  };
  supplier_info: string;
}

const OrderDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (id) {
      const fetchOrder = async () => {
        try {
          const response = await api.get(`/orders/${id}`);
          setOrder(response.data);
        } catch (error) {
          console.error('Error fetching order:', error);
        }
      };
      fetchOrder();
    }
  }, [id]);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>オーダー詳細</h1>
      <p>アイテム名: {order.item.name}</p>
      <p>説明: {order.item.description}</p>
      <p>数量: {order.quantity}</p>
      <p>サプライヤー: {order.supplier_info}</p>
      <p>ステータス: {order.status}</p>
      <Link href={`/orders/${order.id}/edit`}>
        <button>編集</button>
      </Link>
    </div>

  );
};

export default OrderDetailPage;
