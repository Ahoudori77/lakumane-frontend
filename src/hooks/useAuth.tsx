import { useEffect } from "react";
import { useRouter } from "next/router";
import api from "../lib/api";

const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const validateUser = async () => {
      try {
        await api.get("/auth/validate_token", {
          headers: {
            "access-token": localStorage.getItem("access-token"),
            client: localStorage.getItem("client"),
            uid: localStorage.getItem("uid"),
          },
        });
        // ユーザーが認証済みの場合、何もしない
      } catch {
        router.push("/login"); // 未認証の場合ログインページにリダイレクト
      }
    };

    validateUser();
  }, [router]);
};

export default useAuth;
