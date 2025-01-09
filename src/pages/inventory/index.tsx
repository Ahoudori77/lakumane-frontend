import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../lib/api';
import Link from 'next/link';

interface InventoryItem {
  id: number;
  name: string;
  current_quantity: number;
  optimal_quantity: number;
}

const InventoryList: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof InventoryItem; direction: 'asc' | 'desc' } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchInventory = async () => {
      const authHeaders = {
        "access-token": localStorage.getItem("access-token") || "",
        client: localStorage.getItem("client") || "",
        uid: localStorage.getItem("uid") || "",
      };

      if (!authHeaders.uid) {
        router.push("/login");
        return;
      }

      try {
        const response = await api.get('/inventory', { headers: authHeaders });
        setInventory(response.data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, [router]);

  const handleSort = (key: keyof InventoryItem) => {
    setSortConfig((prev) => {
      if (prev?.key === key && prev?.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedItems = useMemo(() => {
    if (!sortConfig) return inventory;
    const sorted = [...inventory].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [inventory, sortConfig]);

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm('このアイテムを削除しますか？');
    if (!confirmDelete) return;

    try {
      await api.delete(`/inventory/${id}`);
      setInventory((prev) => prev.filter(item => item.id !== id));
      alert('アイテムが削除されました。');
    } catch (error) {
      alert('削除に失敗しました。');
    }
  };

  return (
    <div>
      <h1>在庫管理</h1>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>
              アイテム名 {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('current_quantity')}>
              現在の在庫数 {sortConfig?.key === 'current_quantity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('optimal_quantity')}>
              適正在庫数 {sortConfig?.key === 'optimal_quantity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item) => (
            <tr key={item.id}>
              <td>
                <Link href={`/inventory/${item.id}`}>
                  {item.name}
                </Link>
              </td>
              <td>{item.current_quantity}</td>
              <td>{item.optimal_quantity}</td>
              <td>
                <Link href={`/inventory/${item.id}/edit`}>
                  <button>編集</button>
                </Link>
                {item.current_quantity === 0 && (
                  <button onClick={() => handleDelete(item.id)}>削除</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryList;
