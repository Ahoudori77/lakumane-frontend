import { useState, useEffect } from 'react';
import api from '../../lib/api';
import Link from 'next/link';

interface Order {
  id: number;
  item: {
    name: string;
  };
  quantity: number;
  status: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('本当に削除しますか？');
    if (confirmDelete) {
      try {
        await api.delete(`/orders/${id}`);
        alert('発注が削除されました');
        setOrders(orders.filter((order) => order.id !== id));
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('削除に失敗しました');
      }
    }
  };

  return (
    <div>
      <h1>発注一覧</h1>
      <Link href="/orders/new">
        <button>新規作成</button>
      </Link>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.item.name} - 数量: {order.quantity} - ステータス: {order.status}
            <Link href={`/orders/${order.id}/edit`}>
              <button>編集</button>
            </Link>
            <button onClick={() => handleDelete(order.id)} style={{ marginLeft: '10px' }}>
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersPage;
