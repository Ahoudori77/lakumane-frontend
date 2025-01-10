import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "../../../lib/api";

interface InventoryItem {
  id: number;
  current_quantity: number;
  shelf_number: string;
  optimal_quantity: number;
  reorder_threshold: number;
  unit_price: number;
  unit: string;
  item?: {
    name: string;
    description: string;
  };
}

const EditInventoryPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const response = await api.get(`/inventory/${id}`);
          console.log("取得したデータ:", response.data);

          setFormData({
            ...response.data,
            item: response.data.item || { name: "未設定", description: "未設定" },
          });
          setLoading(false);
        } catch (error) {
          console.error("データ取得エラー:", error);
          alert("データ取得中に問題が発生しました。");
          router.push("/inventory");
        }
      };
      fetchItem();
    }
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => prev && { ...prev, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/inventory/${id}`, {
        inventory: {
          current_quantity: formData?.current_quantity,
          shelf_number: formData?.shelf_number,
          optimal_quantity: formData?.optimal_quantity,
          reorder_threshold: formData?.reorder_threshold,
          unit_price: formData?.unit_price,
          unit: formData?.unit,
        },
      });
      alert("在庫情報が更新されました");
      router.push("/inventory");
    } catch (error) {
      console.error("更新エラー:", error);
      alert("更新に失敗しました。入力値を確認してください。");
    }
  };

  if (loading || !formData) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">在庫編集</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">アイテム名:</label>
          <p className="text-gray-900">{formData.item?.name || "未設定"}</p>
        </div>
        <div>
          <label className="block text-gray-700">説明:</label>
          <p className="text-gray-900">{formData.item?.description || "未設定"}</p>
        </div>
        <div>
          <label className="block text-gray-700">現在の数量:</label>
          <input
            type="number"
            name="current_quantity"
            value={formData.current_quantity || 0}
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
            value={formData.shelf_number || ""}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">適正在庫数:</label>
          <input
            type="number"
            name="optimal_quantity"
            value={formData.optimal_quantity || 0}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">発注閾値:</label>
          <input
            type="number"
            name="reorder_threshold"
            value={formData.reorder_threshold || 0}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">単価 (円):</label>
          <input
            type="number"
            name="unit_price"
            value={formData.unit_price || 0}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-gray-700">単位:</label>
          <input
            type="text"
            name="unit"
            value={formData.unit || ""}
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
