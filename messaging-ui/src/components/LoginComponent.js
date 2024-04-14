import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';



function LoginComponent() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const history = useHistory();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/token/', credentials);
            const { access, refresh } = response.data;

            localStorage.setItem('access', access);
            localStorage.setItem('refresh', refresh);

            // Декодування access токена для отримання userId
            const decoded = jwtDecode(access);
            if (decoded.user_id) {
                localStorage.setItem('userId', decoded.user_id.toString());
                history.push('/home');
            } else {
                console.error('UserId not found in token');
            }
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : 'No response from server');
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
