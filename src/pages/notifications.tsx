import NotificationsList from '../components/NotificationsList';
import React from 'react';

const NotificationsList = ({ notifications, onMarkAsRead }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <ul className="space-y-4">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className={`p-4 border rounded-lg ${
              notification.read ? 'bg-gray-100' : 'bg-yellow-100'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-medium">{notification.message}</p>
                <p className="text-sm text-gray-500">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
              {!notification.read && (
                <button
                  className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  Mark as Read
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPage;
