import React, { useEffect, useState } from "react";
import cable from "../lib/cable";
import { getUnreadNotifications } from "../services/notifications";

interface Notification {
  id: number;
  message: string;
  read: boolean;
  created_at: string;
}

const UnreadNotificationsList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notifications from the server
  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      const authHeaders = {
        "access-token": localStorage.getItem("access-token") || "",
        client: localStorage.getItem("client") || "",
        uid: localStorage.getItem("uid") || "",
      };

      try {
        const data = await getUnreadNotifications(authHeaders);
        setNotifications(data);
        setUnreadCount(data.length);
      } catch (error) {
        console.error("Error fetching unread notifications:", error);
      }
    };

    fetchUnreadNotifications();
  }, []);

  // Subscribe to WebSocket notifications
  useEffect(() => {
    const subscription = cable.subscriptions.create(
      { channel: "NotificationsChannel" },
      {
        received: (data: Notification) => {
          setNotifications((prev) => [data, ...prev]);
          setUnreadCount((prev) => prev + 1);
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      <h2>Unread Notifications</h2>
      <button>
        🔔 Notifications ({unreadCount})
      </button>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            {notification.message} -{" "}
            {new Date(notification.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UnreadNotificationsList;
