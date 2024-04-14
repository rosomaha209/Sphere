import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import LogoutComponent from './components/LogoutComponent';
import RegisterComponent from './components/RegisterComponent'; // Переконайтеся, що цей компонент створений
import HomePage from './components/HomePage';
import PrivateRoute from './components/PrivateRoute';
import ChatPage from "./components/ChatPage";
import Layout from "./Layout";
import EditProfileComponent from "./components/EditProfileComponent";
import Messages from "./components/messages/Messages";

function App() {
  return (
    <Router>
      <Layout>
        <Switch>

          <Route path="/login" component={LoginComponent} />
          <Route path="/register" component={RegisterComponent} />
          <Route path="/logout" component={LogoutComponent} />
          <PrivateRoute path="/edit-profile" component={EditProfileComponent} />
          <PrivateRoute path="/chats" component={ChatPage} />
          <PrivateRoute path="/chat/:chatId" component={Messages} />
          <PrivateRoute path="/home" component={HomePage} />
          <Redirect from="/" exact to="/home" />
          {/* Додайте інші маршрути, якщо потрібно */}
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
