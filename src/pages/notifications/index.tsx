// pages/notifications/index.tsx
import { useEffect, useState } from 'react';
import api from '../../lib/api';

interface Notification {
  id: number;
  message: string;
  read: boolean;
}

const NotificationList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const response = await api.get('/notifications');
    setNotifications(response.data);
  };

  const markAsRead = async (id: number) => {
    await api.patch(`/notifications/${id}`, { notification: { read: true } });
    fetchNotifications();  // 再取得してリストを更新
  };

  return (
    <div>
      <h1>通知一覧</h1>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            <span style={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
              {notification.message}
            </span>
            {!notification.read && (
              <button onClick={() => markAsRead(notification.id)}>既読にする</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
