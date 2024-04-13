import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li><Link to="/edit-profile">EditProfile</Link></li>
                        <li><Link to="/chats">Chat</Link></li>
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/logout">Logout</Link></li>
                    </ul>
                </nav>
            </header>
            <main>
                {children}
            </main>
        </div>
    );
}

export default Layout;
