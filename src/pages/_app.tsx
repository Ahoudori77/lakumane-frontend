import '../styles/globals.css';
import { useState, useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import api from '../lib/api';

function MyApp({ Component, pageProps }: AppProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true); // ローディング状態を管理
  const router = useRouter();

  // 認証状態を管理する
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const publicRoutes = ["/login", "/signup"]; // 認証不要なページ
        if (publicRoutes.includes(router.pathname)) {
          setLoading(false);
          return;
        }

        const response = await api.get("/auth/validate_token");
        console.log("User is authenticated:", response.data);
      } catch (error) {
        console.error("User not authenticated, redirecting to login...");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, [router.pathname]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  if (loading) {
    // ローディング中の表示
    return <div>Loading...</div>;
  }

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content">
        <Header
          pageTitle="在庫管理システム"
          toggleSidebar={toggleSidebar}
          userName="山田太郎"
        />
        <Component {...pageProps} />
      </div>
      <style jsx>{`
        .app-layout {
          display: flex;
        }
        .main-content {
          flex-grow: 1;
          margin-left: ${isSidebarOpen ? '250px' : '0'};
          transition: margin-left 0.3s;
          padding: 20px;
        }
      `}</style>
    </div>
  );
}

export default MyApp;
