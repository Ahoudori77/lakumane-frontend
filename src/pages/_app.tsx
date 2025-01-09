import '../styles/globals.css';
import { useState } from 'react';
import type { AppProps } from 'next/app';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function MyApp({ Component, pageProps }: AppProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

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
