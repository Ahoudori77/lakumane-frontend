import React, { useEffect, useState } from "react";
import cable from "../lib/cable";
import axios from "axios";

interface Notification {
  id: number;
  message: string;
  read: boolean;
  created_at: string;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // 未読通知件数の取得
    const fetchUnreadCount = async () => {
      try {
        const authHeaders = {
          "access-token": localStorage.getItem("access-token") || "",
          client: localStorage.getItem("client") || "",
          uid: localStorage.getItem("uid") || "",
        };
        const response = await axios.get("/api/v1/notifications/unread_count", { headers: authHeaders });
        setUnreadCount(response.data.unread_count);
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };

    fetchUnreadCount();

    // WebSocketでリアルタイム更新
    const subscription = cable.subscriptions.create(
      { channel: "NotificationsChannel" },
      {
        received: (data: Notification) => {
          setNotifications((prev) => [data, ...prev]);
          setUnreadCount((prev) => prev + 1); // 新しい通知をカウント
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      <button>
        🔔 Notifications ({unreadCount})
      </button>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            {notification.message} - {new Date(notification.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationBell;
