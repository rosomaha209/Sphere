import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LoginComponent from './components/logistrations/LoginComponent';
import LogoutComponent from './components/logistrations/LogoutComponent';
import RegisterComponent from './components/logistrations/RegisterComponent';
import HomePage from './components/HomePage';
import PrivateRoute from './components/PrivateRoute';
import ChatPage from "./components/chat/ChatPage";
import Layout from "./Layout";
import EditProfileComponent from "./components/EditProfileComponent";
import Messages from "./components/messages/Messages";
import {AuthProvider} from "./components/logistrations/AuthContext";
import NewsFeed from "./components/posts/NewsFeed";
import CreatePostForm from "./components/posts/CreatePostForm";
import TicTacToeGame from "./components/game/TicTacToeGame";
import GameList from "./components/game/GameList";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
      <AuthProvider>
         <Router>
      <Layout>
        <Switch>
          <Route path="/login">
            <LoginComponent setIsLoggedIn={setIsLoggedIn} />
          </Route>
          <Route path="/register" component={RegisterComponent} />
          <Route path="/logout">
            <LogoutComponent setIsLoggedIn={setIsLoggedIn} />
          </Route>
          <PrivateRoute path="/edit-profile" component={EditProfileComponent} isLoggedIn={isLoggedIn} />
          <PrivateRoute path="/chats" component={ChatPage} isLoggedIn={isLoggedIn} />
          <PrivateRoute path="/chat/:chatId" component={Messages} isLoggedIn={isLoggedIn} />
          <PrivateRoute path="/home" component={HomePage} isLoggedIn={isLoggedIn} />
          <PrivateRoute path="/news-feed" component={NewsFeed} />
          <PrivateRoute path="/create-post" component={CreatePostForm} />

          <Route path="/games" component={GameList} />
          <Route path="/game/:gameId" component={TicTacToeGame} />
          <Redirect from="/" exact to="/home" />

          {/* Додайте інші маршрути, якщо потрібно */}
        </Switch>
      </Layout>
    </Router>
      </AuthProvider>

  );
}

export default App;
