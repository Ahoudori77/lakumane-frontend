import { useEffect, useState } from 'react';
import api from '../../lib/api';

interface Notification {
  id: number;
  message: string;
  category: string;
  read: boolean;
}

const NotificationList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [category, setCategory] = useState<string>('all');

  useEffect(() => {
    fetchNotifications();
  }, [category]);

  const fetchNotifications = async () => {
    const url = category === 'all'
      ? '/notifications'
      : `/notifications?category=${category}`;
    
    const response = await api.get(url);
    setNotifications(response.data);
  };

  const markAsRead = async (id: number) => {
    await api.patch(`/notifications/${id}`, {
      notification: { read: true },
    });
    fetchNotifications();
  };

  return (
    <div>
      <h1>通知一覧</h1>
      
      <div>
        <label>カテゴリフィルタ</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">すべて</option>
          <option value="general">一般</option>
          <option value="stock">在庫</option>
          <option value="order">発注</option>
        </select>
      </div>

      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            <span style={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
              {notification.message} - {notification.category}
            </span>
            {!notification.read && (
              <button onClick={() => markAsRead(notification.id)}>
                既読にする
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
