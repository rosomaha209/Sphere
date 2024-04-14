import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './components/logistrations/AuthContext';
import './styles/Layout.css';

const Layout = ({ children }) => {
    const { isLoggedIn } = useAuth();

    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <div className="mainlink">
                            <li><Link to="/home">Home</Link></li>
                            <li><Link to="/edit-profile">Edit Profile</Link></li>
                            <li><Link to="/chats">Chat</Link></li>
                        </div>
                        <div className="logistrations">
                            <li><Link to="/register">Register</Link></li>
                            {!isLoggedIn && <li><Link to="/login">Login</Link></li>}
                        {isLoggedIn && <li><Link to="/logout">Logout</Link></li>}
                        </div>

                    </ul>
                </nav>
            </header>
            <main>
                <div className="content--container">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default Layout;
