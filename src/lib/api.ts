import axios from "axios";

// クライアントサイドかどうかをチェック
const isBrowser = typeof window !== "undefined";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    config.headers["access-token"] = localStorage.getItem("access-token") || "";
    config.headers["client"] = localStorage.getItem("client") || "";
    config.headers["uid"] = localStorage.getItem("uid") || "";
  }
  return config;
});

export default api;