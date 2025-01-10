import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { AxiosError } from 'axios';

interface InventoryItem {
  id: number;
  name: string;
  description: string;
  current_quantity: number;
  shelf_number: string;
}

const EditInventoryPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState<InventoryItem>({
    id: 0,
    name: '',
    description: '',
    current_quantity: 0,
    shelf_number: '',
  });

  const [loading, setLoading] = useState(true);

  // アイテムデータを取得してフォームにセット
  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const response = await api.get(`/inventory/${id}`);
          setFormData(response.data);
          setLoading(false);
        } catch (error) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 404) {
            alert('在庫が見つかりません。');
          } else {
            alert('在庫の取得中にエラーが発生しました。');
          }
          router.push('/inventory');
        }
      };
      fetchItem();
    }
  }, [id, router]);

  // フォームの変更をハンドリング
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // フォームの送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/inventory/${id}`, {
        inventory: {
          quantity: formData.current_quantity,
          name: formData.name,
          description: formData.description,
          shelf_number: formData.shelf_number,
        },
      });
      alert('アイテムが更新されました');
      router.push('/inventory');
    } catch (error) {
      console.error('更新エラー:', error);
      alert('更新に失敗しました。入力値を確認してください。');
    }
  };
  

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">在庫編集 - {formData.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">アイテム名:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">説明:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">数量:</label>
          <input
            type="number"
            name="current_quantity"
            value={formData.current_quantity}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">棚番号:</label>
          <input
            type="text"
            name="shelf_number"
            value={formData.shelf_number}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          更新
        </button>
      </form>
    </div>
  );
};

export default EditInventoryPage;
