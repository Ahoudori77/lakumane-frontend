import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Rails の API ベース URL
  timeout: 5000,
});

export default api;
