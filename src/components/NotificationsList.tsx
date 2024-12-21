import React, { useEffect, useState } from 'react';
import { getNotifications, markNotificationAsRead } from '../services/notifications';
import cable from '../lib/cable';

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const authHeaders = {
          'access-token': localStorage.getItem('access-token') || '',
          client: localStorage.getItem('client') || '',
          uid: localStorage.getItem('uid') || '',
        };

        const data = await getNotifications(authHeaders);
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Setup WebSocket subscription
    const subscription = cable.subscriptions.create(
      { channel: 'NotificationsChannel' },
      {
        received: (data) => {
          setNotifications((prev) => [data, ...prev]);
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const authHeaders = {
        'access-token': localStorage.getItem('access-token') || '',
        client: localStorage.getItem('client') || '',
        uid: localStorage.getItem('uid') || '',
      };
      await markNotificationAsRead(id, authHeaders);
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li
            key={notification.id}
            style={{
              fontWeight: notification.read ? 'normal' : 'bold',
              textDecoration: notification.read ? 'line-through' : 'none',
            }}
          >
            {notification.message} - {new Date(notification.created_at).toLocaleString()}
            {!notification.read && (
              <button onClick={() => handleMarkAsRead(notification.id)}>Mark as Read</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsList;
