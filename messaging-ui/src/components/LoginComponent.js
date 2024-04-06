import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function LoginComponent() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const history = useHistory();  // Хук для доступу до історії браузера

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/token/', credentials);
            localStorage.setItem('access', response.data.access);  // Збереження access токена
            localStorage.setItem('refresh', response.data.refresh); // Збереження refresh токена
            history.push('/home');  // Перенаправлення на домашню сторінку
        } catch (error) {
            console.error('Login failed:', error.response.data);
            // Тут можна додати повідомлення про помилку логіну
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Email"
                required
            />
            <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Password"
                required
            />
            <button type="submit">Login</button>
        </form>
    );
}

export default LoginComponent;
