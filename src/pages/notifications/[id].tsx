import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { AxiosError } from 'axios';

interface Notification {
  id: number;
  message: string;
  category: string;
  read: boolean;
}

const NotificationDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (id) {
      fetchNotification(id);
    }
  }, [id]);

  const fetchNotification = async (id: string | string[] | undefined) => {
    try {
      const response = await api.get(`/api/v1/notifications/${id}`);
      setNotification(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        alert('通知が存在しません');
        router.push('/notifications');  // 通知一覧にリダイレクト
      } else {
        console.error('通知の取得に失敗しました:', error);
      }
    }
  };

  if (!notification) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>通知詳細</h1>
      <p><strong>ID:</strong> {notification.id}</p>
      <p><strong>メッセージ:</strong> {notification.message}</p>
      <p><strong>カテゴリ:</strong> {notification.category}</p>
      <p><strong>既読状態:</strong> {notification.read ? '既読' : '未読'}</p>
    </div>
  );
};

export default NotificationDetail;
