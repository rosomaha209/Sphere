import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import LogoutComponent from './components/LogoutComponent';
import RegisterComponent from './components/RegisterComponent'; // Переконайтеся, що цей компонент створений
import HomePage from './components/HomePage';
import PrivateRoute from './components/PrivateRoute';
import ChatPage from "./components/ChatPage";
import MessagePage from "./components/MessagePage";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/login" component={LoginComponent} />
          <Route path="/register" component={RegisterComponent} />
          <Route path="/logout" component={LogoutComponent} />
          <Route path="/chat" component={ChatPage} />
          <Route path="/messge" component={MessagePage} />
          <PrivateRoute path="/home" component={HomePage} />
          <Redirect from="/" exact to="/home" />
          {/* Додайте інші маршрути, якщо потрібно */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
