// pages/orders/[id]/edit.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';

interface Order {
  id: number;
  quantity: number;
  status: string;
  supplier_info: string;
}

const EditOrderPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [status, setStatus] = useState<string>('pending');
  const [supplierInfo, setSupplierInfo] = useState<string>('');

  useEffect(() => {
    if (id) {
      const fetchOrder = async () => {
        try {
          const response = await api.get(`/orders/${id}`);
          const orderData = response.data;
          setOrder(orderData);
          setQuantity(orderData.quantity);
          setStatus(orderData.status);
          setSupplierInfo(orderData.supplier_info);
        } catch (error) {
          console.error('Error fetching order:', error);
        }
      };
      fetchOrder();
    }
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/orders/${id}`, {
        order: {
          quantity,
          status,
          supplier_info: supplierInfo,
        },
      });
      alert('オーダーが更新されました');
      router.push(`/orders/${id}`);  // 詳細ページにリダイレクト
    } catch (error) {
      console.error('Error updating order:', error);
      alert('オーダーの更新に失敗しました');
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>オーダー編集</h1>
      <form onSubmit={handleUpdate}>
        <div>
          <label>数量:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>ステータス:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pending">保留</option>
            <option value="approved">承認済み</option>
            <option value="rejected">拒否</option>
            <option value="completed">完了</option>
          </select>
        </div>
        <div>
          <label>サプライヤー情報:</label>
          <input
            type="text"
            value={supplierInfo}
            onChange={(e) => setSupplierInfo(e.target.value)}
            required
          />
        </div>
        <button type="submit">更新</button>
      </form>
    </div>
  );
};

export default EditOrderPage;
