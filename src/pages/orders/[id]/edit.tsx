import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../../../lib/api';

interface Order {
  id: number;
  item: {
    name: string;
  };
  quantity: number;
  status: string;
  supplier_info: string;
}

const EditOrderPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    quantity: 1,
    status: 'pending',
    supplier_info: '',
  });

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
          console.error('Error fetching order:', error);
        }
      };
      fetchOrder();
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch(`/orders/${id}`, formData);
      alert('発注が更新されました');
      router.push('/orders');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('発注の更新に失敗しました');
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>発注編集</h1>
      <form onSubmit={handleSubmit}>
        <p>アイテム名: {order.item.name}</p>
        <label>
          数量:
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            min="1"
            onChange={handleInputChange}
          />
        </label>
        <label>
          ステータス:
          <select name="status" value={formData.status} onChange={handleInputChange}>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <label>
          サプライヤー情報:
          <input
            type="text"
            name="supplier_info"
            value={formData.supplier_info}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">更新</button>
      </form>
    </div>
  );
};

export default EditOrderPage;
