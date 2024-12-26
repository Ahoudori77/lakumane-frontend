// pages/orders/index.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../../lib/api';

interface Order {
  id: number;
  quantity: number;
  status: string;
  supplier_info: string;
  item: {
    name: string;
  };
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

  return (
    <div>
      <h1>発注一覧</h1>
      <Link href="/orders/new">
        <button>新規発注</button>
      </Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>アイテム名</th>
            <th>数量</th>
            <th>サプライヤー</th>
            <th>ステータス</th>
            <th>詳細</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.item.name}</td>
              <td>{order.quantity}</td>
              <td>{order.supplier_info}</td>
              <td>{order.status}</td>
              <td>
                <Link href={`/orders/${order.id}`}>
                  詳細を見る
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
