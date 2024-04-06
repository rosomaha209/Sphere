import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <nav>
                <ul>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/logout">Logout</Link></li>
                    <li><Link to="/chat">Chat</Link></li>
                    <li><Link to="/message">Message</Link></li>
                    {/* Додайте інші посилання за потребою */}
                </ul>
            </nav>
            <p>This is the main page of your application, accessible only to authenticated users.</p>
        </div>
    );
}

export default HomePage;
