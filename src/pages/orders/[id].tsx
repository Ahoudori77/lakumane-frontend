import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { AxiosError } from 'axios';

interface Order {
  id: number;
  quantity: number;
  status: string;
  supplier_info: string;
  item: {
    name: string;
    description: string;
  };
}

const OrderDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ quantity: 0, status: '', supplier_info: '' });

  useEffect(() => {
    if (id) {
      const fetchOrder = async () => {
        try {
          const response = await api.get(`/orders/${id}`);
          setOrder(response.data);
          setFormData({
            quantity: response.data.quantity,
            status: response.data.status,
            supplier_info: response.data.supplier_info,
          });
        } catch (error) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 404) {
            alert('発注が見つかりません。');
            router.push('/orders');
          } else {
            console.error('Error fetching order:', error);
            alert('発注の取得に失敗しました。');
          }
        }
      };
      fetchOrder();
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/orders/${id}`, formData);
      alert('発注が更新されました');
      setEditing(false);
      router.push('/orders');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('更新に失敗しました');
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm('この発注を削除してもよろしいですか？');
    if (confirmDelete) {
      try {
        await api.delete(`/orders/${id}`);
        alert('発注が削除されました');
        router.push('/orders');
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('削除に失敗しました');
      }
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>オーダー詳細</h1>
      {!editing ? (
        <div>
          <p>アイテム名: {order.item.name}</p>
          <p>説明: {order.item.description}</p>
          <p>数量: {order.quantity}</p>
          <p>サプライヤー: {order.supplier_info}</p>
          <p>ステータス: {order.status}</p>
          <button onClick={() => setEditing(true)}>編集</button>
          <button onClick={handleDelete} style={{ marginLeft: '10px' }}>削除</button>
        </div>
      ) : (
        <div>
          <label>
            数量:
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
            />
          </label>
          <label>
            サプライヤー:
            <input
              type="text"
              name="supplier_info"
              value={formData.supplier_info}
              onChange={handleInputChange}
            />
          </label>
          <label>
            ステータス:
            <select name="status" value={formData.status} onChange={handleInputChange}>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <button onClick={handleUpdate}>更新</button>
          <button onClick={() => setEditing(false)} style={{ marginLeft: '10px' }}>キャンセル</button>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
