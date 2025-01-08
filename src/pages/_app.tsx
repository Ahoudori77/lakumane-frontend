import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Component {...pageProps} />
      </div>
      <style jsx>{`
        .app-layout {
          display: flex;
        }
        .main-content {
          flex-grow: 1;
          margin-left: 250px;
          padding: 20px;
        }
      `}</style>
    </div>
  );
}

export default MyApp;
