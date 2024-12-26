import React, { useEffect, useState } from "react";
import { getUnreadNotifications } from "../services/notifications";

interface Notification {
  id: number;
  message: string;
  read: boolean;
  created_at: string;
}

const UnreadNotificationsList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true); // ローディング状態を追加

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      const authHeaders = {
        'access-token': localStorage.getItem('access-token') || '',
        client: localStorage.getItem('client') || '',
        uid: localStorage.getItem('uid') || '',
      };
    
      if (!authHeaders['access-token'] || !authHeaders.client || !authHeaders.uid) {
        console.error('Missing auth headers. Please log in again.');
        return;
      }
    
      try {
        const data = await getUnreadNotifications(authHeaders);
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching unread notifications:', error);
      }
    };

    fetchUnreadNotifications();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Unread Notifications</h2>
      {notifications.length === 0 ? (
        <p>No unread notifications.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id}>
              {notification.message} -{" "}
              {new Date(notification.created_at).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UnreadNotificationsList;
