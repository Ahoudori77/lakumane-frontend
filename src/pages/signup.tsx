import React, { useState } from "react";
import { useRouter } from "next/router";
import api from "../lib/api";
import axios from "axios";

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const response = await api.post("/auth", {
        email,
        password,
        password_confirmation: passwordConfirmation,
        name,
      });
      console.log(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // エラー内容を安全に取得
        const errors = error.response?.data?.errors;
  
        if (Array.isArray(errors)) {
          // 配列の場合、joinを使用
          alert(errors.join(", ") || "サインアップエラーが発生しました");
        } else if (typeof errors === "object" && errors !== null) {
          // オブジェクトの場合、各エラーメッセージを結合
          const errorMessages = Object.values(errors).flat().join(", ");
          alert(errorMessages || "サインアップエラーが発生しました");
        } else {
          alert("サインアップエラーが発生しました");
        }
      } else {
        alert("予期しないエラーが発生しました");
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div>
      <h1>新規登録</h1>
      <input
        type="text"
        placeholder="名前"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="パスワード確認"
        value={passwordConfirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
      />
      <button onClick={handleSignup}>登録</button>
    </div>
  );
};

export default SignupPage;
