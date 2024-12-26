// pages/orders/index.tsx
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import Link from 'next/link';

interface Order {
  id: number;
  item: { name: string };
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
    if (window.confirm('本当にこのオーダーを削除しますか？')) {
      try {
        await api.delete(`/orders/${id}`);
        setOrders(orders.filter((order) => order.id !== id));  // 削除後に一覧を更新
        alert('オーダーが削除されました');
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('削除に失敗しました');
      }
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/orders/export_csv', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'orders.csv';
      a.click();
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  return (
    <div>
      <h1>オーダー一覧</h1>
      <button onClick={handleExportCSV}>CSVエクスポート</button>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.item.name} - {order.quantity} 個 ({order.status})
            <Link href={`/orders/${order.id}/edit`}>
              <button>編集</button>
            </Link>
            <button onClick={() => handleDelete(order.id)} style={{ marginLeft: '10px', color: 'red' }}>
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersPage;
