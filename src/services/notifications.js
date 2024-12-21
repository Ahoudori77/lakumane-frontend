import axios from 'axios';

export const getNotifications = async ({ page = 1 }, authHeaders) => {
  const response = await axios.get(`/api/v1/notifications?page=${page}`, {
    headers: authHeaders,
  });
  return response.data;
};
