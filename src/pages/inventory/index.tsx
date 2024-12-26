import React, { useEffect, useState } from 'react';
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
  const router = useRouter();

  useEffect(() => {
    const fetchInventory = async () => {
      const authHeaders = {
        "access-token": localStorage.getItem("access-token") || "",
        client: localStorage.getItem("client") || "",
        uid: localStorage.getItem("uid") || "",
      };

      // 認証情報が不足している場合はログインページへリダイレクト
      if (!authHeaders.uid) {
        router.push("/login");  // ログインページへリダイレクト
        return;
      }

      try {
        const response = await api.get('/inventory', {
          headers: authHeaders,  // 認証情報を追加
        });
        setInventory(response.data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, [router]);

  const handleDelete = async (id: number) => {
    const authHeaders = {
      "access-token": localStorage.getItem("access-token") || "",
      client: localStorage.getItem("client") || "",
      uid: localStorage.getItem("uid") || "",
    };

    const confirmDelete = confirm('このアイテムを削除しますか？');
    if (!confirmDelete) return;

    try {
      await api.delete(`/inventory/${id}`, { headers: authHeaders });
      setInventory((prev) => prev.filter(item => item.id !== id));
      alert('アイテムが削除されました。');
    } catch (error: any) {
      if (error.response?.status === 422) {
        alert('在庫が残っているため削除できません。');
      } else {
        alert('削除に失敗しました。');
      }
    }
  };


  return (
    <div>
      <h1>在庫管理</h1>
      <ul>
        {inventory.map((item) => (
          <li key={item.id}>
            <Link href={`/inventory/${item.id}`}>
              {item.name} (在庫: {item.current_quantity})
            </Link>
            <Link href={`/inventory/${item.id}/edit`}>
              <button>編集</button>
            </Link>
            {item.current_quantity === 0 && (
              <button onClick={() => handleDelete(item.id)}>削除</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryList;
