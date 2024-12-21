import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const getNotifications = async (authHeaders: Record<string, string>) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notifications`, {
      headers: authHeaders,
    });
    return response.data; // 通知データを返す
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};
export const markNotificationAsRead = async (id: number, authHeaders: Record<string, string>) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/notifications/${id}`, {}, { headers: authHeaders });
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const getUnreadNotifications = async (authHeaders: Record<string, string>) => {
  const response = await axios.get('/api/v1/notifications/unread', {
    headers: authHeaders,
  });
  return response.data;
};
