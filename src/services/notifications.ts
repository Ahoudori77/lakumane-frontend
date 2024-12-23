import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

/**
 * 通知一覧を取得する
 * @param authHeaders 認証ヘッダー
 */
export const getNotifications = async (page: number, authHeaders: Record<string, string>) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notifications`, {
      headers: authHeaders,
      params: { page }, // ページ番号をリクエストパラメータとして追加
    });
    return response.data; // 通知データを返す
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * 通知を既読にする
 * @param id 通知ID
 * @param authHeaders 認証ヘッダー
 */
export const markNotificationAsRead = async (id: number, authHeaders: Record<string, string>) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/notifications/${id}`, {}, { headers: authHeaders });
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw new Error('Failed to mark notification as read.');
  }
};

/**
 * 未読通知を取得する
 * @param authHeaders 認証ヘッダー
 */
export const getUnreadNotifications = async (authHeaders: Record<string, string>) => {
  try {
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('authHeaders:', authHeaders);

    const response = await axios.get(`${API_BASE_URL}/notifications/unread`, { headers: authHeaders });
    return response.data;
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    throw error;
  }
};

/**
 * 未読通知件数を取得する
 * @param authHeaders 認証ヘッダー
 */
export const getUnreadNotificationCount = async (authHeaders: Record<string, string>) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notifications/unread_count`, {
      headers: authHeaders,
    });
    return response.data.unread_count; // 未読通知件数を返す
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    throw new Error('Failed to fetch unread notification count.');
  }
};
