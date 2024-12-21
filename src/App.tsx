import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NotificationHistoryPage from './pages/NotificationHistoryPage';

const App = () => (
  <Router>
    <Switch>
      {/* Other Routes */}
      <Route path="/notifications/history" component={NotificationHistoryPage} />
    </Switch>
  </Router>
);

export default App;
