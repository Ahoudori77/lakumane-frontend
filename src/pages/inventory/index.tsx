import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../lib/api";
import Link from "next/link";
import { Search, ChevronUp, ChevronDown, AlertTriangle } from "lucide-react";

interface InventoryItem {
  id: number;
  name: string;
  shelf_number: string;
  attribute: string;
  manufacturer: string;
  current_quantity: number;
  optimal_quantity: number;
  reorder_threshold: number;
  unit_price: number; // 単価追加
  unit: string;
}

const InventoryList: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof InventoryItem; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchFilters, setSearchFilters] = useState({
    shelfNumber: "",
    attribute: "",
    itemName: "",
    manufacturer: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const authHeaders = {
          "access-token": localStorage.getItem("access-token") || "",
          client: localStorage.getItem("client") || "",
          uid: localStorage.getItem("uid") || "",
        };

        if (!authHeaders.uid) {
          router.push("/login");
          return;
        }

        const response = await api.get("/inventory", {
          headers: authHeaders,
          params: {
            page: currentPage,
            per_page: itemsPerPage,
            ...searchFilters,
          },
        });
        setInventory(response.data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    fetchInventory();
  }, [router, currentPage, searchFilters]);

  const handleSort = (key: keyof InventoryItem) => {
    setSortConfig((prev) => {
      if (prev?.key === key && prev?.direction === "asc") {
        return { key, direction: "desc" };
      }
      return { key, direction: "asc" };
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilters({
      ...searchFilters,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('本当にこのアイテムを削除しますか？');
    if (confirmDelete) {
      try {
        const authHeaders = {
          'access-token': localStorage.getItem('access-token') || '',
          client: localStorage.getItem('client') || '',
          uid: localStorage.getItem('uid') || '',
        };
  
        await api.delete(`/inventory/${id}`, { headers: authHeaders });
        alert('アイテムを削除しました');
  
        // アイテムを一覧から削除
        setInventory((prevInventory) => prevInventory.filter((item) => item.id !== id));
      } catch (error) {
        console.error('削除エラー:', error);
        alert('アイテムの削除に失敗しました');
      }
    }
  };

  return (
    <div className="p-4">
      {/* 検索フィルター */}
      <div className="bg-white p-4 shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">アイテム検索</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {["shelfNumber", "attribute", "itemName", "manufacturer"].map((key) => (
            <div key={key}>
              <label htmlFor={key} className="block text-gray-700">
                {key === "shelfNumber" && "棚番"}
                {key === "attribute" && "属性"}
                {key === "itemName" && "アイテム名"}
                {key === "manufacturer" && "メーカー名"}
              </label>
              <input
                id={key}
                type="text"
                name={key}
                value={searchFilters[key as keyof typeof searchFilters]}
                onChange={handleSearchChange}
                className="w-full border rounded px-2 py-1"
                placeholder={`${key}を入力`}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
          <button
            onClick={() => setCurrentPage(1)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            <Search className="inline h-5 w-5 mr-1" />
            検索
          </button>
        </div>
      </div>

      {/* テーブル */}
      <div className="bg-white p-4 shadow">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">発注状況</th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("shelf_number")}>
                棚番
                {sortConfig?.key === "shelf_number" && (sortConfig.direction === "asc" ? <ChevronUp /> : <ChevronDown />)}
              </th>
              <th className="px-4 py-2">属性</th>
              <th className="px-4 py-2">アイテム名</th>
              <th className="px-4 py-2">メーカー名</th>
              <th className="px-4 py-2">適正在庫数</th>
              <th className="px-4 py-2">現在の在庫数</th>
              <th className="px-4 py-2">単価 (円)</th>
              <th className="px-4 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">
                  {item.current_quantity <= item.reorder_threshold ? (
                    <span className="text-red-600">要発注</span>
                  ) : (
                    <span>在庫あり</span>
                  )}
                </td>
                <td className="px-4 py-2">{item.shelf_number}</td>
                <td className="px-4 py-2">{item.attribute}</td>
                <td className="px-4 py-2">
                  <Link href={`/inventory/${item.id}`} className="text-blue-500 underline">
                    {item.name}
                  </Link>
                </td>
                <td className="px-4 py-2">{item.manufacturer}</td>
                <td className="px-4 py-2">{item.optimal_quantity}</td>
                <td className="px-4 py-2">{item.current_quantity}</td>
                <td className="px-4 py-2">
                  {item.unit_price !== null && item.unit_price !== undefined
                    ? item.unit_price.toLocaleString()
                    : "-"}
                </td>
                <td className="px-4 py-2">
                  <Link href={`/inventory/${item.id}/edit`}>
                    <button className="bg-green-500 text-white px-2 py-1 rounded mr-2">編集</button>
                  </Link>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(item.id)}
                    >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

        {/* ページネーション */}
        <div className="mt-4 flex justify-center items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-200 rounded mr-2"
            disabled={currentPage === 1}
          >
            前へ
          </button>
          <span>ページ {currentPage}</span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-200 rounded ml-2"
            disabled={inventory.length < itemsPerPage}
          >
            次へ
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryList;
