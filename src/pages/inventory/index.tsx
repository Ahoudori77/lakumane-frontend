import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../lib/api";
import Link from "next/link";
import { Search, ChevronUp, ChevronDown } from "lucide-react";

interface InventoryItem {
  id: number;
  name: string;
  shelf_number: string;
  attribute?: string;
  manufacturer?: string;
  current_quantity: number;
  optimal_quantity: number;
  reorder_threshold: number;
  unit_price: number;
  unit: string;
  item?: {
    name: string;
    manufacturer: string;
  };
}

const InventoryList: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof InventoryItem | "発注状況";
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 検索条件と検索入力を分けて管理
  const [searchFilters, setSearchFilters] = useState({
    shelfNumber: "",
    item_attribute: "",
    itemName: "",
    manufacturer: "",
  });

  const [searchInputs, setSearchInputs] = useState({
    shelfNumber: "",
    item_attribute: "",
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

        // 空の値を除外してリクエストパラメータを構築
        const filteredParams = Object.fromEntries(
          Object.entries({
            page: currentPage,
            per_page: itemsPerPage,
            shelf_number: searchFilters.shelfNumber,
            attribute: searchFilters.item_attribute, // 修正箇所
            item_name: searchFilters.itemName,
            manufacturer: searchFilters.manufacturer,
          }).filter(([_, value]) => value !== "") // 空文字列を除外
        );

        const response = await api.get("/inventory", {
          headers: authHeaders,
          params: filteredParams,
        });

        const inventoryData = response.data.data || response.data;
        setInventory(inventoryData);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setInventory([]); // エラー時は空配列を設定
      }
    };

    fetchInventory();
  }, [router, currentPage, searchFilters]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputs({
      ...searchInputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchSubmit = () => {
    setSearchFilters({ ...searchInputs }); // 入力値を検索条件に反映
    setCurrentPage(1); // ページをリセット
  };

  const handleSort = (key: keyof InventoryItem | "発注状況") => {
    setSortConfig((prev) => {
      if (prev?.key === key && prev?.direction === "asc") {
        return { key, direction: "desc" };
      }
      return { key, direction: "asc" };
    });

    const sortedInventory = [...inventory];
    sortedInventory.sort((a, b) => {
      // 発注状況のカスタムソートロジック
      if (key === "発注状況") {
        const aNeedsRestock = a.current_quantity <= a.reorder_threshold ? 1 : 0;
        const bNeedsRestock = b.current_quantity <= b.reorder_threshold ? 1 : 0;
        return sortConfig?.direction === "asc"
          ? aNeedsRestock - bNeedsRestock
          : bNeedsRestock - aNeedsRestock;
      }

      // アイテム名やメーカー名のソートロジック
      if (key === "name" || key === "manufacturer") {
        const aValue = key === "name" ? a.item?.name || "" : a.item?.manufacturer || "";
        const bValue = key === "name" ? b.item?.name || "" : b.item?.manufacturer || "";
        if (aValue < bValue) return sortConfig?.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig?.direction === "asc" ? 1 : -1;
        return 0;
      }

      // 他のフィールドの通常のソートロジック
      const aValue = a[key] || "";
      const bValue = b[key] || "";
      if (aValue < bValue) return sortConfig?.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig?.direction === "asc" ? 1 : -1;
      return 0;
    });

    setInventory(sortedInventory);
  };


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilters({
      ...searchFilters,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("本当にこのアイテムを削除しますか？");
    if (confirmDelete) {
      try {
        const authHeaders = {
          "access-token": localStorage.getItem("access-token") || "",
          client: localStorage.getItem("client") || "",
          uid: localStorage.getItem("uid") || "",
        };

        await api.delete(`/inventory/${id}`, { headers: authHeaders });
        alert("アイテムを削除しました");
        setInventory((prevInventory) => prevInventory.filter((item) => item.id !== id));
      } catch (error) {
        console.error("削除エラー:", error);
        alert("アイテムの削除に失敗しました");
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
                value={searchInputs[key as keyof typeof searchInputs] || ""} // 初期値を空文字列に設定
                onChange={handleSearchInputChange}
                className="w-full border rounded px-2 py-1"
                placeholder={`${key}を入力`}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
          <button
            onClick={handleSearchSubmit} // 検索ボタンで実行
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
              {[
                { key: "発注状況", label: "発注状況" },
                { key: "shelf_number", label: "棚番" },
                { key: "attribute", label: "属性" },
                { key: "name", label: "アイテム名" },
                { key: "manufacturer", label: "メーカー名" },
                { key: "optimal_quantity", label: "適正在庫数" },
                { key: "current_quantity", label: "現在の在庫数" },
                { key: "unit_price", label: "単価 (円)" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort(key as keyof InventoryItem | "発注状況")}
                >
                  {label}
                  {sortConfig?.key === key &&
                    (sortConfig.direction === "asc" ? <ChevronUp /> : <ChevronDown />)}
                </th>
              ))}
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
                <td className="px-4 py-2">{item.shelf_number || "不明"}</td>
                <td className="px-4 py-2">{item.attribute || "不明"}</td>
                <td className="px-4 py-2">{item.item?.name || "不明"}</td>
                <td className="px-4 py-2">{item.item?.manufacturer || "不明"}</td>
                <td className="px-4 py-2">{item.optimal_quantity || "-"}</td>
                <td className="px-4 py-2">{item.current_quantity || "-"}</td>
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
