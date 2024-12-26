import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../../../lib/api';

const EditOrderPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState({
    item_id: '',
    quantity: 1,
    status: 'pending',
    supplier_info: '',
  });

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    const response = await api.get(`/orders/${id}`);
    setOrder(response.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.put(`/orders/${id}`, order);
    router.push('/orders');
  };

  return (
    <div>
      <h1>オーダー編集</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>アイテムID</label>
          <input
            type="text"
            value={order.item_id}
            onChange={(e) => setOrder({ ...order, item_id: e.target.value })}
          />
        </div>
        <div>
          <label>数量</label>
          <input
            type="number"
            value={order.quantity}
            onChange={(e) => setOrder({ ...order, quantity: parseInt(e.target.value, 10) })}
          />
        </div>
        <div>
          <label>ステータス</label>
          <select
            value={order.status}
            onChange={(e) => setOrder({ ...order, status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label>サプライヤー情報</label>
          <input
            type="text"
            value={order.supplier_info}
            onChange={(e) => setOrder({ ...order, supplier_info: e.target.value })}
          />
        </div>
        <button type="submit">更新</button>
      </form>
    </div>
  );
};

export default EditOrderPage;
