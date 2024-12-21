import React, { useState, useEffect } from 'react';
import { getNotifications } from '../services/notifications';

const NotificationHistoryPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const authHeaders = {
          'access-token': localStorage.getItem('access-token') || '',
          client: localStorage.getItem('client') || '',
          uid: localStorage.getItem('uid') || '',
        };
        const data = await getNotifications({ page }, authHeaders);
        setNotifications(data.notifications);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [page]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Notification History</h2>
      <ul>
        {notifications.map((notif) => (
          <li key={notif.id}>
            {notif.message} - {new Date(notif.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
      <div>
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>Previous</button>
        <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
      </div>
    </div>
  );
};

export default NotificationHistoryPage;
