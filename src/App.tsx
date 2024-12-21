import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotificationHistoryPage from './pages/NotificationHistoryPage';
import UnreadNotificationsList from "./components/NotificationsList";

const App: React.FC = () => (
  <Router>
    <Routes>
      {/* その他のルート */}
      <Route path="/notifications/history" element={<NotificationHistoryPage />} />
      <Route path="/notifications/unread" element={<UnreadNotificationsList />} />
    </Routes>
  </Router>
);

export default App;
